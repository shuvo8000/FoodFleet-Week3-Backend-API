import pytest
from flask_jwt_extended import create_access_token

from app import create_app, db
from app.models import User, Category, Restaurant, FoodItem


@pytest.fixture()
def app_client():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite://",
        "SECRET_KEY": "test-secret",
        "JWT_SECRET_KEY": "test-jwt-secret-key-with-at-least-32-bytes",
    })
    with app.app_context():
        db.create_all()
        customer = User(full_name="Customer", email="customer@example.com",
                        phone="01700000001", role="customer")
        customer.set_password("CustomerPass123")
        admin = User(full_name="Admin", email="admin@example.com",
                     phone="01700000002", role="admin")
        admin.set_password("AdminPass123")
        db.session.add_all([customer, admin])
        db.session.commit()

        tokens = {
            "customer": create_access_token(identity=str(customer.id)),
            "admin": create_access_token(identity=str(admin.id)),
        }
        with app.test_client() as client:
            yield client, tokens

        db.session.remove()
        db.drop_all()


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_public_catalog_endpoints(app_client):
    client, _ = app_client
    assert client.get("/api/v1/restaurants").status_code == 200
    assert client.get("/api/v1/foods").status_code == 200
    assert client.get("/api/v1/categories").status_code == 200


def test_customer_cannot_create_restaurant(app_client):
    client, tokens = app_client
    response = client.post(
        "/api/v1/restaurants",
        json={"name": "Customer Restaurant"},
        headers=auth(tokens["customer"]),
    )
    assert response.status_code == 403


def test_restaurant_and_food_crud(app_client):
    client, tokens = app_client
    headers = auth(tokens["admin"])

    category_response = client.post(
        "/api/v1/categories",
        json={"name": "Bangla Food", "icon": "🍚", "description": "Local meals"},
        headers=headers,
    )
    assert category_response.status_code == 201
    category_id = category_response.get_json()["data"]["category"]["id"]

    restaurant_response = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Test Kitchen",
            "city": "Dhaka",
            "division": "Dhaka",
            "cuisine": "Bangla",
            "delivery_fee": 40,
            "estimated_delivery_minutes": 30,
            "delivery_time_label": "25–35 min",
            "rating": 4.8,
        },
        headers=headers,
    )
    assert restaurant_response.status_code == 201
    restaurant_id = restaurant_response.get_json()["data"]["restaurant"]["id"]

    food_response = client.post(
        "/api/v1/foods",
        json={
            "name": "Test Kacchi",
            "restaurant_id": restaurant_id,
            "category_id": category_id,
            "price": 280,
            "old_price": 320,
            "rating": 4.9,
            "is_spicy": True,
        },
        headers=headers,
    )
    assert food_response.status_code == 201
    food_id = food_response.get_json()["data"]["food"]["id"]

    assert client.get(f"/api/v1/restaurants/{restaurant_id}").status_code == 200
    assert client.get(f"/api/v1/foods/{food_id}").status_code == 200
    assert client.get(f"/api/v1/foods?restaurant_id={restaurant_id}").status_code == 200

    update = client.patch(
        f"/api/v1/foods/{food_id}",
        json={"price": 300},
        headers=headers,
    )
    assert update.status_code == 200
    assert update.get_json()["data"]["food"]["price"] == 300.0

    delete = client.delete(f"/api/v1/foods/{food_id}", headers=headers)
    assert delete.status_code == 200


def test_admin_routes_require_token(app_client):
    client, _ = app_client
    response = client.post("/api/v1/restaurants", json={"name": "No Token"})
    assert response.status_code == 401
