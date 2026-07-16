from flask import Blueprint, jsonify

from flask_jwt_extended import jwt_required

from models.device import Device
from models.telemetry import Telemetry

fleet_bp = Blueprint("fleet", __name__)


# ===========================
# Fleet List
# ===========================

@fleet_bp.route("/api/fleet", methods=["GET"])
@jwt_required()
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

            "stove_id": device.stove.id,
            "stove_code": device.stove.stove_code,
            "serial_number": device.stove.serial_number,
            "customer_name": device.stove.customer_name,
            "province": device.stove.province,
            "district": device.stove.district,

            "device_code": device.device_code,
            "firmware_version": device.firmware_version,
            "hardware_version": device.hardware_version,
            "status": device.status,

            "temperature": latest.temperature if latest else None,
            "battery_voltage": latest.battery_voltage if latest else None,
            "signal_strength": latest.signal_strength if latest else None,
            "fan_running": latest.fan_running if latest else None,

            "gps_fix": latest.gps_fix if latest else None,
            "gps_latitude": latest.gps_latitude if latest else None,
            "gps_longitude": latest.gps_longitude if latest else None,

            "sd_card_ok": latest.sd_card_ok if latest else None,

            "last_seen": device.last_seen

        })

    return jsonify(fleet)


# ===========================
# Single Stove
# ===========================

@fleet_bp.route("/api/fleet/<device_code>", methods=["GET"])
@jwt_required()
def get_stove(device_code):

    device = Device.query.filter_by(device_code=device_code).first()

    if device is None:

        return jsonify({
            "message": "Device not found."
        }), 404

    latest = (
        Telemetry.query
        .filter_by(device_id=device.id)
        .order_by(Telemetry.timestamp.desc())
        .first()
    )

    stove = {

        "stove_id": device.stove.id,
        "stove_code": device.stove.stove_code,
        "serial_number": device.stove.serial_number,
        "customer_name": device.stove.customer_name,
        "province": device.stove.province,
        "district": device.stove.district,

        "device_code": device.device_code,
        "firmware_version": device.firmware_version,
        "hardware_version": device.hardware_version,
        "status": device.status,

        "temperature": latest.temperature if latest else None,
        "battery_voltage": latest.battery_voltage if latest else None,
        "signal_strength": latest.signal_strength if latest else None,
        "fan_running": latest.fan_running if latest else None,

        "gps_fix": latest.gps_fix if latest else None,
        "gps_latitude": latest.gps_latitude if latest else None,
        "gps_longitude": latest.gps_longitude if latest else None,

        "sd_card_ok": latest.sd_card_ok if latest else None,

        "last_seen": device.last_seen

    }

    return jsonify(stove)


# ===========================
# Temperature History
# ===========================

@fleet_bp.route("/api/fleet/<device_code>/history", methods=["GET"])
@jwt_required()
def get_temperature_history(device_code):

    device = Device.query.filter_by(device_code=device_code).first()

    if device is None:

        return jsonify({
            "message": "Device not found."
        }), 404

    telemetry = (
        Telemetry.query
        .filter_by(device_id=device.id)
        .order_by(Telemetry.timestamp.asc())
        .all()
    )

    history = []

    for t in telemetry:

        if t.temperature is None:
            continue

        history.append({

            "timestamp": t.timestamp.strftime("%H:%M"),
            "temperature": t.temperature

        })

    return jsonify(history)