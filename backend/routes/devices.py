from flask import Blueprint, request, jsonify

from database.db import db
from models.device import Device

devices_bp = Blueprint("devices", __name__)


# ======================================
# GET ALL DEVICES
# ======================================
@devices_bp.route("/api/devices", methods=["GET"])
def get_devices():

    devices = Device.query.all()

    return jsonify([
        {
            "id": device.id,
            "device_code": device.device_code,
            "firmware_version": device.firmware_version,
            "hardware_version": device.hardware_version,
            "mac_address": device.mac_address,
            "status": device.status,
            "last_seen": device.last_seen,
            "stove_id": device.stove_id
        }
        for device in devices
    ])


# ======================================
# CREATE DEVICE
# ======================================
@devices_bp.route("/api/devices", methods=["POST"])
def create_device():

    data = request.get_json()

    # ===============================
    # Validate required fields
    # ===============================
    required_fields = [
        "device_code",
        "firmware_version",
        "mac_address",
        "stove_id"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    # ===============================
    # Check duplicate device code
    # ===============================
    if Device.query.filter_by(device_code=data["device_code"]).first():
        return jsonify({
            "success": False,
            "message": "Device code already exists."
        }), 409

    # ===============================
    # Check duplicate MAC address
    # ===============================
    if Device.query.filter_by(mac_address=data["mac_address"]).first():
        return jsonify({
            "success": False,
            "message": "MAC address already exists."
        }), 409

    # ===============================
    # Check if stove already has a device
    # ===============================
    if Device.query.filter_by(stove_id=data["stove_id"]).first():
        return jsonify({
            "success": False,
            "message": "This stove already has a registered device."
        }), 409

    # ===============================
    # Create Device
    # ===============================
    try:

        device = Device(
            device_code=data["device_code"],
            firmware_version=data["firmware_version"],
            hardware_version=data.get("hardware_version"),
            mac_address=data["mac_address"],
            status=data.get("status", "Offline"),
            stove_id=data["stove_id"]
        )

        db.session.add(device)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Device created successfully.",
            "data": {
                "device_id": device.id
            }
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500