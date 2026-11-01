import re

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from app import db
from app.authz import admin_required
from app.models import Category, FoodItem

categories_bp = Blueprint("categories", __name__)


def fail(message, status):
    return jsonify(success=False, message=message), status


def slugify(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "category"


def validate_category(payload, partial=False):
    if not isinstance(payload, dict):
        return None, "Request body must be valid JSON"

    data = {}
    for field, limit in (("name", 80), ("image_url", 500), ("icon", 20), ("description", 255), ("key", 100)):
        if field in payload:
            value = payload[field]
            if not isinstance(value, str) or not value.strip():
                return None, f"{field} must be a non-empty string"
            value = value.strip()
            if len(value) > limit:
                return None, f"{field} must be {limit} characters or fewer"
            data[field] = value

    if not partial and "name" not in data:
        return None, "name is required"

    if "is_active" in payload:
        if not isinstance(payload["is_active"], bool):
            return None, "is_active must be true or false"
        data["is_active"] = payload["is_active"]

    return data, None


@categories_bp.get("/categories")
def list_categories():
    categories = Category.query.filter_by(is_active=True).order_by(Category.name.asc()).all()
    return jsonify(
        success=True,
        data={"categories": [category.to_dict() for category in categories]},
    ), 200


@categories_bp.post("/categories")
@admin_required
def create_category():
    data, error = validate_category(request.get_json(silent=True))
    if error:
        return fail(error, 400)

    slug = slugify(data["name"])
    base = slug
    suffix = 2
    while Category.query.filter_by(slug=slug).first():
        slug = f"{base}-{suffix}"
        suffix += 1

    category = Category(slug=slug, **data)
    try:
        db.session.add(category)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return fail("Category already exists", 409)

    return jsonify(
        success=True,
        message="Category created successfully",
        data={"category": category.to_dict()},
    ), 201


@categories_bp.patch("/categories/<int:category_id>")
@admin_required
def update_category(category_id):
    category = db.session.get(Category, category_id)
    if not category:
        return fail("Category not found", 404)

    data, error = validate_category(request.get_json(silent=True), partial=True)
    if error:
        return fail(error, 400)
    if not data:
        return fail("At least one valid field is required", 400)

    for key, value in data.items():
        setattr(category, key, value)
    if "name" in data:
        base = slugify(data["name"])
        slug = base
        suffix = 2
        while Category.query.filter(
            Category.slug == slug, Category.id != category.id
        ).first():
            slug = f"{base}-{suffix}"
            suffix += 1
        category.slug = slug

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return fail("Could not update category", 409)

    return jsonify(success=True, message="Category updated successfully",
                   data={"category": category.to_dict()}), 200


@categories_bp.delete("/categories/<int:category_id>")
@admin_required
def delete_category(category_id):
    category = db.session.get(Category, category_id)
    if not category:
        return fail("Category not found", 404)
    if FoodItem.query.filter_by(category_id=category.id).first():
        return fail("Category has food items and cannot be deleted", 409)
    category.is_active = False
    db.session.commit()
    return jsonify(success=True, message="Category deactivated successfully"), 200
