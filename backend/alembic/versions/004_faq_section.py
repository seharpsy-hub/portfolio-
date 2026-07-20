"""Add faq section type

Revision ID: 004_faq_section
Revises: 003_profile_section
Create Date: 2026-07-20
"""

from typing import Sequence, Union

from alembic import op

revision: str = "004_faq_section"
down_revision: Union[str, None] = "003_profile_section"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("ck_sections_type", "sections", type_="check")
    op.create_check_constraint(
        "ck_sections_type",
        "sections",
        "type IN ('hero', 'about', 'services', 'testimonials', 'contact', 'footer', 'profile', 'faq')",
    )


def downgrade() -> None:
    op.drop_constraint("ck_sections_type", "sections", type_="check")
    op.create_check_constraint(
        "ck_sections_type",
        "sections",
        "type IN ('hero', 'about', 'services', 'testimonials', 'contact', 'footer', 'profile')",
    )
