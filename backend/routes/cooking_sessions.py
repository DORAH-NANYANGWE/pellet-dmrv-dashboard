from flask import Blueprint, jsonify

from models.cooking_session import CookingSession

cooking_sessions_bp = Blueprint(
    "cooking_sessions",
    __name__
)


@cooking_sessions_bp.route(
    "/api/cooking-sessions",
    methods=["GET"]
)
def get_cooking_sessions():

    sessions = (
        CookingSession.query
        .order_by(CookingSession.start_time.desc())
        .all()
    )

    return jsonify([
        {
            "id": s.id,
            "device_code": s.device_code,
            "start_time": s.start_time,
            "end_time": s.end_time,
            "duration_minutes": s.duration_minutes,
            "peak_temperature": s.peak_temperature,
            "average_temperature": s.average_temperature
        }
        for s in sessions
    ])