from flask import Blueprint, request, jsonify

from database.db import db
from models.telemetry import Telemetry
from models.device import Device

telemetry_bp = Blueprint("telemetry", __name__)


# ======================================
# GET ALL TELEMETRY
# ======================================
@telemetry_bp.route("/api/telemetry", methods=["GET"])
def get_telemetry():

    telemetry = Telemetry.query.order_by(Telemetry.timestamp.desc()).all()

    return jsonify([
        {
            "id": record.id,
            "device_id": record.device_id,
            "temperature": record.temperature,
            "battery_voltage": record.battery_voltage,
            "fan_running": record.fan_running,
            "gps_latitude": record.gps_latitude,
            "gps_longitude": record.gps_longitude,
            "gps_fix": record.gps_fix,
            "signal_strength": record.signal_strength,
            "sd_card_ok": record.sd_card_ok,
            "timestamp": record.timestamp
        }
        for record in telemetry
    ])


# ======================================
# GET TELEMETRY FOR ONE DEVICE
# ======================================
@telemetry_bp.route("/api/telemetry/<int:device_id>", methods=["GET"])
def get_device_telemetry(device_id):

    telemetry = (
        Telemetry.query
        .filter_by(device_id=device_id)
        .order_by(Telemetry.timestamp.desc())
        .all()
    )

    return jsonify([
        {
            "id": record.id,
            "temperature": record.temperature,
            "battery_voltage": record.battery_voltage,
            "fan_running": record.fan_running,
            "gps_latitude": record.gps_latitude,
            "gps_longitude": record.gps_longitude,
            "gps_fix": record.gps_fix,
            "signal_strength": record.signal_strength,
            "sd_card_ok": record.sd_card_ok,
            "timestamp": record.timestamp
        }
        for record in telemetry
    ])


# ======================================
# GET TEMPERATURE CHART DATA
# ======================================
@telemetry_bp.route("/api/telemetry/chart", methods=["GET"])
def telemetry_chart():

    records = (
        Telemetry.query
        .order_by(Telemetry.timestamp.asc())
        .limit(20)
        .all()
    )

    chart_data = []

    for record in records:

        chart_data.append({
            "time": record.timestamp.strftime("%H:%M"),
            "temperature": record.temperature
        })

    return jsonify(chart_data)


# ======================================
# CREATE TELEMETRY
# ======================================
@telemetry_bp.route("/api/telemetry", methods=["POST"])
def create_telemetry():

    data = request.get_json()

    required_fields = [
        "device_id",
        "temperature",
        "battery_voltage"
    ]

    for field in required_fields:

        if field not in data or data[field] is None:

            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    device = Device.query.get(data["device_id"])

    if not device:

        return jsonify({
            "success": False,
            "message": "Device not found."
        }), 404

    try:

        telemetry = Telemetry(
            device_id=data["device_id"],
            temperature=data["temperature"],
            battery_voltage=data["battery_voltage"],
            fan_running=data.get("fan_running", False),
            gps_latitude=data.get("gps_latitude"),
            gps_longitude=data.get("gps_longitude"),
            gps_fix=data.get("gps_fix", False),
            signal_strength=data.get("signal_strength"),
            sd_card_ok=data.get("sd_card_ok", True)
        )

        db.session.add(telemetry)

        # Update device heartbeat
        device.last_seen = db.func.now()
        device.status = "Online"

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Telemetry received successfully.",
            "telemetry_id": telemetry.id
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500