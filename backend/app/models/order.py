from datetime import datetime, timezone
from app import db


def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"),
                        nullable=False, index=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"),
                              nullable=False, index=True)
    order_number = db.Column(db.String(32), unique=True, nullable=False, index=True)
    status = db.Column(db.String(30), nullable=False, default="pending")
    delivery_address = db.Column(db.String(500), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    delivery_fee = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    discount = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    promo_code = db.Column(db.String(40))
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    user = db.relationship("User", back_populates="orders")
    restaurant = db.relationship("Restaurant", back_populates="orders")
    items = db.relationship("OrderItem", back_populates="order",
                            cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "order_number": self.order_number,
            "user_id": self.user_id,
            "restaurant_id": self.restaurant_id,
            "status": self.status,
            "delivery_address": self.delivery_address,
            "customer_phone": self.customer_phone,
            "subtotal": float(self.subtotal),
            "delivery_fee": float(self.delivery_fee),
            "discount": float(self.discount),
            "total": float(self.total),
            "promo_code": self.promo_code,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": [item.to_dict() for item in self.items],
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"
    __table_args__ = (
        db.CheckConstraint("quantity > 0", name="ck_order_item_quantity_positive"),
    )

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    food_item_id = db.Column(db.Integer, db.ForeignKey("food_items.id"),
                             nullable=False)
    item_name = db.Column(db.String(150), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    order = db.relationship("Order", back_populates="items")
    food_item = db.relationship("FoodItem", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "food_item_id": self.food_item_id,
            "item_name": self.item_name,
            "unit_price": float(self.unit_price),
            "quantity": self.quantity,
            "line_total": float(self.unit_price * self.quantity),
        }
