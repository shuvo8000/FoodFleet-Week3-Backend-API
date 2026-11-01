from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)

@health_bp.get("/health")
def health_check():
    return jsonify(
        success=True,
        message="FoodFleet API is running",
        data={"service": "foodfleet-backend", "version": "1.0.0"}
    ), 200
