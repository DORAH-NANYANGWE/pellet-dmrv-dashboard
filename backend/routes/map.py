from flask import Blueprint, jsonify

from models.device import Device
from models.telemetry import Telemetry

map_bp = Blueprint("map", __name__)


@map_bp.route("/api/map", methods=["GET"])
def get_map_data():

    markers = []

    devices = Device.query.all()

    for device in devices:

        latest = (
            Telemetry.query
            .filter_by(device_id=device.id)
            .order_by(Telemetry.timestamp.desc())
            .first()
        )

        if latest and latest.gps_latitude and latest.gps_longitude:

            markers.append({

                "stove": device.stove.stove_code,

                "device": device.device_code,

                "status": device.status,

                "latitude": latest.gps_latitude,

                "longitude": latest.gps_longitude

            })

    return jsonify(markers)