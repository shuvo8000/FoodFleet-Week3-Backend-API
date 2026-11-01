import re
from decimal import Decimal, InvalidOperation

from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError

from app import db
from app.authz import admin_required
from app.models import Restaurant, Order

restaurants_bp = Blueprint("restaurants", __name__)


def fail(message, status):
    return jsonify(success=False, message=message), status


def slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "restaurant"


def parse_restaurant(payload, partial=False):
    if not isinstance(payload, dict):
        return None, "Request body must be valid JSON"

    data = {}
    fields = {
        "name": (str, 150),
        "description": (str, 5000),
        "cuisine": (str, 150),
        "tag": (str, 100),
        "division": (str, 100),
        "delivery_time_label": (str, 50),
        "address": (str, 255),
        "city": (str, 100),
        "phone": (str, 20),
        "image_url": (str, 500),
    }

    for field, (kind, max_length) in fields.items():
        if field in payload:
            value = payload[field]
            if value is None and field != "name":
                data[field] = None
                continue
            if not isinstance(value, str) or not value.strip():
                return None, f"{field} must be a non-empty string"
            value = value.strip()
            if len(value) > max_length:
                return None, f"{field} must be {max_length} characters or fewer"
            data[field] = value

    if not partial and "name" not in data:
        return None, "name is required"

    if "delivery_fee" in payload:
        try:
            fee = Decimal(str(payload["delivery_fee"]))
            if not fee.is_finite() or fee < 0:
                raise InvalidOperation
            data["delivery_fee"] = fee
        except (InvalidOperation, ValueError, TypeError):
            return None, "delivery_fee must be a non-negative number"

    if "estimated_delivery_minutes" in payload:
        value = payload["estimated_delivery_minutes"]
        if isinstance(value, bool) or not isinstance(value, int) or value < 1 or value > 300:
            return None, "estimated_delivery_minutes must be an integer from 1 to 300"
        data["estimated_delivery_minutes"] = value

    if "rating" in payload:
        try:
            rating = Decimal(str(payload["rating"]))
            if not rating.is_finite() or rating < 0 or rating > 5:
                raise InvalidOperation
            data["rating"] = rating
        except (InvalidOperation, ValueError, TypeError):
            return None, "rating must be between 0 and 5"

    for field in ("is_open", "is_active"):
        if field in payload:
            if not isinstance(payload[field], bool):
                return None, f"{field} must be true or false"
            data[field] = payload[field]

    return data, None


@restaurants_bp.get("/restaurants")
def list_restaurants():
    query = Restaurant.query.filter_by(is_active=True)

    search = request.args.get("search", "").strip()
    city = request.args.get("city", "").strip()
    division = request.args.get("division", "").strip()
    is_open = request.args.get("is_open")

    if search:
        pattern = f"%{search}%"
        query = query.filter(or_(
            Restaurant.name.ilike(pattern),
            Restaurant.description.ilike(pattern),
            Restaurant.address.ilike(pattern),
            Restaurant.city.ilike(pattern),
            Restaurant.cuisine.ilike(pattern),
            Restaurant.tag.ilike(pattern),
        ))
    if city:
        query = query.filter(Restaurant.city.ilike(city))
    if division:
        query = query.filter(Restaurant.division.ilike(division))
    if is_open in ("true", "false"):
        query = query.filter(Restaurant.is_open == (is_open == "true"))

    try:
        page = max(1, int(request.args.get("page", 1)))
        per_page = min(100, max(1, int(request.args.get("per_page", 20))))
    except ValueError:
        return fail("page and per_page must be integers", 400)

    pagination = query.order_by(Restaurant.name.asc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify(
        success=True,
        data={
            "restaurants": [item.to_dict() for item in pagination.items],
            "pagination": {
                "page": pagination.page,
                "per_page": pagination.per_page,
                "total": pagination.total,
                "pages": pagination.pages,
            },
        },
    ), 200


@restaurants_bp.get("/restaurants/<int:restaurant_id>")
def get_restaurant(restaurant_id):
    restaurant = db.session.get(Restaurant, restaurant_id)
    if not restaurant or not restaurant.is_active:
        return fail("Restaurant not found", 404)
    data = restaurant.to_dict()
    data["food_items"] = [
        food.to_dict() for food in restaurant.food_items if food.is_available
    ]
    return jsonify(success=True, data={"restaurant": data}), 200


@restaurants_bp.post("/restaurants")
@admin_required
def create_restaurant():
    data, error = parse_restaurant(request.get_json(silent=True))
    if error:
        return fail(error, 400)

    base_slug = slugify(data["name"])
    slug = base_slug
    suffix = 2
    while Restaurant.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    restaurant = Restaurant(slug=slug, **data)
    try:
        db.session.add(restaurant)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return fail("Could not create restaurant because a unique value already exists", 409)

    return jsonify(
        success=True,
        message="Restaurant created successfully",
        data={"restaurant": restaurant.to_dict()},
    ), 201


@restaurants_bp.route("/restaurants/<int:restaurant_id>", methods=["PUT", "PATCH"])
@admin_required
def update_restaurant(restaurant_id):
    restaurant = db.session.get(Restaurant, restaurant_id)
    if not restaurant:
        return fail("Restaurant not found", 404)

    data, error = parse_restaurant(request.get_json(silent=True), partial=True)
    if error:
        return fail(error, 400)
    if not data:
        return fail("At least one valid field is required", 400)

    for key, value in data.items():
        setattr(restaurant, key, value)

    if "name" in data:
        base_slug = slugify(data["name"])
        slug = base_slug
        suffix = 2
        while Restaurant.query.filter(
            Restaurant.slug == slug, Restaurant.id != restaurant.id
        ).first():
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        restaurant.slug = slug

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return fail("Could not update restaurant", 409)

    return jsonify(
        success=True,
        message="Restaurant updated successfully",
        data={"restaurant": restaurant.to_dict()},
    ), 200


@restaurants_bp.delete("/restaurants/<int:restaurant_id>")
@admin_required
def delete_restaurant(restaurant_id):
    restaurant = db.session.get(Restaurant, restaurant_id)
    if not restaurant:
        return fail("Restaurant not found", 404)

    if Order.query.filter_by(restaurant_id=restaurant.id).first():
        return fail("Restaurant has existing orders and cannot be deleted", 409)

    restaurant.is_active = False
    db.session.commit()
    return jsonify(success=True, message="Restaurant deactivated successfully"), 200
