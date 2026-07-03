from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

from config import Config
from database.db import db

# Import Blueprints
from routes.users import users_bp
from routes.stoves import stoves_bp
from routes.devices import devices_bp
from routes.telemetry import telemetry_bp
from routes.dashboard import dashboard_bp
from routes.fleet import fleet_bp
from routes.map import map_bp
from routes.auth import auth_bp
# Import Models
from models.user import User
from models.stove import Stove
from models.device import Device
from models.telemetry import Telemetry

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Initialize Database
db.init_app(app)

# Initialize JWT
jwt = JWTManager(app)

# Initialize Password Hashing
bcrypt = Bcrypt(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Register Blueprints
app.register_blueprint(users_bp)
app.register_blueprint(stoves_bp)
app.register_blueprint(devices_bp)
app.register_blueprint(telemetry_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(fleet_bp)
app.register_blueprint(map_bp)
app.register_blueprint(auth_bp)


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