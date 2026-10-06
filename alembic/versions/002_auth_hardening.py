"""Auth hardening: OTP challenges, OAuth identities, audit events, session revocation

Revision ID: 002_auth_hardening
Revises: 001_initial_schema
Create Date: 2026-09-20 00:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_auth_hardening'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add provisioned_by column to users
    op.add_column('users', sa.Column('provisioned_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True))

    # 2. Add revoked_at column to user_sessions
    op.add_column('user_sessions', sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True))

    # 3. Create otp_challenges table
    op.create_table(
        'otp_challenges',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('identifier', sa.String(255), nullable=False, index=True),
        sa.Column('otp_hash', sa.String(255), nullable=False),
        sa.Column('purpose', sa.String(50), nullable=False, server_default='LOGIN'),
        sa.Column('attempts', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('max_attempts', sa.Integer(), nullable=False, server_default=sa.text('3')),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_consumed', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )
    op.create_index('idx_otp_identifier_purpose', 'otp_challenges', ['identifier', 'purpose'])

    # 4. Create oauth_identities table
    op.create_table(
        'oauth_identities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('provider', sa.String(50), nullable=False),
        sa.Column('provider_user_id', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('profile_data', postgresql.JSONB(), server_default=sa.text("'{}'::jsonb")),
        sa.Column('linked_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('provider', 'provider_user_id', name='uq_oauth_provider_uid'),
    )
    op.create_index('idx_oauth_user_id', 'oauth_identities', ['user_id'])

    # 5. Create auth_audit_events table
    op.create_table(
        'auth_audit_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('event_type', sa.String(100), nullable=False, index=True),
        sa.Column('email', sa.String(255), nullable=False, index=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('details', postgresql.JSONB(), server_default=sa.text("'{}'::jsonb")),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), index=True),
    )


def downgrade() -> None:
    op.drop_table('auth_audit_events')
    op.drop_table('oauth_identities')
    op.drop_table('otp_challenges')
    op.drop_column('user_sessions', 'revoked_at')
    op.drop_column('users', 'provisioned_by')
