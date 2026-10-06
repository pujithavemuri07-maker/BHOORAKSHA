"""Deprecated - Schema ownership unified in root Alembic (alembic/versions/001_initial_schema.py)

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-19 12:00:00.000000
"""
# Unified schema ownership: Root Alembic owns all tables (users, user_sessions, applications, documents, etc.)
# auth-service connects to the same database and does not maintain a conflicting migration history.
from typing import Sequence, Union

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # No-op: root alembic owns users and user_sessions tables
    pass

def downgrade() -> None:
    pass
