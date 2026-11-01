from decimal import Decimal, InvalidOperation

from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError

from app import db
from app.authz import admin_required
from app.models import Category, FoodItem, Restaurant, CartItem, OrderItem

foods_bp = Blueprint("foods", __name__)


def fail(message, status):
    return jsonify(success=False, message=message), status


def validate_food(payload, partial=False):
    if not isinstance(payload, dict):
        return None, "Request body must be valid JSON"

    data = {}
    string_fields = {"name": 150, "description": 3000, "image_url": 500}
    for field, limit in string_fields.items():
        if field in payload:
            value = payload[field]
            if field == "description" and value is None:
                data[field] = None
                continue
            if not isinstance(value, str) or not value.strip():
                return None, f"{field} must be a non-empty string"
            value = value.strip()
            if len(value) > limit:
                return None, f"{field} must be {limit} characters or fewer"
            data[field] = value

    for field, model in (("restaurant_id", Restaurant), ("category_id", Category)):
        if field in payload:
            value = payload[field]
            if isinstance(value, bool):
                return None, f"{field} must be a valid integer"
            try:
                value = int(value)
            except (TypeError, ValueError):
                return None, f"{field} must be a valid integer"
            if not db.session.get(model, value):
                return None, f"{field.replace('_id', '').capitalize()} not found"
            data[field] = value

    if not partial:
        missing = [field for field in ("name", "restaurant_id", "category_id", "price")
                   if field not in payload]
        if missing:
            return None, f"Required fields: {', '.join(missing)}"

    if "price" in payload:
        try:
            price = Decimal(str(payload["price"]))
            if not price.is_finite() or price < 0:
                raise InvalidOperation
            data["price"] = price
        except (InvalidOperation, ValueError, TypeError):
            return None, "price must be a non-negative number"

    if "old_price" in payload:
        if payload["old_price"] is None:
            data["old_price"] = None
        else:
            try:
                old_price = Decimal(str(payload["old_price"]))
                if not old_price.is_finite() or old_price < 0:
                    raise InvalidOperation
                data["old_price"] = old_price
            except (InvalidOperation, ValueError, TypeError):
                return None, "old_price must be a non-negative number"

    if "rating" in payload:
        try:
            rating = Decimal(str(payload["rating"]))
            if not rating.is_finite() or rating < 0 or rating > 5:
                raise InvalidOperation
            data["rating"] = rating
        except (InvalidOperation, ValueError, TypeError):
            return None, "rating must be between 0 and 5"

    if "is_spicy" in payload:
        if not isinstance(payload["is_spicy"], bool):
            return None, "is_spicy must be true or false"
        data["is_spicy"] = payload["is_spicy"]

    for field in ("is_available", "is_featured"):
        if field in payload:
            if not isinstance(payload[field], bool):
                return None, f"{field} must be true or false"
            data[field] = payload[field]

    return data, None


@foods_bp.get("/foods")
def list_foods():
    query = FoodItem.query.join(Restaurant).filter(
        FoodItem.is_available.is_(True), Restaurant.is_active.is_(True)
    )

    restaurant_id = request.args.get("restaurant_id")
    category_id = request.args.get("category_id")
    search = request.args.get("search", "").strip()
    featured = request.args.get("featured")

    if restaurant_id:
        try:
            query = query.filter(FoodItem.restaurant_id == int(restaurant_id))
        except ValueError:
            return fail("restaurant_id must be an integer", 400)
    if category_id:
        try:
            query = query.filter(FoodItem.category_id == int(category_id))
        except ValueError:
            return fail("category_id must be an integer", 400)
    if search:
        pattern = f"%{search}%"
        query = query.filter(or_(
            FoodItem.name.ilike(pattern),
            FoodItem.description.ilike(pattern),
        ))
    if featured in ("true", "false"):
        query = query.filter(FoodItem.is_featured == (featured == "true"))

    items = query.order_by(FoodItem.name.asc()).all()
    return jsonify(success=True, data={"foods": [item.to_dict() for item in items]}), 200


@foods_bp.get("/foods/<int:food_id>")
def get_food(food_id):
    item = db.session.get(FoodItem, food_id)
    if not item or not item.is_available or not item.restaurant.is_active:
        return fail("Food item not found", 404)
    return jsonify(success=True, data={"food": item.to_dict()}), 200


@foods_bp.post("/foods")
@admin_required
def create_food():
    data, error = validate_food(request.get_json(silent=True))
    if error:
        return fail(error, 400)

    item = FoodItem(**data)
    try:
        db.session.add(item)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return fail("Could not create food item", 409)

    return jsonify(success=True, message="Food item created successfully",
                   data={"food": item.to_dict()}), 201


@foods_bp.route("/foods/<int:food_id>", methods=["PUT", "PATCH"])
@admin_required
def update_food(food_id):
    item = db.session.get(FoodItem, food_id)
    if not item:
        return fail("Food item not found", 404)

    data, error = validate_food(request.get_json(silent=True), partial=True)
    if error:
        return fail(error, 400)
    if not data:
        return fail("At least one valid field is required", 400)

    for key, value in data.items():
        setattr(item, key, value)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return fail("Could not update food item", 409)

    return jsonify(success=True, message="Food item updated successfully",
                   data={"food": item.to_dict()}), 200


@foods_bp.delete("/foods/<int:food_id>")
@admin_required
def delete_food(food_id):
    item = db.session.get(FoodItem, food_id)
    if not item:
        return fail("Food item not found", 404)

    if CartItem.query.filter_by(food_item_id=item.id).first():
        return fail("Food item exists in a cart; mark it unavailable instead", 409)
    if OrderItem.query.filter_by(food_item_id=item.id).first():
        return fail("Food item exists in an order; mark it unavailable instead", 409)

    item.is_available = False
    db.session.commit()
    return jsonify(success=True, message="Food item deactivated successfully"), 200
