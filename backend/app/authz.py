from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app import db
from app.models import User


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        try:
            user_id = int(identity)
        except (TypeError, ValueError):
            return jsonify(success=False, message="Invalid user identity"), 401

        user = db.session.get(User, user_id)
        if not user or not user.is_active:
            return jsonify(success=False, message="User account not found or inactive"), 401
        if user.role != "admin":
            return jsonify(success=False, message="Administrator access required"), 403

        return fn(*args, **kwargs)
    return wrapper
