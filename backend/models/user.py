from database.db import db
from sqlalchemy.orm import relationship


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(
        db.String(30),
        nullable=False,
        default="Engineer"
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # One User can manage many stoves
    stoves = relationship(
        "Stove",
        back_populates="user",
        lazy=True
    )

    def __repr__(self):
        return f"<User {self.full_name}>"