from datetime import datetime, timedelta

from app import app
from database.db import db

from models.device import Device
from models.telemetry import Telemetry


with app.app_context():

    # Find DEV001
    device = Device.query.filter_by(device_code="DEV001").first()

    if device is None:

        print("Device DEV001 not found.")

        exit()

    # Delete existing telemetry
    Telemetry.query.filter_by(device_id=device.id).delete()

    start_time = datetime.now() - timedelta(minutes=45)

    temperatures = [
        165,
        172,
        180,
        189,
        198,
        206,
        214,
        221,
        228,
        235
    ]

    battery = [
        4.18,
        4.17,
        4.16,
        4.15,
        4.14,
        4.13,
        4.12,
        4.10,
        4.07,
        4.04
    ]

    signal = [
        -74,
        -75,
        -76,
        -78,
        -79,
        -80,
        -81,
        -80,
        -79,
        -78
    ]

    for i in range(len(temperatures)):

        telemetry = Telemetry(

            device_id=device.id,

            temperature=temperatures[i],

            battery_voltage=battery[i],

            fan_running=True,

            gps_fix=True,

            gps_latitude=-15.387,

            gps_longitude=28.322,

            signal_strength=signal[i],

            sd_card_ok=True,

            timestamp=start_time + timedelta(minutes=i * 5)

        )

        db.session.add(telemetry)

    db.session.commit()

    print("Telemetry reseeded successfully.")