from database.db import db
from sqlalchemy.orm import relationship


class Stove(db.Model):
    __tablename__ = "stoves"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

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
        db.String(100),
        nullable=False
    )

    district = db.Column(
        db.String(100),
        nullable=False
    )

    village = db.Column(
        db.String(100)
    )

    latitude = db.Column(
        db.Float
    )

    longitude = db.Column(
        db.Float
    )

    installation_date = db.Column(
        db.Date
    )

    status = db.Column(
        db.String(20),
        default="Offline",
        nullable=False
    )

    # ----------------------------------
    # Lifecycle Management
    # ----------------------------------

    retired = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    retired_at = db.Column(
        db.DateTime,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # ----------------------------------
    # Engineer Responsible
    # ----------------------------------

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="stoves"
    )

    # ----------------------------------
    # One Stove -> One Device
    # ----------------------------------

    device = relationship(
        "Device",
        back_populates="stove",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def to_dict(self):

        return {

            "id": self.id,

            "stove_code": self.stove_code,

            "serial_number": self.serial_number,

            "customer_name": self.customer_name,

            "province": self.province,

            "district": self.district,

            "village": self.village,

            "latitude": self.latitude,

            "longitude": self.longitude,

            "installation_date":
                self.installation_date.isoformat()
                if self.installation_date else None,

            "status": self.status,

            "retired": self.retired,

            "retired_at":
                self.retired_at.isoformat()
                if self.retired_at else None,

            "created_at":
                self.created_at.isoformat()
                if self.created_at else None,

            "user_id": self.user_id
        }

    def __repr__(self):

        return f"<Stove {self.stove_code}>"