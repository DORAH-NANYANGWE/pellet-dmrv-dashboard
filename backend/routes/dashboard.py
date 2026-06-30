from flask import Blueprint, jsonify

from models.user import User
from models.stove import Stove
from models.device import Device
from models.telemetry import Telemetry

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/dashboard", methods=["GET"])
def dashboard_summary():

    total_users = User.query.count()

    total_stoves = Stove.query.count()

    total_devices = Device.query.count()

    online_devices = Device.query.filter_by(
        status="Online"
    ).count()

    offline_devices = Device.query.filter_by(
        status="Offline"
    ).count()

    telemetry_records = Telemetry.query.count()

    return jsonify({
        "total_users": total_users,
        "total_stoves": total_stoves,
        "total_devices": total_devices,
        "online_devices": online_devices,
        "offline_devices": offline_devices,
        "telemetry_records": telemetry_records
    })