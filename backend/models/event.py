from database.db import db


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)

    device_code = db.Column(
        db.String(50),
        nullable=False
    )

    event_type = db.Column(
        db.String(50),
        nullable=False
    )

    severity = db.Column(
        db.String(20),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    event_time = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    acknowledged = db.Column(
        db.Boolean,
        default=False
    )