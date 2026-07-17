from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from database.db import db
from models.device import Device
from models.stove import Stove
from models.user import User
from utils.auth import engineer_required

devices_bp = Blueprint("devices", __name__)


# ==========================================================
# RESPONSE HELPERS
# ==========================================================

def success_response(message, data=None, status_code=200):

    response = {
        "success": True,
        "message": message
    }

    if data is not None:
        response["data"] = data

    return jsonify(response), status_code


def error_response(message, status_code=400):

    return jsonify({
        "success": False,
        "message": message
    }), status_code


# ==========================================================
# VALIDATION
# ==========================================================

def validate_device(data):

    required_fields = [
        "device_code",
        "firmware_version",
        "mac_address"
    ]

    for field in required_fields:

        value = data.get(field)

        if value is None:
            return f"{field} is required."

        if isinstance(value, str):

            if not value.strip():
                return f"{field} is required."

    return None


# ==========================================================
# GET ALL DEVICES
# ==========================================================

@devices_bp.route("/api/devices", methods=["GET"])
@jwt_required()
def get_devices():

    devices = Device.query.order_by(Device.created_at.desc()).all()

    return success_response(

        "Devices retrieved successfully.",

        [device.to_dict() for device in devices]

    )


# ==========================================================
# GET AVAILABLE DEVICES
# ==========================================================

@devices_bp.route("/api/devices/available", methods=["GET"])
@jwt_required()
def available_devices():

    devices = (

        Device.query

        .filter_by(
            assignment_status="Available"
        )

        .order_by(Device.device_code)

        .all()

    )

    return success_response(

        "Available devices retrieved successfully.",

        [device.to_dict() for device in devices]

    )


# ==========================================================
# GET ASSIGNED DEVICES
# ==========================================================

@devices_bp.route("/api/devices/assigned", methods=["GET"])
@jwt_required()
def assigned_devices():

    devices = (

        Device.query

        .filter_by(
            assignment_status="Assigned"
        )

        .order_by(Device.device_code)

        .all()

    )

    return success_response(

        "Assigned devices retrieved successfully.",

        [device.to_dict() for device in devices]

    )


# ==========================================================
# GET RETIRED DEVICES
# ==========================================================

@devices_bp.route("/api/devices/retired", methods=["GET"])
@jwt_required()
def retired_devices():

    devices = (

        Device.query

        .filter_by(
            assignment_status="Retired"
        )

        .order_by(Device.device_code)

        .all()

    )

    return success_response(

        "Retired devices retrieved successfully.",

        [device.to_dict() for device in devices]

    )


# ==========================================================
# GET SINGLE DEVICE
# ==========================================================

@devices_bp.route("/api/devices/<int:device_id>", methods=["GET"])
@jwt_required()
def get_device(device_id):

    device = db.session.get(Device, device_id)

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    return success_response(

        "Device retrieved successfully.",

        device.to_dict()

    )


# ==========================================================
# REGISTER DEVICE
# ==========================================================

@devices_bp.route("/api/devices", methods=["POST"])
@jwt_required()
@engineer_required
def create_device():

    data = request.get_json() or {}

    validation_error = validate_device(data)

    if validation_error:

        return error_response(validation_error)

    if Device.query.filter_by(
        device_code=data["device_code"].strip()
    ).first():

        return error_response(
            "Device code already exists.",
            409
        )

    if Device.query.filter_by(
        mac_address=data["mac_address"].strip()
    ).first():

        return error_response(
            "MAC address already exists.",
            409
        )

    current_user = db.session.get(
        User,
        int(get_jwt_identity())
    )

    if not current_user:

        return error_response(
            "Authenticated user not found.",
            404
        )

    device = Device(

        device_code=data["device_code"].strip(),

        firmware_version=data["firmware_version"].strip(),

        hardware_version=data.get(
            "hardware_version"
        ),

        mac_address=data["mac_address"].strip(),

        status=data.get(
            "status",
            "Offline"
        ),

        assignment_status="Available",

        stove_id=None
    )

    try:

        db.session.add(device)

        db.session.commit()

        return success_response(

            "Device registered successfully.",

            device.to_dict(),

            201

        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )
    # ==========================================================
# PAIR DEVICE TO STOVE
# ==========================================================

@devices_bp.route("/api/devices/<int:device_id>/pair", methods=["PATCH"])
@jwt_required()
@engineer_required
def pair_device(device_id):

    data = request.get_json() or {}

    stove_id = data.get("stove_id")

    if not stove_id:

        return error_response(
            "stove_id is required."
        )

    device = db.session.get(
        Device,
        device_id
    )

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    if device.assignment_status == "Retired":

        return error_response(
            "Retired devices cannot be paired."
        )

    if device.assignment_status == "Assigned":

        return error_response(
            "Device is already assigned."
        )

    stove = db.session.get(
        Stove,
        stove_id
    )

    if not stove:

        return error_response(
            "Stove not found.",
            404
        )

    existing_device = Device.query.filter_by(
        stove_id=stove.id
    ).first()

    if existing_device:

        return error_response(
            "This stove already has a paired device.",
            409
        )

    try:

        device.stove_id = stove.id

        device.assignment_status = "Assigned"

        db.session.commit()

        return success_response(

            "Device paired successfully.",

            device.to_dict()

        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )


# ==========================================================
# UNPAIR DEVICE
# ==========================================================

@devices_bp.route("/api/devices/<int:device_id>/unpair", methods=["PATCH"])
@jwt_required()
@engineer_required
def unpair_device(device_id):

    device = db.session.get(
        Device,
        device_id
    )

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    if device.assignment_status != "Assigned":

        return error_response(
            "Device is not currently assigned."
        )

    try:

        device.stove_id = None

        device.assignment_status = "Available"

        db.session.commit()

        return success_response(

            "Device unpaired successfully.",

            device.to_dict()

        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )


# ==========================================================
# REPLACE DEVICE
# ==========================================================

@devices_bp.route(
    "/api/devices/replace",
    methods=["PATCH"]
)
@jwt_required()
@engineer_required
def replace_device():

    data = request.get_json() or {}

    old_device_id = data.get("old_device_id")
    new_device_id = data.get("new_device_id")

    if not old_device_id or not new_device_id:

        return error_response(
            "old_device_id and new_device_id are required."
        )

    old_device = db.session.get(
        Device,
        old_device_id
    )

    new_device = db.session.get(
        Device,
        new_device_id
    )

    if not old_device:

        return error_response(
            "Old device not found.",
            404
        )

    if not new_device:

        return error_response(
            "New device not found.",
            404
        )

    if old_device.assignment_status != "Assigned":

        return error_response(
            "Old device is not assigned."
        )

    if new_device.assignment_status != "Available":

        return error_response(
            "Replacement device must be available."
        )

    try:

        stove_id = old_device.stove_id

        old_device.stove_id = None
        old_device.assignment_status = "Available"

        new_device.stove_id = stove_id
        new_device.assignment_status = "Assigned"

        db.session.commit()

        return success_response(

            "Device replaced successfully.",

            {
                "old_device": old_device.to_dict(),
                "new_device": new_device.to_dict()
            }

        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )


# ==========================================================
# UPDATE DEVICE STATUS
# ==========================================================

@devices_bp.route(
    "/api/devices/<int:device_id>/status",
    methods=["PATCH"]
)
@jwt_required()
@engineer_required
def update_status(device_id):

    device = db.session.get(
        Device,
        device_id
    )

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    data = request.get_json() or {}

    status = data.get("status")

    if not status:

        return error_response(
            "status is required."
        )

    valid_status = [

        "Online",

        "Offline",

        "Maintenance",

        "Fault"

    ]

    if status not in valid_status:

        return error_response(
            "Invalid device status."
        )

    try:

        device.status = status

        if status == "Online":

            device.last_seen = datetime.utcnow()

        db.session.commit()

        return success_response(

            "Device status updated successfully.",

            device.to_dict()

        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )
    # ==========================================================
# UPDATE FIRMWARE VERSION
# ==========================================================

@devices_bp.route(
    "/api/devices/<int:device_id>/firmware",
    methods=["PATCH"]
)
@jwt_required()
@engineer_required
def update_firmware(device_id):

    device = db.session.get(Device, device_id)

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    data = request.get_json() or {}

    firmware = data.get("firmware_version")

    if not firmware:

        return error_response(
            "firmware_version is required."
        )

    try:

        device.firmware_version = firmware.strip()

        db.session.commit()

        return success_response(
            "Firmware updated successfully.",
            device.to_dict()
        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )


# ==========================================================
# UPDATE HARDWARE VERSION
# ==========================================================

@devices_bp.route(
    "/api/devices/<int:device_id>/hardware",
    methods=["PATCH"]
)
@jwt_required()
@engineer_required
def update_hardware(device_id):

    device = db.session.get(Device, device_id)

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    data = request.get_json() or {}

    hardware = data.get("hardware_version")

    if not hardware:

        return error_response(
            "hardware_version is required."
        )

    try:

        device.hardware_version = hardware.strip()

        db.session.commit()

        return success_response(
            "Hardware version updated successfully.",
            device.to_dict()
        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )


# ==========================================================
# RETIRE DEVICE
# ==========================================================

@devices_bp.route(
    "/api/devices/<int:device_id>/retire",
    methods=["PATCH"]
)
@jwt_required()
@engineer_required
def retire_device(device_id):

    device = db.session.get(Device, device_id)

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    if device.assignment_status == "Assigned":

        return error_response(
            "Unpair the device before retiring it."
        )

    if device.assignment_status == "Retired":

        return error_response(
            "Device is already retired."
        )

    try:

        device.assignment_status = "Retired"

        device.status = "Offline"

        db.session.commit()

        return success_response(
            "Device retired successfully.",
            device.to_dict()
        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )


# ==========================================================
# RESTORE RETIRED DEVICE
# ==========================================================

@devices_bp.route(
    "/api/devices/<int:device_id>/restore",
    methods=["PATCH"]
)
@jwt_required()
@engineer_required
def restore_device(device_id):

    device = db.session.get(Device, device_id)

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    if device.assignment_status != "Retired":

        return error_response(
            "Only retired devices can be restored."
        )

    try:

        device.assignment_status = "Available"

        db.session.commit()

        return success_response(
            "Device restored successfully.",
            device.to_dict()
        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )


# ==========================================================
# HEARTBEAT UPDATE
# ==========================================================

@devices_bp.route(
    "/api/devices/<string:device_code>/heartbeat",
    methods=["POST"]
)
def heartbeat(device_code):

    device = Device.query.filter_by(
        device_code=device_code
    ).first()

    if not device:

        return error_response(
            "Device not found.",
            404
        )

    try:

        device.last_seen = datetime.utcnow()

        device.status = "Online"

        db.session.commit()

        return success_response(
            "Heartbeat received."
        )

    except Exception as e:

        db.session.rollback()

        return error_response(
            str(e),
            500
        )


# ==========================================================
# DEVICE SUMMARY
# ==========================================================

@devices_bp.route(
    "/api/devices/summary",
    methods=["GET"]
)
@jwt_required()
def device_summary():

    total = Device.query.count()

    available = Device.query.filter_by(
        assignment_status="Available"
    ).count()

    assigned = Device.query.filter_by(
        assignment_status="Assigned"
    ).count()

    retired = Device.query.filter_by(
        assignment_status="Retired"
    ).count()

    online = Device.query.filter_by(
        status="Online"
    ).count()

    offline = Device.query.filter_by(
        status="Offline"
    ).count()

    maintenance = Device.query.filter_by(
        status="Maintenance"
    ).count()

    fault = Device.query.filter_by(
        status="Fault"
    ).count()

    return success_response(

        "Device summary retrieved successfully.",

        {
            "total_devices": total,
            "available_devices": available,
            "assigned_devices": assigned,
            "retired_devices": retired,
            "online_devices": online,
            "offline_devices": offline,
            "maintenance_devices": maintenance,
            "fault_devices": fault
        }

    )


# ==========================================================
# END OF FILE
# ==========================================================