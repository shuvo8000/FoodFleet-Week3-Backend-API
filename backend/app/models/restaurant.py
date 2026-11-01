from datetime import datetime, timezone
from app import db


def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    slug = db.Column(db.String(170), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    cuisine = db.Column(db.String(150))
    tag = db.Column(db.String(100))
    division = db.Column(db.String(100))
    delivery_time_label = db.Column(db.String(50))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100), default="Dhaka")
    phone = db.Column(db.String(20))
    image_url = db.Column(db.String(500))
    delivery_fee = db.Column(db.Numeric(10, 2), nullable=False, default=50)
    estimated_delivery_minutes = db.Column(db.Integer, nullable=False, default=40)
    rating = db.Column(db.Numeric(2, 1), nullable=False, default=0)
    is_open = db.Column(db.Boolean, nullable=False, default=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    food_items = db.relationship("FoodItem", back_populates="restaurant",
                                 cascade="all, delete-orphan")
    orders = db.relationship("Order", back_populates="restaurant")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "cuisine": self.cuisine,
            "tag": self.tag,
            "division": self.division,
            "delivery_time_label": self.delivery_time_label,
            "address": self.address,
            "city": self.city,
            "phone": self.phone,
            "image_url": self.image_url,
            "delivery_fee": float(self.delivery_fee),
            "estimated_delivery_minutes": self.estimated_delivery_minutes,
            "rating": float(self.rating),
            "is_open": self.is_open,
            "is_active": self.is_active,
        }
