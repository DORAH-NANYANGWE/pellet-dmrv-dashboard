from flask import Blueprint, jsonify

from models.stove import Stove
from models.device import Device
from models.telemetry import Telemetry

fleet_bp = Blueprint("fleet", __name__)


@fleet_bp.route("/api/fleet", methods=["GET"])
def get_fleet():

    fleet = []

    devices = Device.query.all()

    for device in devices:

        latest = (
            Telemetry.query
            .filter_by(device_id=device.id)
            .order_by(Telemetry.timestamp.desc())
            .first()
        )

        fleet.append({

            "stove_id": device.stove.stove_code,

            "device_code": device.device_code,

            "status": device.status,

            "temperature": latest.temperature if latest else None,

            "battery_voltage": latest.battery_voltage if latest else None,

            "last_seen": device.last_seen

        })

    return jsonify(fleet)