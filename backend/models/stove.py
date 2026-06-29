from database.db import db
from sqlalchemy.orm import relationship


class Stove(db.Model):
    __tablename__ = "stoves"

    id = db.Column(db.Integer, primary_key=True)

    stove_code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    serial_number = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    customer_name = db.Column(
        db.String(120),
        nullable=False
    )

    province = db.Column(
        db.String(100)
    )

    district = db.Column(
        db.String(100)
    )

    village = db.Column(
        db.String(100)
    )

    latitude = db.Column(db.Float)

    longitude = db.Column(db.Float)

    installation_date = db.Column(db.Date)

    status = db.Column(
        db.String(20),
        default="Offline"
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # Engineer responsible for this stove
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="stoves"
    )

    # One stove has one monitoring device
    device = relationship(
        "Device",
        back_populates="stove",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Stove {self.stove_code}>"