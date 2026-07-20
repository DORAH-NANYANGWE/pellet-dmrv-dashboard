from flask import Blueprint, jsonify
from sqlalchemy import func

from database.db import db
from models.stove import Stove
from models.device import Device
from models.telemetry import Telemetry
from models.event import Event

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/api/reports/summary", methods=["GET"])
def reports_summary():

    total_stoves = Stove.query.count()

    online_devices = Device.query.filter_by(
        status="Online"
    ).count()

    offline_devices = Device.query.filter_by(
        status="Offline"
    ).count()

    active_alerts = Event.query.filter_by(
        acknowledged=False
    ).count()

    telemetry_records = Telemetry.query.count()

    average_temperature = (
        db.session.query(
            func.avg(Telemetry.temperature)
        )
        .filter(
            Telemetry.temperature.isnot(None)
        )
        .scalar()
    )

    if average_temperature is None:
        average_temperature = 0

    low_battery = Telemetry.query.filter(
        Telemetry.battery_voltage.isnot(None),
        Telemetry.battery_voltage < 3.5
    ).count()

    return jsonify({

        "total_stoves": total_stoves,

        "online_devices": online_devices,

        "offline_devices": offline_devices,

        "active_alerts": active_alerts,

        "telemetry_records": telemetry_records,

        "average_temperature": round(
            average_temperature,
            1
        ),

        "low_battery": low_battery

    })


@reports_bp.route("/api/reports/temperature", methods=["GET"])
def reports_temperature():

    results = (

        db.session.query(

            func.date(Telemetry.timestamp).label("date"),

            func.avg(Telemetry.temperature).label(
                "average_temperature"
            )

        )

        .filter(
            Telemetry.temperature.isnot(None)
        )

        .group_by(
            func.date(Telemetry.timestamp)
        )

        .order_by(
            func.date(Telemetry.timestamp)
        )

        .all()

    )

    chart_data = [

        {

            "date": row.date.strftime("%Y-%m-%d"),

            "average_temperature": round(
                float(row.average_temperature),
                1
            )

        }

        for row in results

    ]

    return jsonify(chart_data)


@reports_bp.route("/api/reports/table", methods=["GET"])
def reports_table():

    telemetry = (

        db.session.query(

            Telemetry,

            Device,

            Stove

        )

        .join(
            Device,
            Telemetry.device_id == Device.id
        )

        .join(
            Stove,
            Device.stove_id == Stove.id
        )

        .order_by(
            Telemetry.timestamp.desc()
        )

        .all()

    )

    rows = []

    for telemetry_record, device, stove in telemetry:

        rows.append({

            "date": telemetry_record.timestamp.strftime(
                "%Y-%m-%d %H:%M"
            ),

            "stove_code": stove.stove_code,

            "device_code": device.device_code,

            "temperature": telemetry_record.temperature,

            "battery_voltage": telemetry_record.battery_voltage,

            "signal_strength": telemetry_record.signal_strength,

            "fan_running": telemetry_record.fan_running,

            "gps_fix": telemetry_record.gps_fix,

            "status": device.status

        })

    return jsonify(rows)