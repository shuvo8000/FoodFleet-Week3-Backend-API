# FoodFleet Database Schema — Phase 2

The backend uses SQLite through Flask-SQLAlchemy.

## Tables

| Table | Main fields | Purpose |
|---|---|---|
| users | id, full_name, email, phone, password_hash, role, is_active | Customer/admin accounts |
| categories | id, name, slug, image_url, is_active | Food categories |
| restaurants | id, name, slug, address, city, delivery_fee, is_open | Restaurant information |
| food_items | id, restaurant_id, category_id, name, price, is_available | Restaurant menus |
| carts | id, user_id, updated_at | One cart per user |
| cart_items | id, cart_id, food_item_id, quantity | Items in a cart |
| orders | id, user_id, restaurant_id, order_number, status, totals, delivery_address | Customer orders |
| order_items | id, order_id, food_item_id, item_name, unit_price, quantity | Immutable order line snapshots |
| favorites | id, user_id, restaurant_id, food_item_id | Restaurant or food favorites |

## Relationships

- One user can have one cart and many orders.
- One cart contains many cart items.
- Each cart item refers to one food item.
- One restaurant offers many food items.
- One category contains many food items.
- One order belongs to one user and one restaurant.
- One order contains many order items.
- Order items store the item name and unit price at purchase time.
- A favorite belongs to one user and targets either one restaurant or one food item.

## Integrity and security

- Email and phone are unique in the users table.
- Passwords are stored as Werkzeug-generated hashes.
- Cart and order item quantities must be positive.
- Cart items cannot duplicate the same food item in one cart.
- A favorite must target exactly one entity.
- API routes will enforce authentication and role authorization in later phases.

## Initialize the database

From the `backend` directory, activate the virtual environment and run:

```powershell
flask --app run.py init-db
```

The SQLite database is created under `backend/instance/` using the configured database URI.
