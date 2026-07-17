from datetime import datetime

from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from database.db import db
from models.stove import Stove
from models.user import User
from utils.auth import engineer_required

stoves_bp = Blueprint("stoves", __name__)


# =====================================================
# Helpers
# =====================================================

def success_response(data=None, message=None, status_code=200):

    response = {
        "success": True
    }

    if message:
        response["message"] = message

    if data is not None:
        response["data"] = data

    return jsonify(response), status_code


def error_response(message, status_code=400, **kwargs):

    response = {
        "success": False,
        "message": message
    }

    response.update(kwargs)

    return jsonify(response), status_code


def validate_stove(data):

    required = [
        "stove_code",
        "serial_number",
        "customer_name",
        "province",
        "district"
    ]

    missing = []

    for field in required:

        if not data.get(field):
            missing.append(field)

    return missing


def parse_installation_date(date_string):

    if not date_string:
        return None

    try:

        return datetime.strptime(
            date_string,
            "%Y-%m-%d"
        ).date()

    except ValueError:

        raise ValueError(
            "installation_date must be YYYY-MM-DD."
        )


# =====================================================
# GET ALL STOVES
# =====================================================

@stoves_bp.route("/api/stoves", methods=["GET"])
@jwt_required()
def get_stoves():

    stoves = (
        Stove.query
        .filter_by(retired=False)
        .order_by(Stove.created_at.desc())
        .all()
    )

    return success_response(
        data=[stove.to_dict() for stove in stoves]
    )


# =====================================================
# GET SINGLE STOVE
# =====================================================

@stoves_bp.route("/api/stoves/<int:stove_id>", methods=["GET"])
@jwt_required()
def get_stove(stove_id):

    stove = db.session.get(Stove, stove_id)

    if stove is None:

        return error_response(
            "Stove not found.",
            404
        )

    return success_response(
        stove.to_dict()
    )


# =====================================================
# CREATE STOVE
# =====================================================

@stoves_bp.route("/api/stoves", methods=["POST"])
@jwt_required()
@engineer_required
def create_stove():

    data = request.get_json()

    if not data:

        return error_response(
            "Request body is required."
        )

    missing = validate_stove(data)

    if missing:

        return error_response(
            "Missing required fields.",
            400,
            missing=missing
        )

    existing = Stove.query.filter_by(
        stove_code=data["stove_code"]
    ).first()

    if existing:

        return error_response(
            "Stove code already exists.",
            409
        )

    existing = Stove.query.filter_by(
        serial_number=data["serial_number"]
    ).first()

    if existing:

        return error_response(
            "Serial number already exists.",
            409
        )

    try:

        installation_date = parse_installation_date(
            data.get("installation_date")
        )

    except ValueError as e:

        return error_response(str(e))

    user = db.session.get(
        User,
        int(get_jwt_identity())
    )

    if user is None:

        return error_response(
            "Authenticated user not found.",
            404
        )

    stove = Stove(

        stove_code=data["stove_code"],

        serial_number=data["serial_number"],

        customer_name=data["customer_name"],

        province=data["province"],

        district=data["district"],

        village=data.get("village"),

        latitude=data.get("latitude"),

        longitude=data.get("longitude"),

        installation_date=installation_date,

        status=data.get(
            "status",
            "Offline"
        ),

        user_id=user.id

    )

    try:

        db.session.add(stove)

        db.session.commit()

        return success_response(

            stove.to_dict(),

            "Stove created successfully.",

            201

        )

    except Exception as e:

        db.session.rollback()

        return error_response(

            str(e),

            500

        )
    # =====================================================
# UPDATE STOVE
# =====================================================

@stoves_bp.route("/api/stoves/<int:stove_id>", methods=["PUT"])
@jwt_required()
@engineer_required
def update_stove(stove_id):

    stove = db.session.get(Stove, stove_id)

    if stove is None:
        return error_response(
            "Stove not found.",
            404
        )

    data = request.get_json()

    if not data:
        return error_response(
            "Request body is required."
        )

    if "stove_code" in data:

        existing = Stove.query.filter(
            Stove.stove_code == data["stove_code"],
            Stove.id != stove.id
        ).first()

        if existing:
            return error_response(
                "Stove code already exists.",
                409
            )

        stove.stove_code = data["stove_code"]

    if "serial_number" in data:

        existing = Stove.query.filter(
            Stove.serial_number == data["serial_number"],
            Stove.id != stove.id
        ).first()

        if existing:
            return error_response(
                "Serial number already exists.",
                409
            )

        stove.serial_number = data["serial_number"]

    if "customer_name" in data:
        stove.customer_name = data["customer_name"]

    if "province" in data:
        stove.province = data["province"]

    if "district" in data:
        stove.district = data["district"]

    if "village" in data:
        stove.village = data["village"]

    if "latitude" in data:
        stove.latitude = data["latitude"]

    if "longitude" in data:
        stove.longitude = data["longitude"]

    if "status" in data:
        stove.status = data["status"]

    if "installation_date" in data:

        try:

            stove.installation_date = parse_installation_date(
                data["installation_date"]
            )

        except ValueError as e:

            return error_response(str(e))

    try:

        db.session.commit()

        return success_response(

            stove.to_dict(),

            "Stove updated successfully."

        )

    except Exception as e:

        db.session.rollback()

        return error_response(

            str(e),

            500

        )


# =====================================================
# RETIRE STOVE
# =====================================================

@stoves_bp.route(
    "/api/stoves/<int:stove_id>/retire",
    methods=["PATCH"]
)
@jwt_required()
@engineer_required
def retire_stove(stove_id):

    stove = db.session.get(Stove, stove_id)

    if stove is None:
        return error_response(
            "Stove not found.",
            404
        )

    if stove.retired:

        return error_response(
            "Stove has already been retired."
        )

    stove.retired = True
    stove.retired_at = datetime.utcnow()

    try:

        db.session.commit()

        return success_response(

            message="Stove retired successfully."

        )

    except Exception as e:

        db.session.rollback()

        return error_response(

            str(e),

            500

        )


# =====================================================
# RESTORE STOVE
# =====================================================

@stoves_bp.route(
    "/api/stoves/<int:stove_id>/restore",
    methods=["PATCH"]
)
@jwt_required()
@engineer_required
def restore_stove(stove_id):

    stove = db.session.get(Stove, stove_id)

    if stove is None:
        return error_response(
            "Stove not found.",
            404
        )

    stove.retired = False
    stove.retired_at = None

    try:

        db.session.commit()

        return success_response(

            message="Stove restored successfully."

        )

    except Exception as e:

        db.session.rollback()

        return error_response(

            str(e),

            500

        )


# =====================================================
# GET RETIRED STOVES
# =====================================================

@stoves_bp.route(
    "/api/stoves/retired",
    methods=["GET"]
)
@jwt_required()
def get_retired_stoves():

    stoves = (
        Stove.query
        .filter_by(retired=True)
        .order_by(Stove.retired_at.desc())
        .all()
    )

    return success_response(

        data=[

            stove.to_dict()

            for stove in stoves

        ]

    )