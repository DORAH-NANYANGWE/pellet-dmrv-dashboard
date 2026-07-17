"""Add stove retirement fields

Revision ID: 18f6af7f9c65
Revises: 3be1cced8b11
Create Date: 2026-07-17 13:38:14.123576

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "18f6af7f9c65"
down_revision = "3be1cced8b11"
branch_labels = None
depends_on = None


def upgrade():

    with op.batch_alter_table("stoves") as batch_op:

        batch_op.add_column(
            sa.Column(
                "retired",
                sa.Boolean(),
                nullable=False,
                server_default=sa.text("false")
            )
        )

        batch_op.add_column(
            sa.Column(
                "retired_at",
                sa.DateTime(),
                nullable=True
            )
        )


def downgrade():

    with op.batch_alter_table("stoves") as batch_op:

        batch_op.drop_column("retired_at")

        batch_op.drop_column("retired")