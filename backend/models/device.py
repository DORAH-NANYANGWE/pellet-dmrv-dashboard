from database.db import db
from sqlalchemy.orm import relationship


class Device(db.Model):
    __tablename__ = "devices"

    id = db.Column(db.Integer, primary_key=True)

    device_code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    firmware_version = db.Column(
        db.String(30),
        nullable=False
    )

    hardware_version = db.Column(
        db.String(30)
    )

    mac_address = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    status = db.Column(
        db.String(20),
        default="Offline"
    )

    last_seen = db.Column(db.DateTime)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # Each device belongs to one stove
    stove_id = db.Column(
        db.Integer,
        db.ForeignKey("stoves.id"),
        unique=True,
        nullable=False
    )

    stove = relationship(
        "Stove",
        back_populates="device"
    )

    # One device sends many telemetry records
    telemetry = relationship(
        "Telemetry",
        back_populates="device",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Device {self.device_code}>"