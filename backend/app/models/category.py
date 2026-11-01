from app import db


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    image_url = db.Column(db.String(500))
    icon = db.Column(db.String(20))
    description = db.Column(db.String(255))
    key = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    food_items = db.relationship("FoodItem", back_populates="category")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "image_url": self.image_url,
            "icon": self.icon,
            "description": self.description,
            "key": self.key,
            "is_active": self.is_active,
        }
