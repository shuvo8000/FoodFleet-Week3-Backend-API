# FoodFleet Backend

Flask REST API for the FoodFleet front-end project.

## Requirements
- Python 3.10+
- pip

## Setup (Windows PowerShell)
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` and replace both secret values with long random strings.

## Run the API
```powershell
python run.py
```

Health check:
`http://127.0.0.1:5000/api/v1/health`

## Run tests
```powershell
pytest
```

The initial scaffold includes the Flask application factory, extension setup, configurable CORS, JSON error handlers, and a health endpoint. Database models and business APIs will be added in the next phases.


## Phase 2: Database models
The SQLAlchemy models are located in `app/models/`. They define users, categories, restaurants, food items, carts, cart items, orders, order items, and favorites.

Initialize the tables after installing dependencies and creating `.env`:

```powershell
flask --app run.py init-db
```

Database schema documentation is available at `../docs/Database_Schema.md`.


## Phase 3: Authentication API

Available endpoints:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (JWT required)
- `PUT /api/v1/auth/me` (JWT required)

Registration creates a customer account and an empty cart. Passwords are stored as Werkzeug hashes. JWT access tokens are returned after registration and login.

Run the test suite:

```powershell
python -m pytest
```

See `../docs/API_Documentation.md` for request examples and response behavior.


## Phase 4: Restaurant, Category and Food APIs

Public catalog endpoints:
- `GET /api/v1/restaurants`
- `GET /api/v1/restaurants/<id>`
- `GET /api/v1/categories`
- `GET /api/v1/foods`
- `GET /api/v1/foods/<id>`

Admin-only catalog endpoints support create, update and deactivate operations. Create an admin with `python -m flask --app run.py create-admin`.

Upgrade/create the database with `python -m flask --app run.py init-db`, then import the existing frontend catalog with `python -m flask --app run.py seed-demo-data`.

Run tests with `python -m pytest`.
