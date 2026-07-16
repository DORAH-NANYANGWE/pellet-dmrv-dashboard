from datetime import datetime

from database.db import db
from models.cooking_session import CookingSession


COOKING_START_TEMP = 150
COOKING_END_TEMP = 120


def update_cooking_session(device, telemetry):

    print("\n========== COOKING SESSION ==========")
    print(f"Device: {device.device_code}")
    print(f"Temperature: {telemetry.temperature}")

    active_session = (
        CookingSession.query
        .filter_by(
            device_id=device.id,
            end_time=None
        )
        .first()
    )

    print(f"Active Session: {active_session}")

    # ======================================
    # START NEW SESSION
    # ======================================
    if (
        active_session is None
        and telemetry.temperature >= COOKING_START_TEMP
    ):

        print(">>> STARTING NEW COOKING SESSION")

        session = CookingSession(
            device_id=device.id,
            device_code=device.device_code,
            start_time=datetime.utcnow(),
            peak_temperature=telemetry.temperature,
            average_temperature=telemetry.temperature
        )

        db.session.add(session)

        print(">>> Cooking session added to database")

        return

    # ======================================
    # UPDATE EXISTING SESSION
    # ======================================
    if active_session is not None:

        print(">>> Updating existing session")

        if (
            telemetry.temperature >
            active_session.peak_temperature
        ):
            active_session.peak_temperature = telemetry.temperature

        if active_session.average_temperature is None:

            active_session.average_temperature = telemetry.temperature

        else:

            active_session.average_temperature = (
                active_session.average_temperature
                + telemetry.temperature
            ) / 2

        # ======================================
        # END SESSION
        # ======================================
        if telemetry.temperature < COOKING_END_TEMP:

            print(">>> ENDING SESSION")

            active_session.end_time = datetime.utcnow()

            duration = (
                active_session.end_time
                - active_session.start_time
            )

            active_session.duration_minutes = int(
                duration.total_seconds() / 60
            )

            print(
                f">>> Duration: {active_session.duration_minutes} minutes"
            )

    print("=====================================\n")