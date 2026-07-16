from database.db import db


class CookingSession(db.Model):
    __tablename__ = "cooking_sessions"

    id = db.Column(
        db.Integer,
        primary_key=True
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
        db.Integer
    )

    peak_temperature = db.Column(
        db.Float
    )

    average_temperature = db.Column(
        db.Float
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    def __repr__(self):
        return (
            f"<CookingSession "
            f"{self.device_code} "
            f"{self.start_time}>"
        )