from datetime import datetime, timezone
from app import db


def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Cart(db.Model):
    __tablename__ = "carts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"),
                        nullable=False, unique=True)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow,
                           onupdate=utcnow)

    user = db.relationship("User", back_populates="cart")
    items = db.relationship("CartItem", back_populates="cart",
                            cascade="all, delete-orphan")


class CartItem(db.Model):
    __tablename__ = "cart_items"
    __table_args__ = (
        db.UniqueConstraint("cart_id", "food_item_id",
                            name="uq_cart_food_item"),
        db.CheckConstraint("quantity > 0", name="ck_cart_item_quantity_positive"),
    )

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id"), nullable=False)
    food_item_id = db.Column(db.Integer, db.ForeignKey("food_items.id"),
                             nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    cart = db.relationship("Cart", back_populates="items")
    food_item = db.relationship("FoodItem", back_populates="cart_items")
