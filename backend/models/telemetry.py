from database.db import db
from sqlalchemy.orm import relationship


class Telemetry(db.Model):
    __tablename__ = "telemetry"

    id = db.Column(db.Integer, primary_key=True)

    device_id = db.Column(
        db.Integer,
        db.ForeignKey("devices.id"),
        nullable=False
    )

    temperature = db.Column(db.Float)

    battery_voltage = db.Column(db.Float)

    fan_running = db.Column(
        db.Boolean,
        default=False
    )

    gps_latitude = db.Column(db.Float)

    gps_longitude = db.Column(db.Float)

    gps_fix = db.Column(
        db.Boolean,
        default=False
    )

    signal_strength = db.Column(db.Integer)

    sd_card_ok = db.Column(
        db.Boolean,
        default=True
    )

    timestamp = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # Many telemetry records belong to one device
    device = relationship(
        "Device",
        back_populates="telemetry"
    )

    def __repr__(self):
        return f"<Telemetry Device {self.device_id}>"