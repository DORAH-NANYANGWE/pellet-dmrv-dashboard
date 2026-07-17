from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt


def role_required(*allowed_roles):
    """
    Restrict endpoint access to specific roles.
    """

    def decorator(fn):

        @wraps(fn)
        def wrapper(*args, **kwargs):

            claims = get_jwt()

            role = claims.get("role")

            if role not in allowed_roles:

                return jsonify({
                    "success": False,
                    "message": "You are not authorized to perform this action."
                }), 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator


def admin_required(fn):
    return role_required("Administrator")(fn)


def engineer_required(fn):
    return role_required(
        "Administrator",
        "Engineer"
    )(fn)


def management_required(fn):
    return role_required(
        "Administrator",
        "Management"
    )(fn)