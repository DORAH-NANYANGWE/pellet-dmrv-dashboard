from flask import Blueprint, request, jsonify

from database.db import db
from models.stove import Stove

stoves_bp = Blueprint("stoves", __name__)


@stoves_bp.route("/api/stoves", methods=["GET"])
def get_stoves():

    stoves = Stove.query.all()

    return jsonify([
        {
            "id": stove.id,
            "stove_code": stove.stove_code,
            "serial_number": stove.serial_number,
            "customer_name": stove.customer_name,
            "province": stove.province,
            "district": stove.district,
            "village": stove.village,
            "status": stove.status
        }
        for stove in stoves
    ])


@stoves_bp.route("/api/stoves", methods=["POST"])
def create_stove():

    data = request.get_json()

    stove = Stove(
        stove_code=data["stove_code"],
        serial_number=data["serial_number"],
        customer_name=data["customer_name"],
        province=data["province"],
        district=data["district"],
        village=data["village"],
        user_id=data["user_id"]
    )

    db.session.add(stove)
    db.session.commit()

    return jsonify({
        "message": "Stove created successfully!"
    }), 201