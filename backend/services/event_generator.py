from database.db import db
from models.event import Event
from models.telemetry import Telemetry


def generate_events(device, telemetry):
    """
    Generate events only when the device state changes.
    """

    # Get the previous telemetry record for this device
    previous = (
        Telemetry.query
        .filter(
            Telemetry.device_id == telemetry.device_id,
            Telemetry.id != telemetry.id
        )
        .order_by(Telemetry.timestamp.desc())
        .first()
    )

    # No previous telemetry means nothing to compare against
    if previous is None:
        return

    # =====================================
    # FAN FAILURE
    # =====================================
    if previous.fan_running and not telemetry.fan_running:

        db.session.add(
            Event(
                device_code=device.device_code,
                event_type="fan_failure",
                severity="critical",
                message="Fan Not Running"
            )
        )

    # =====================================
    # GPS LOST
    # =====================================
    if previous.gps_fix and not telemetry.gps_fix:

        db.session.add(
            Event(
                device_code=device.device_code,
                event_type="gps_lost",
                severity="warning",
                message="GPS Lost"
            )
        )

    # =====================================
    # BATTERY LOW
    # =====================================
    if (
        previous.battery_voltage >= 3.5
        and telemetry.battery_voltage < 3.5
    ):

        db.session.add(
            Event(
                device_code=device.device_code,
                event_type="battery_low",
                severity="warning",
                message=f"Low Battery ({telemetry.battery_voltage:.2f}V)"
            )
        )

    # =====================================
    # COOKING STARTED
    # NOTE:
    # 150°C is a temporary threshold.
    # We'll tune this after field testing.
    # =====================================
    if (
        previous.temperature < 150
        and telemetry.temperature >= 150
    ):

        db.session.add(
            Event(
                device_code=device.device_code,
                event_type="cooking_started",
                severity="info",
                message="Cooking Started"
            )
        )

    # =====================================
    # COOKING FINISHED
    # Uses hysteresis to avoid repeated events.
    # =====================================
    if (
        previous.temperature >= 150
        and telemetry.temperature < 120
    ):

        db.session.add(
            Event(
                device_code=device.device_code,
                event_type="cooking_finished",
                severity="info",
                message="Cooking Finished"
            )
        )