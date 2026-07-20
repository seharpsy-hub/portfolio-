"""Add profile section type (dr/owner/student/agency/company)."""

from typing import Sequence, Union

from alembic import op

revision: str = "003_profile_section"
down_revision: Union[str, None] = "002_theme_engine"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("ck_sections_type", "sections", type_="check")
    op.create_check_constraint(
        "ck_sections_type",
        "sections",
        "type IN ('hero', 'about', 'services', 'testimonials', 'contact', 'footer', 'profile')",
    )


def downgrade() -> None:
    op.drop_constraint("ck_sections_type", "sections", type_="check")
    op.create_check_constraint(
        "ck_sections_type",
        "sections",
        "type IN ('hero', 'about', 'services', 'testimonials', 'contact', 'footer')",
    )
