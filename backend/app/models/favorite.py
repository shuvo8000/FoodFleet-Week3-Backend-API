from app import db


class Favorite(db.Model):
    __tablename__ = "favorites"
    __table_args__ = (
        db.CheckConstraint(
            "(restaurant_id IS NOT NULL AND food_item_id IS NULL) OR "
            "(restaurant_id IS NULL AND food_item_id IS NOT NULL)",
            name="ck_favorite_exactly_one_target"
        ),
        db.UniqueConstraint("user_id", "restaurant_id",
                            name="uq_user_favorite_restaurant"),
        db.UniqueConstraint("user_id", "food_item_id",
                            name="uq_user_favorite_food"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"))
    food_item_id = db.Column(db.Integer, db.ForeignKey("food_items.id"))

    user = db.relationship("User", back_populates="favorites")
    restaurant = db.relationship("Restaurant")
    food_item = db.relationship("FoodItem")
