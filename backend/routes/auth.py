from flask import Blueprint, request, jsonify

from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

from models.user import User

bcrypt = Bcrypt()

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if user is None:

        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401
    
    print("Stored hash:", repr(user.password_hash))
    print("Length:", len(user.password_hash))
    if not bcrypt.check_password_hash(user.password_hash, password):

        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "full_name": user.full_name,
            "role": user.role
        }
    )

    return jsonify({

        "success": True,

        "message": "Login successful.",

        "access_token": access_token,

        "user": {

            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role

        }

    }), 200