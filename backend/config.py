import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask Secret Key
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "pellet-dmrv-secret-key"
    )

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "pellet-dmrv-jwt-secret-key"
    )

    # Token expires after 1 hour
    JWT_ACCESS_TOKEN_EXPIRES = 3600