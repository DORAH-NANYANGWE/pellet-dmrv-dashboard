from apscheduler.schedulers.background import BackgroundScheduler

from services.heartbeat_service import check_device_heartbeats

scheduler = BackgroundScheduler()


def start_scheduler(app):
    """
    Starts the heartbeat scheduler.

    Runs inside Flask's application context so
    SQLAlchemy can access the database safely.
    """

    def heartbeat_job():

        with app.app_context():

            check_device_heartbeats()

    scheduler.add_job(
        func=heartbeat_job,
        trigger="interval",
        minutes=1,
        id="heartbeat_job",
        replace_existing=True
    )

    scheduler.start()

    print("✓ Heartbeat scheduler started.")