# FoodFleet API Documentation

Base URL: `http://127.0.0.1:5000/api/v1`

All request and response bodies use JSON.

## Authentication
- `POST /auth/register` — create a customer account
- `POST /auth/login` — login with email or phone and password
- `GET /auth/me` — get current profile (JWT required)
- `PUT /auth/me` — update current profile (JWT required)

## Restaurants
- `GET /restaurants` — public list; supports `search`, `city`, `division`, `is_open`, `page`, `per_page`
- `GET /restaurants/<id>` — public details including available menu items
- `POST /restaurants` — admin only
- `PUT/PATCH /restaurants/<id>` — admin only
- `DELETE /restaurants/<id>` — admin only; deactivates the restaurant and refuses deletion when orders exist

Example create request:
```json
{
  "name": "Kacchi House",
  "cuisine": "Kacchi · Bangla",
  "city": "Dhaka",
  "division": "Dhaka",
  "delivery_fee": 50,
  "estimated_delivery_minutes": 30,
  "delivery_time_label": "25–35 min",
  "rating": 4.9,
  "image_url": "food/kacchi.jpg"
}
```

## Categories
- `GET /categories` — public active category list
- `POST /categories` — admin only
- `PATCH /categories/<id>` — admin only
- `DELETE /categories/<id>` — admin only; deactivates category and refuses when food items use it

## Food items
- `GET /foods` — public list; supports `restaurant_id`, `category_id`, `search`, `featured`
- `GET /foods/<id>` — public food details
- `POST /foods` — admin only
- `PUT/PATCH /foods/<id>` — admin only
- `DELETE /foods/<id>` — admin only; marks unavailable and refuses hard deletion when cart/order references exist

Example create request:
```json
{
  "name": "Special Kacchi",
  "restaurant_id": 1,
  "category_id": 1,
  "description": "Mutton kacchi with fragrant rice.",
  "price": 280,
  "old_price": 320,
  "rating": 4.9,
  "is_spicy": true,
  "image_url": "food/kacchi.jpg"
}
```

## Admin account setup
From `backend/`, run:
```powershell
python -m flask --app run.py create-admin
```
Follow the prompts to create an administrator. Public registration always creates a `customer`; clients cannot self-assign the admin role.

## Import original frontend catalog
After initializing/upgrading the database:
```powershell
python -m flask --app run.py seed-demo-data
```
This imports the frontend categories, restaurants and food records into SQLite. The source data contains 44 restaurant records and 28 food records; one food record (`f25`) references a restaurant ID (`r11`) that is absent from the frontend restaurant list, so it is skipped and reported by the import command.

## Seed and schema behavior
`init-db` creates missing tables and adds the new nullable catalog metadata columns to existing SQLite tables. It does not delete existing users or other records.
