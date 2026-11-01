import pytest

from app import create_app, db


@pytest.fixture()
def client():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite://",
        "SECRET_KEY": "test-secret",
        "JWT_SECRET_KEY": "test-jwt-secret-key-with-at-least-32-bytes",
    })
    with app.app_context():
        from app.models import User, Category, Restaurant, FoodItem, Cart, CartItem, Order, OrderItem, Favorite
        db.create_all()
        with app.test_client() as test_client:
            yield test_client
        db.session.remove()
        db.drop_all()


def test_register_login_and_profile(client):
    registration = client.post("/api/v1/auth/register", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "phone": "01700000000",
        "password": "StrongPass123",
    })
    assert registration.status_code == 201
    data = registration.get_json()["data"]
    token = data["access_token"]
    assert data["user"]["email"] == "test@example.com"
    assert "password_hash" not in data["user"]

    login = client.post("/api/v1/auth/login", json={
        "identifier": "test@example.com",
        "password": "StrongPass123",
    })
    assert login.status_code == 200

    profile = client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert profile.status_code == 200
    assert profile.get_json()["data"]["user"]["phone"] == "01700000000"


def test_duplicate_registration_rejected(client):
    payload = {
        "full_name": "Test User",
        "email": "test@example.com",
        "phone": "01700000000",
        "password": "StrongPass123",
    }
    assert client.post("/api/v1/auth/register", json=payload).status_code == 201
    assert client.post("/api/v1/auth/register", json=payload).status_code == 409


def test_profile_requires_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
