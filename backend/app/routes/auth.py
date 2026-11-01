import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError

from app import db
from app.models import Cart, User

auth_bp = Blueprint("auth", __name__)


def error(message, status):
    return jsonify(success=False, message=message), status


def validate_registration(payload):
    full_name = str(payload.get("full_name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    phone = str(payload.get("phone", "")).strip()
    password = payload.get("password", "")

    if not full_name or not email or not phone or not password:
        return None, "full_name, email, phone and password are required"

    if len(full_name) > 120:
        return None, "full_name must be 120 characters or fewer"

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return None, "Please provide a valid email address"

    if not re.fullmatch(r"\+?[0-9]{8,15}", phone):
        return None, "Phone must contain 8 to 15 digits, optionally starting with +"

    if not isinstance(password, str) or len(password) < 8:
        return None, "Password must be at least 8 characters"

    return {
        "full_name": full_name,
        "email": email,
        "phone": phone,
        "password": password,
    }, None


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return error("Request body must be valid JSON", 400)

    data, validation_error = validate_registration(payload)
    if validation_error:
        return error(validation_error, 400)

    if User.query.filter(
        (User.email == data["email"]) | (User.phone == data["phone"])
    ).first():
        return error("An account with this email or phone already exists", 409)

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        phone=data["phone"],
        role="customer",
    )
    user.set_password(data["password"])

    try:
        db.session.add(user)
        db.session.flush()
        db.session.add(Cart(user_id=user.id))
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return error("An account with this email or phone already exists", 409)
    except Exception:
        db.session.rollback()
        return error("Unable to create account", 500)

    token = create_access_token(identity=str(user.id))
    return jsonify(
        success=True,
        message="Registration successful",
        data={"access_token": token, "user": user.to_dict()},
    ), 201


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return error("Request body must be valid JSON", 400)

    identifier = str(payload.get("identifier", "")).strip()
    password = payload.get("password", "")

    if not identifier or not isinstance(password, str) or not password:
        return error("identifier and password are required", 400)

    user = User.query.filter(
        (User.email == identifier.lower()) | (User.phone == identifier)
    ).first()

    if not user or not user.is_active or not user.check_password(password):
        return error("Invalid credentials", 401)

    token = create_access_token(identity=str(user.id))
    return jsonify(
        success=True,
        message="Login successful",
        data={"access_token": token, "user": user.to_dict()},
    ), 200


@auth_bp.get("/me")
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user or not user.is_active:
        return error("User account not found or inactive", 404)

    return jsonify(success=True, data={"user": user.to_dict()}), 200


@auth_bp.put("/me")
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user or not user.is_active:
        return error("User account not found or inactive", 404)

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return error("Request body must be valid JSON", 400)

    full_name = payload.get("full_name")
    phone = payload.get("phone")

    if full_name is not None:
        full_name = str(full_name).strip()
        if not full_name or len(full_name) > 120:
            return error("full_name must be between 1 and 120 characters", 400)
        user.full_name = full_name

    if phone is not None:
        phone = str(phone).strip()
        if not re.fullmatch(r"\+?[0-9]{8,15}", phone):
            return error("Phone must contain 8 to 15 digits, optionally starting with +", 400)
        existing = User.query.filter(User.phone == phone, User.id != user.id).first()
        if existing:
            return error("This phone number is already in use", 409)
        user.phone = phone

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return error("Unable to update profile because a value is already in use", 409)

    return jsonify(
        success=True,
        message="Profile updated successfully",
        data={"user": user.to_dict()},
    ), 200
