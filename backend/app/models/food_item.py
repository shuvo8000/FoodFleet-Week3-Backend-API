from app import db


class FoodItem(db.Model):
    __tablename__ = "food_items"

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"),
                              nullable=False, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"),
                            nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    old_price = db.Column(db.Numeric(10, 2))
    rating = db.Column(db.Numeric(2, 1), nullable=False, default=0)
    is_spicy = db.Column(db.Boolean, nullable=False, default=False)
    image_url = db.Column(db.String(500))
    is_available = db.Column(db.Boolean, nullable=False, default=True)
    is_featured = db.Column(db.Boolean, nullable=False, default=False)

    restaurant = db.relationship("Restaurant", back_populates="food_items")
    category = db.relationship("Category", back_populates="food_items")
    cart_items = db.relationship("CartItem", back_populates="food_item")
    order_items = db.relationship("OrderItem", back_populates="food_item")

    def to_dict(self):
        return {
            "id": self.id,
            "restaurant_id": self.restaurant_id,
            "category_id": self.category_id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "old_price": float(self.old_price) if self.old_price is not None else None,
            "rating": float(self.rating),
            "is_spicy": self.is_spicy,
            "image_url": self.image_url,
            "is_available": self.is_available,
            "is_featured": self.is_featured,
        }
