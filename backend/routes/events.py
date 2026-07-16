from flask import Blueprint, jsonify

from models.event import Event
from database.db import db

events_bp = Blueprint("events", __name__)


# ======================================
# GET ALL EVENTS
# ======================================
@events_bp.route("/api/events", methods=["GET"])
def get_events():

    events = (
        Event.query
        .order_by(Event.event_time.desc())
        .all()
    )

    return jsonify([
        {
            "id": event.id,
            "device_code": event.device_code,
            "event_type": event.event_type,
            "severity": event.severity,
            "message": event.message,
            "event_time": event.event_time,
            "acknowledged": event.acknowledged
        }
        for event in events
    ])


# ======================================
# GET EVENTS FOR ONE DEVICE
# ======================================
@events_bp.route("/api/events/<string:device_code>", methods=["GET"])
def get_device_events(device_code):

    events = (
        Event.query
        .filter_by(device_code=device_code)
        .order_by(Event.event_time.desc())
        .all()
    )

    return jsonify([
        {
            "id": event.id,
            "device_code": event.device_code,
            "event_type": event.event_type,
            "severity": event.severity,
            "message": event.message,
            "event_time": event.event_time,
            "acknowledged": event.acknowledged
        }
        for event in events

        
    ])
# ======================================
# ACKNOWLEDGE EVENT
# ======================================
@events_bp.route("/api/events/<int:event_id>/acknowledge", methods=["PUT"])
def acknowledge_event(event_id):

    event = Event.query.get(event_id)

    if event is None:
        return jsonify({
            "success": False,
            "message": "Event not found."
        }), 404

    event.acknowledged = True

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Event acknowledged."
    })