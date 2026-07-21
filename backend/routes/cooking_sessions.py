from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy import func, or_

from database.db import db
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
    """
    Get cooking sessions with
    pagination,
    searching,
    filtering,
    and sorting.
    """

    page = request.args.get(
        "page",
        default=1,
        type=int
    )

    per_page = request.args.get(
        "per_page",
        default=20,
        type=int
    )

    search = request.args.get(
        "search",
        "",
        type=str
    )

    status = request.args.get(
        "status",
        "",
        type=str
    )

    stove_id = request.args.get(
        "stove_id",
        type=int
    )

    start_date = request.args.get(
        "start_date",
        "",
        type=str
    )

    end_date = request.args.get(
        "end_date",
        "",
        type=str
    )

    query = CookingSession.query

    # -------------------------
    # Search
    # -------------------------

    if search:

        query = query.filter(
            or_(
                CookingSession.device_code.ilike(
                    f"%{search}%"
                )
            )
        )

    # -------------------------
    # Status Filter
    # -------------------------

    if status:

        query = query.filter(
            CookingSession.status == status
        )

    # -------------------------
    # Stove Filter
    # -------------------------

    if stove_id:

        query = query.filter(
            CookingSession.stove_id == stove_id
        )

    # -------------------------
    # Date Filters
    # -------------------------

    if start_date:

        try:

            query = query.filter(
                CookingSession.start_time >=
                datetime.fromisoformat(start_date)
            )

        except Exception:
            pass

    if end_date:

        try:

            query = query.filter(
                CookingSession.start_time <=
                datetime.fromisoformat(end_date)
            )

        except Exception:
            pass

    query = query.order_by(
        CookingSession.start_time.desc()
    )

    pagination = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    sessions = [
        session.to_dict()
        for session in pagination.items
    ]

    return jsonify({

        "items": sessions,

        "pagination": {

            "page": pagination.page,
            "pages": pagination.pages,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev

        }

    })
@cooking_sessions_bp.route(
    "/api/cooking-sessions/<int:session_id>",
    methods=["GET"]
)
def get_cooking_session(session_id):

    session = CookingSession.query.get(session_id)

    if not session:

        return jsonify({
            "error": "Cooking session not found."
        }), 404

    return jsonify(session.to_dict())


@cooking_sessions_bp.route(
    "/api/cooking-sessions/active",
    methods=["GET"]
)
def get_active_cooking_sessions():

    sessions = (
        CookingSession.query
        .filter(
            CookingSession.end_time.is_(None)
        )
        .order_by(
            CookingSession.start_time.desc()
        )
        .all()
    )

    return jsonify([
        session.to_dict()
        for session in sessions
    ])


@cooking_sessions_bp.route(
    "/api/cooking-sessions/summary",
    methods=["GET"]
)
def cooking_sessions_summary():

    total_sessions = CookingSession.query.count()

    active_sessions = (
        CookingSession.query
        .filter(
            CookingSession.end_time.is_(None)
        )
        .count()
    )

    completed_sessions = (
        CookingSession.query
        .filter(
            CookingSession.end_time.is_not(None)
        )
        .count()
    )

    avg_duration = (
        db.session.query(
            func.avg(
                CookingSession.duration_minutes
            )
        ).scalar()
        or 0
    )

    avg_temperature = (
        db.session.query(
            func.avg(
                CookingSession.average_temperature
            )
        ).scalar()
        or 0
    )

    peak_temperature = (
        db.session.query(
            func.max(
                CookingSession.peak_temperature
            )
        ).scalar()
        or 0
    )

    total_fuel = (
        db.session.query(
            func.sum(
                CookingSession.estimated_fuel_used
            )
        ).scalar()
        or 0
    )

    total_co2 = (
        db.session.query(
            func.sum(
                CookingSession.estimated_co2_saved
            )
        ).scalar()
        or 0
    )

    return jsonify({

        "total_sessions": total_sessions,

        "active_sessions": active_sessions,

        "completed_sessions": completed_sessions,

        "average_duration": round(
            float(avg_duration),
            2
        ),

        "average_temperature": round(
            float(avg_temperature),
            2
        ),

        "peak_temperature": round(
            float(peak_temperature),
            2
        ),

        "total_fuel_used": round(
            float(total_fuel),
            2
        ),

        "total_co2_saved": round(
            float(total_co2),
            2
        )

    })