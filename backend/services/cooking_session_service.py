from datetime import datetime

from database.db import db
from models.cooking_session import CookingSession


COOKING_START_TEMP = 150
COOKING_END_TEMP = 120
LOW_TEMPERATURE_LIMIT = 3


def update_cooking_session(device, telemetry):

    # Ignore invalid telemetry
    if telemetry.temperature is None:
        return

    # Find active session
    active_session = (
        CookingSession.query
        .filter_by(
            device_id=device.id,
            end_time=None
        )
        .first()
    )

    # =====================================================
    # START NEW SESSION
    # =====================================================
    if active_session is None:

        if telemetry.temperature >= COOKING_START_TEMP:

            session = CookingSession(
                stove_id=device.stove_id,
                device_id=device.id,
                device_code=device.device_code,
                start_time=telemetry.timestamp,
                peak_temperature=telemetry.temperature,
                average_temperature=telemetry.temperature,
                telemetry_points=1,
                low_temperature_count=0,
                status="Active"
            )

            db.session.add(session)

        return

    # =====================================================
    # UPDATE ACTIVE SESSION
    # =====================================================

    # Peak temperature
    if telemetry.temperature > active_session.peak_temperature:
        active_session.peak_temperature = telemetry.temperature

    # Average temperature
    total_temperature = (
        active_session.average_temperature
        * active_session.telemetry_points
    )

    active_session.telemetry_points += 1

    active_session.average_temperature = (
        total_temperature + telemetry.temperature
    ) / active_session.telemetry_points

    # =====================================================
    # CHECK FOR SESSION END
    # =====================================================

    if telemetry.temperature < COOKING_END_TEMP:
        active_session.low_temperature_count += 1
    else:
        active_session.low_temperature_count = 0

    if active_session.low_temperature_count >= LOW_TEMPERATURE_LIMIT:

        active_session.end_time = telemetry.timestamp

        duration = (
            active_session.end_time
            - active_session.start_time
        )

        active_session.duration_minutes = round(
            duration.total_seconds() / 60,
            1
        )

        active_session.status = "Completed"

        # Placeholder values until the official methodology is provided
        active_session.estimated_fuel_used = 0
        active_session.estimated_co2_saved = 0