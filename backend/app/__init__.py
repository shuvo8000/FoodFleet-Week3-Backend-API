import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text
from dotenv import load_dotenv

db = SQLAlchemy()
jwt = JWTManager()

def create_app(test_config=None):
    load_dotenv()

    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)

    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY", "foodfleet-development-secret-change-before-deployment-2026"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "foodfleet-jwt-development-secret-change-before-deployment-2026"),
        SQLALCHEMY_DATABASE_URI=os.getenv(
            "DATABASE_URL", "sqlite:///foodfleet.db"
        ),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_ACCESS_TOKEN_EXPIRES=3600,
    )

    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    jwt.init_app(app)

    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify(success=False, message="Authorization token is required"), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify(success=False, message="Invalid authorization token"), 422

    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):
        return jsonify(success=False, message="Authorization token has expired"), 401

    allowed_origins = [
        origin.strip()
        for origin in os.getenv(
            "FRONTEND_ORIGINS",
            "http://127.0.0.1:5500,http://localhost:5500"
        ).split(",")
        if origin.strip()
    ]
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

    from app.models import User, Category, Restaurant, FoodItem, Cart, CartItem, Order, OrderItem, Favorite
    from app.routes.health import health_bp
    from app.routes.auth import auth_bp
    from app.routes.restaurants import restaurants_bp
    from app.routes.categories import categories_bp
    from app.routes.foods import foods_bp
    app.register_blueprint(health_bp, url_prefix="/api/v1")
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(restaurants_bp, url_prefix="/api/v1")
    app.register_blueprint(categories_bp, url_prefix="/api/v1")
    app.register_blueprint(foods_bp, url_prefix="/api/v1")

    @app.cli.command("init-db")
    def init_db_command():
        """Create tables and add new nullable columns to an existing SQLite database."""
        db.create_all()
        additions = {
            "categories": {
                "icon": "VARCHAR(20)",
                "description": "VARCHAR(255)",
                "key": "VARCHAR(100)",
            },
            "restaurants": {
                "cuisine": "VARCHAR(150)",
                "tag": "VARCHAR(100)",
                "division": "VARCHAR(100)",
                "delivery_time_label": "VARCHAR(50)",
            },
            "food_items": {
                "old_price": "NUMERIC(10, 2)",
                "rating": "NUMERIC(2, 1) NOT NULL DEFAULT 0",
                "is_spicy": "BOOLEAN NOT NULL DEFAULT 0",
            },
        }
        inspector = inspect(db.engine)
        with db.engine.begin() as connection:
            for table, columns in additions.items():
                existing = {column["name"] for column in inspect(db.engine).get_columns(table)}
                for column, sql_type in columns.items():
                    if column not in existing:
                        connection.execute(text(
                            f'ALTER TABLE "{table}" ADD COLUMN "{column}" {sql_type}'
                        ))
        print("FoodFleet database tables created/updated.")

    @app.cli.command("create-admin")
    def create_admin_command():
        """Create an administrator account interactively."""
        from getpass import getpass
        from app.models import User
        name = input("Admin full name: ").strip()
        email = input("Admin email: ").strip().lower()
        phone = input("Admin phone: ").strip()
        password = getpass("Admin password (minimum 8 characters): ")
        if not name or not email or not phone or len(password) < 8:
            print("All fields are required and password must be at least 8 characters.")
            return
        if User.query.filter((User.email == email) | (User.phone == phone)).first():
            print("An account with this email or phone already exists.")
            return
        admin = User(full_name=name, email=email, phone=phone, role="admin")
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"Administrator account created: {email}")

    @app.cli.command("seed-demo-data")
    def seed_demo_data_command():
        """Import the original FoodFleet frontend categories, restaurants and foods."""
        import json
        import re
        from pathlib import Path
        from app.models import Category, Restaurant, FoodItem

        seed_file = Path(__file__).resolve().parent.parent / "data" / "seed_data.json"
        payload = json.loads(seed_file.read_text(encoding="utf-8"))

        def make_slug(value):
            return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "item"

        category_map = {}
        category_rows = list(payload.get("categories", []))
        existing_names = {row["name"].lower() for row in category_rows}
        for food in payload.get("foods", []):
            category_name = food.get("category", "").strip()
            if category_name and category_name.lower() not in existing_names:
                category_rows.append({
                    "name": category_name,
                    "key": category_name,
                    "icon": None,
                    "desc": None,
                })
                existing_names.add(category_name.lower())

        for row in category_rows:
            category = Category.query.filter_by(name=row["name"]).first()
            if not category:
                base = make_slug(row["name"])
                slug = base
                suffix = 2
                while Category.query.filter_by(slug=slug).first():
                    slug = f"{base}-{suffix}"
                    suffix += 1
                category = Category(
                    name=row["name"],
                    slug=slug,
                    icon=row.get("icon"),
                    description=row.get("desc"),
                    key=row.get("key"),
                    is_active=True,
                )
                db.session.add(category)
                db.session.flush()
            category_map[row["name"].lower()] = category

        restaurant_map = {}
        skipped_restaurants = 0
        for row in payload.get("restaurants", []):
            restaurant = Restaurant.query.filter_by(slug=make_slug(row["name"])).first()
            if not restaurant:
                time_label = row.get("time", "30–40 min")
                numbers = [int(value) for value in re.findall(r"\d+", time_label)]
                estimated = round(sum(numbers[:2]) / len(numbers[:2])) if numbers else 40
                restaurant = Restaurant(
                    name=row["name"],
                    slug=make_slug(row["name"]),
                    description=row.get("tag"),
                    cuisine=row.get("cuisine"),
                    tag=row.get("tag"),
                    city=row.get("city"),
                    division=row.get("division"),
                    delivery_time_label=time_label,
                    delivery_fee=row.get("fee", 50),
                    estimated_delivery_minutes=estimated,
                    rating=row.get("rating", 0),
                    image_url=row.get("image"),
                    is_open=True,
                    is_active=True,
                )
                db.session.add(restaurant)
                db.session.flush()
            restaurant_map[row["id"]] = restaurant

        imported_foods = 0
        skipped_foods = []
        for row in payload.get("foods", []):
            restaurant = restaurant_map.get(row.get("restaurantId"))
            category = category_map.get(row.get("category", "").lower())
            if not restaurant or not category:
                skipped_foods.append(row.get("id"))
                continue
            exists = FoodItem.query.filter_by(
                restaurant_id=restaurant.id, name=row["name"]
            ).first()
            if exists:
                continue
            item = FoodItem(
                restaurant_id=restaurant.id,
                category_id=category.id,
                name=row["name"],
                description=row.get("desc"),
                price=row["price"],
                old_price=row.get("oldPrice"),
                rating=row.get("rating", 0),
                is_spicy=row.get("spicy", False),
                image_url=row.get("image"),
                is_available=True,
                is_featured=False,
            )
            db.session.add(item)
            imported_foods += 1

        db.session.commit()
        print(
            f"Demo data ready: {len(category_map)} categories, "
            f"{len(restaurant_map)} restaurants, {imported_foods} new food items."
        )
        if skipped_foods:
            print("Skipped food records due to missing restaurant/category:", ", ".join(skipped_foods))
        if payload.get("notes"):
            for note in payload["notes"]:
                print("Note:", note)

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify(success=False, message="Resource not found"), 404

    @app.errorhandler(500)
    def internal_error(_error):
        return jsonify(success=False, message="Internal server error"), 500

    return app
