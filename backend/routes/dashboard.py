from datetime import datetime, timedelta

from flask import Blueprint, jsonify
from sqlalchemy import func

from database.db import db
from models.user import User
from models.stove import Stove
from models.device import Device
from models.telemetry import Telemetry
from models.event import Event

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/dashboard", methods=["GET"])
def dashboard_summary():

    total_users = User.query.count()

    total_stoves = Stove.query.count()

    total_devices = Device.query.count()

    # -----------------------------------------
    # Online / Offline Calculation
    # -----------------------------------------

    heartbeat_timeout = datetime.utcnow() - timedelta(minutes=15)

    online_devices = Device.query.filter(
        Device.last_seen.isnot(None),
        Device.last_seen >= heartbeat_timeout
    ).count()

    offline_devices = total_devices - online_devices

    # -----------------------------------------
    # Telemetry Statistics
    # -----------------------------------------

    telemetry_records = Telemetry.query.count()

    average_temperature = (
        db.session.query(func.avg(Telemetry.temperature))
        .filter(Telemetry.temperature.isnot(None))
        .scalar()
    )

    if average_temperature is None:
        average_temperature = 0

    low_battery = Telemetry.query.filter(
        Telemetry.battery_voltage.isnot(None),
        Telemetry.battery_voltage < 3.5
    ).count()

    # -----------------------------------------
    # Alerts
    # -----------------------------------------

    active_alerts = Event.query.filter_by(
        acknowledged=False
    ).count()

    return jsonify({

        "total_users": total_users,

        "total_stoves": total_stoves,

        "total_devices": total_devices,

        "online_devices": online_devices,

        "offline_devices": offline_devices,

        "telemetry_records": telemetry_records,

        "average_temperature": round(
            average_temperature,
            1
        ),

        "low_battery": low_battery,

        "active_alerts": active_alerts

    })