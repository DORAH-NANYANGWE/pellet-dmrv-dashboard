from database.db import db


class CookingSession(db.Model):
    __tablename__ = "cooking_sessions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    stove_id = db.Column(
        db.Integer,
        db.ForeignKey("stoves.id"),
        nullable=True
    )

    device_id = db.Column(
        db.Integer,
        db.ForeignKey("devices.id"),
        nullable=False
    )

    device_code = db.Column(
        db.String(50),
        nullable=False
    )

    start_time = db.Column(
        db.DateTime,
        nullable=False
    )

    end_time = db.Column(
        db.DateTime
    )

    duration_minutes = db.Column(
        db.Float,
        default=0
    )

    peak_temperature = db.Column(
        db.Float,
        default=0
    )

    average_temperature = db.Column(
        db.Float,
        default=0
    )

    telemetry_points = db.Column(
        db.Integer,
        default=0
    )

    low_temperature_count = db.Column(
        db.Integer,
        default=0
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="Completed"
    )

    fuel_type = db.Column(
        db.String(50),
        nullable=False,
        default="Pellets"
    )

    estimated_fuel_used = db.Column(
        db.Float,
        default=0
    )

    estimated_co2_saved = db.Column(
        db.Float,
        default=0
    )

    notes = db.Column(
        db.Text
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # Relationships
    stove = db.relationship(
        "Stove",
        backref=db.backref(
            "cooking_sessions",
            lazy=True
        )
    )

    device = db.relationship(
        "Device",
        backref=db.backref(
            "cooking_sessions",
            lazy=True
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "stove_id": self.stove_id,
            "device_id": self.device_id,
            "device_code": self.device_code,
            "start_time": (
                self.start_time.isoformat()
                if self.start_time else None
            ),
            "end_time": (
                self.end_time.isoformat()
                if self.end_time else None
            ),
            "duration_minutes": self.duration_minutes,
            "peak_temperature": self.peak_temperature,
            "average_temperature": self.average_temperature,
            "telemetry_points": self.telemetry_points,
            "low_temperature_count": self.low_temperature_count,
            "status": self.status,
            "fuel_type": self.fuel_type,
            "estimated_fuel_used": self.estimated_fuel_used,
            "estimated_co2_saved": self.estimated_co2_saved,
            "notes": self.notes,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            )
        }

    def __repr__(self):
        return (
            f"<CookingSession "
            f"{self.device_code} "
            f"{self.start_time}>"
        )