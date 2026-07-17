"""Update device model for pairing

Revision ID: b52b8ad62400
Revises: 18f6af7f9c65
Create Date: 2026-07-17 14:36:15.441485

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "b52b8ad62400"
down_revision = "18f6af7f9c65"
branch_labels = None
depends_on = None


def upgrade():
    """
    Device pairing update.

    This migration ONLY updates the devices table.
    It intentionally does not modify any other tables.
    """

    with op.batch_alter_table("devices", schema=None) as batch_op:

        batch_op.add_column(
            sa.Column(
                "assignment_status",
                sa.String(length=20),
                nullable=False,
                server_default="Available",
            )
        )

        batch_op.alter_column(
            "assignment_status",
            server_default=None,
        )

        batch_op.alter_column(
            "status",
            existing_type=sa.VARCHAR(length=20),
            nullable=False,
        )

        batch_op.alter_column(
            "created_at",
            existing_type=postgresql.TIMESTAMP(),
            nullable=False,
            existing_server_default=sa.text("now()"),
        )

        batch_op.alter_column(
            "stove_id",
            existing_type=sa.INTEGER(),
            nullable=True,
        )

        batch_op.drop_constraint(
            batch_op.f("devices_device_code_key"),
            type_="unique",
        )

        batch_op.drop_constraint(
            batch_op.f("devices_mac_address_key"),
            type_="unique",
        )

        batch_op.create_index(
            batch_op.f("ix_devices_assignment_status"),
            ["assignment_status"],
            unique=False,
        )

        batch_op.create_index(
            batch_op.f("ix_devices_device_code"),
            ["device_code"],
            unique=True,
        )

        batch_op.create_index(
            batch_op.f("ix_devices_mac_address"),
            ["mac_address"],
            unique=True,
        )

        batch_op.create_index(
            batch_op.f("ix_devices_status"),
            ["status"],
            unique=False,
        )


def downgrade():

    with op.batch_alter_table("devices", schema=None) as batch_op:

        batch_op.drop_index(batch_op.f("ix_devices_status"))

        batch_op.drop_index(batch_op.f("ix_devices_mac_address"))

        batch_op.drop_index(batch_op.f("ix_devices_device_code"))

        batch_op.drop_index(batch_op.f("ix_devices_assignment_status"))

        batch_op.create_unique_constraint(
            batch_op.f("devices_mac_address_key"),
            ["mac_address"],
            postgresql_nulls_not_distinct=False,
        )

        batch_op.create_unique_constraint(
            batch_op.f("devices_device_code_key"),
            ["device_code"],
            postgresql_nulls_not_distinct=False,
        )

        batch_op.alter_column(
            "stove_id",
            existing_type=sa.INTEGER(),
            nullable=False,
        )

        batch_op.alter_column(
            "created_at",
            existing_type=postgresql.TIMESTAMP(),
            nullable=True,
            existing_server_default=sa.text("now()"),
        )

        batch_op.alter_column(
            "status",
            existing_type=sa.VARCHAR(length=20),
            nullable=True,
        )

        batch_op.drop_column("assignment_status")