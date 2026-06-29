from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from routes.devices import devices_bp

from config import Config
from database.db import db

# Import models
from models.user import User
from models.stove import Stove
from models.device import Device
from models.telemetry import Telemetry

# Import Blueprints
from routes.stoves import stoves_bp
from routes.users import users_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Register Blueprints
app.register_blueprint(stoves_bp)
app.register_blueprint(users_bp)
app.register_blueprint(devices_bp)


@app.route("/")
def home():
    return {
        "message": "Biomass Stove DMRV Backend is running!",
        "status": "success"
    }


if __name__ == "__main__":
    with app.app_context():
        print("\n===== REGISTERED ROUTES =====")
        for rule in app.url_map.iter_rules():
            print(f"{rule.methods} -> {rule.rule}")
        print("=============================\n")

    app.run(debug=True)