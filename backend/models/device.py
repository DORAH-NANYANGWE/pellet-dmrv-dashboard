from database.db import db
from sqlalchemy.orm import relationship


class Device(db.Model):
    __tablename__ = "devices"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    device_code = db.Column(
        db.String(50),
        unique=True,
        nullable=False,
        index=True
    )

    firmware_version = db.Column(
        db.String(30),
        nullable=False
    )

    hardware_version = db.Column(
        db.String(30),
        nullable=True
    )

    mac_address = db.Column(
        db.String(50),
        unique=True,
        nullable=False,
        index=True
    )

    status = db.Column(
        db.String(20),
        default="Offline",
        nullable=False,
        index=True
    )

    assignment_status = db.Column(
        db.String(20),
        default="Available",
        nullable=False,
        index=True
    )

    last_seen = db.Column(
        db.DateTime,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    # -------------------------------------------------
    # Relationship to Stove
    # A device can exist before it is assigned
    # -------------------------------------------------

    stove_id = db.Column(
        db.Integer,
        db.ForeignKey("stoves.id"),
        unique=True,
        nullable=True
    )

    stove = relationship(
        "Stove",
        back_populates="device"
    )

    # -------------------------------------------------
    # Relationship to Telemetry
    # -------------------------------------------------

    telemetry = relationship(
        "Telemetry",
        back_populates="device",
        cascade="all, delete-orphan"
    )

    # -------------------------------------------------
    # Serialization
    # -------------------------------------------------

    def to_dict(self):

        return {

            "id": self.id,

            "device_code": self.device_code,

            "firmware_version": self.firmware_version,

            "hardware_version": self.hardware_version,

            "mac_address": self.mac_address,

            "status": self.status,

            "assignment_status": self.assignment_status,

            "last_seen":
                self.last_seen.isoformat()
                if self.last_seen else None,

            "created_at":
                self.created_at.isoformat()
                if self.created_at else None,

            "stove_id": self.stove_id

        }

    def __repr__(self):

        return f"<Device {self.device_code}>"