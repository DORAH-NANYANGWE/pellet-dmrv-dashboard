from flask import Blueprint, request, jsonify

from flask_bcrypt import Bcrypt

from flask_jwt_extended import (
    jwt_required,
    get_jwt
)

from database.db import db
from models.user import User

bcrypt = Bcrypt()

users_bp = Blueprint("users", __name__)


@users_bp.route("/api/users", methods=["GET"])
@jwt_required()
def get_users():

    claims = get_jwt()

    if claims["role"] != "Administrator":

        return jsonify({
            "message": "Access denied."
        }), 403

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
@jwt_required()
def create_user():

    claims = get_jwt()

    if claims["role"] != "Administrator":

        return jsonify({
            "message": "Access denied."
        }), 403

    data = request.get_json()

    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_user:

        return jsonify({
            "message": "Email already exists."
        }), 400

    hashed_password = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(

        full_name=data["full_name"],

        email=data["email"],

        password_hash=hashed_password,

        role=data["role"]

    )

    db.session.add(user)
    db.session.commit()

    return jsonify({

        "message": "User created successfully.",

        "user": {

            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role

        }

    }), 201
@users_bp.route("/api/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):

    claims = get_jwt()

    if claims["role"] != "Administrator":

        return jsonify({
            "message": "Access denied."
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "message": "User not found."
        }), 404

    data = request.get_json()

    existing_user = User.query.filter(
        User.email == data["email"],
        User.id != user_id
    ).first()

    if existing_user:

        return jsonify({
            "message": "Email already exists."
        }), 400

    user.full_name = data["full_name"]
    user.email = data["email"]
    user.role = data["role"]

    db.session.commit()

    return jsonify({

        "message": "User updated successfully.",

        "user": {

            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role

        }

    }), 200