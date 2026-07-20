"""Expand themes: slug, preset, style JSONB, animation JSONB."""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "002_theme_engine"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("themes", sa.Column("slug", sa.String(100), nullable=True))
    op.add_column("themes", sa.Column("description", sa.Text(), nullable=True))
    op.add_column(
        "themes",
        sa.Column("preset", sa.String(50), nullable=False, server_default="custom"),
    )
    op.add_column(
        "themes",
        sa.Column(
            "style",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
    )
    op.add_column(
        "themes",
        sa.Column(
            "animation",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
    )
    # Backfill slug from name for existing rows
    op.execute(
        """
        UPDATE themes
        SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
        WHERE slug IS NULL OR slug = ''
        """
    )
    op.alter_column("themes", "slug", nullable=False)
    op.create_unique_constraint("uq_themes_slug", "themes", ["slug"])


def downgrade() -> None:
    op.drop_constraint("uq_themes_slug", "themes", type_="unique")
    op.drop_column("themes", "animation")
    op.drop_column("themes", "style")
    op.drop_column("themes", "preset")
    op.drop_column("themes", "description")
    op.drop_column("themes", "slug")
