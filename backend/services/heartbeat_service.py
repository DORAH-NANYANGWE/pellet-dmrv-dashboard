from datetime import datetime, timedelta

from config import Config
from database.db import db

from models.device import Device
from models.event import Event


def check_device_heartbeats():
    """
    Checks every device heartbeat and automatically
    marks devices Online/Offline.

    Generates events only when the status changes.
    """

    timeout = timedelta(
        minutes=Config.HEARTBEAT_TIMEOUT_MINUTES
    )

    now = datetime.utcnow()

    devices = Device.query.all()

    for device in devices:

        # Device has never communicated
        if device.last_seen is None:
            continue

        time_since_last_seen = now - device.last_seen

        # =====================================
        # DEVICE OFFLINE
        # =====================================
        if time_since_last_seen > timeout:

            if device.status != "Offline":

                device.status = "Offline"

                db.session.add(

                    Event(
                        device_code=device.device_code,
                        event_type="device",
                        severity="critical",
                        message="Device Offline"
                    )

                )

        # =====================================
        # DEVICE ONLINE
        # =====================================
        else:

            if device.status != "Online":

                device.status = "Online"

                db.session.add(

                    Event(
                        device_code=device.device_code,
                        event_type="device",
                        severity="info",
                        message="Device Online"
                    )

                )

    db.session.commit()