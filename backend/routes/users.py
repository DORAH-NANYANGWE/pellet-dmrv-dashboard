from flask import Blueprint, request, jsonify

from database.db import db
from models.user import User

users_bp = Blueprint("users", __name__)


@users_bp.route("/api/users", methods=["GET"])
def get_users():

    users = User.query.all()

    return jsonify([
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
        for user in users
    ])


@users_bp.route("/api/users", methods=["POST"])
def create_user():

    data = request.get_json()

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        password_hash=data["password"],
        role=data["role"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully!",
        "user_id": user.id
    }), 201