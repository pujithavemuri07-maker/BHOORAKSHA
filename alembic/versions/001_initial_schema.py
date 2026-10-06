"""Initial schema with document versioning, evidence records, and cryptographic audit ledger

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-19 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 0. Ensure required extensions exist
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    op.execute('CREATE EXTENSION IF NOT EXISTS "postgis";')

    # 1. Users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('phone', sa.String(20), unique=True, nullable=True),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), nullable=False, server_default='citizen'),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('preferred_language', sa.String(10), nullable=False, server_default='en'),
        sa.Column('failed_login_attempts', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('locked_until', sa.DateTime(timezone=True), nullable=True),
        sa.Column('reset_token', sa.String(255), nullable=True),
        sa.Column('reset_token_expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_role', 'users', ['role'])

    # 2. User Sessions
    op.create_table(
        'user_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('refresh_token', sa.String(512), unique=True, nullable=False),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )

    # 3. Applications
    op.create_table(
        'applications',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('application_no', sa.String(50), unique=True, nullable=False),
        sa.Column('applicant_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('parcel_id', sa.String(100), nullable=False),
        sa.Column('official_ulpin', sa.String(50), nullable=True),
        sa.Column('ulpin_source', sa.String(100), nullable=True),
        sa.Column('ulpin_status', sa.String(50), nullable=False, server_default='UNASSIGNED'),
        sa.Column('ulpin_verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('district', sa.String(100), nullable=False),
        sa.Column('taluk', sa.String(100), nullable=False),
        sa.Column('village', sa.String(100), nullable=False),
        sa.Column('survey_number', sa.String(50), nullable=False),
        sa.Column('subdivision_number', sa.String(50), nullable=True),
        sa.Column('extent_acres', sa.Numeric(10, 4), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='submitted'),
        sa.Column('current_stage', sa.String(50), nullable=False, server_default='QUALITY_CHECK'),
        sa.Column('review_priority_score', sa.Integer(), nullable=False, server_default=sa.text('10')),
        sa.Column('review_priority_level', sa.String(20), nullable=False, server_default='low'),
        sa.Column('recommended_route', sa.String(100), nullable=True, server_default='STANDARD_VERIFICATION'),
        sa.Column('contributing_findings', postgresql.JSONB(), server_default=sa.text("'[]'::jsonb")),
        sa.Column('sla_deadline', sa.DateTime(timezone=True), nullable=True),
        sa.Column('metadata', postgresql.JSONB(), server_default=sa.text("'{}'::jsonb")),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )
    op.create_index('idx_applications_no', 'applications', ['application_no'])
    op.create_index('idx_applications_status', 'applications', ['status'])

    # 4. Documents (with versioning & quality assessment)
    op.create_table(
        'documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('application_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('applications.id', ondelete='CASCADE'), nullable=False),
        sa.Column('document_version', sa.Integer(), nullable=False, server_default=sa.text('1')),
        sa.Column('is_current_version', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('resubmission_reason', sa.Text(), nullable=True),
        sa.Column('document_type', sa.String(50), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('mime_type', sa.String(100), nullable=False),
        sa.Column('storage_path', sa.String(500), nullable=False),
        sa.Column('quality_score', sa.Numeric(5, 2), server_default=sa.text('0.00')),
        sa.Column('blur_metric', sa.Numeric(10, 2), nullable=True),
        sa.Column('brightness_metric', sa.Numeric(10, 2), nullable=True),
        sa.Column('resolution', sa.String(50), nullable=True),
        sa.Column('orientation', sa.Integer(), server_default=sa.text('0')),
        sa.Column('quality_status', sa.String(50), server_default='PENDING'),
        sa.Column('quality_findings', postgresql.JSONB(), server_default=sa.text("'[]'::jsonb")),
        sa.Column('extracted_text', sa.Text(), nullable=True),
        sa.Column('confidence_score', sa.Numeric(5, 2), server_default=sa.text('0.00')),
        sa.Column('entities', postgresql.JSONB(), server_default=sa.text("'{}'::jsonb")),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )
    op.create_index('idx_documents_app', 'documents', ['application_id'])

    # 5. Evidence Records
    op.create_table(
        'evidence_records',
        sa.Column('evidence_id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('application_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('applications.id', ondelete='CASCADE'), nullable=False),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('documents.id', ondelete='SET NULL'), nullable=True),
        sa.Column('source_type', sa.String(50), nullable=False),
        sa.Column('source_reference', sa.String(255), nullable=False),
        sa.Column('source_mode', sa.String(20), nullable=False, server_default='DEMO'),
        sa.Column('is_simulated', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('page', sa.Integer(), nullable=True),
        sa.Column('region_bbox', postgresql.JSONB(), nullable=True),
        sa.Column('extracted_value', postgresql.JSONB(), nullable=True),
        sa.Column('expected_value', postgresql.JSONB(), nullable=True),
        sa.Column('confidence', sa.Numeric(5, 2), server_default=sa.text('0.00')),
        sa.Column('finding_type', sa.String(100), nullable=False),
        sa.Column('severity', sa.String(20), nullable=False, server_default='INFO'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )
    op.create_index('idx_evidence_app', 'evidence_records', ['application_id'])

    # 6. Cadastral Parcels
    op.create_table(
        'cadastral_parcels',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('application_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('applications.id', ondelete='SET NULL'), nullable=True),
        sa.Column('parcel_id', sa.String(100), unique=True, nullable=False),
        sa.Column('survey_number', sa.String(50), nullable=False),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('district', sa.String(100), nullable=False),
        sa.Column('taluk', sa.String(100), nullable=False),
        sa.Column('village', sa.String(100), nullable=False),
        sa.Column('area_sqm', sa.Numeric(12, 2), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )

    # 7. Parcel Overlaps
    op.create_table(
        'parcel_overlaps',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('source_parcel_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('cadastral_parcels.id', ondelete='CASCADE'), nullable=False),
        sa.Column('overlapping_parcel_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('cadastral_parcels.id', ondelete='CASCADE'), nullable=False),
        sa.Column('overlap_area_sqm', sa.Numeric(12, 2), nullable=False),
        sa.Column('overlap_percentage', sa.Numeric(5, 2), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='DETECTED'),
        sa.Column('resolved_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('resolution_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 8. Legal Flags
    op.create_table(
        'legal_flags',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('application_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('applications.id', ondelete='CASCADE'), nullable=False),
        sa.Column('flag_code', sa.String(50), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('severity', sa.String(20), nullable=False, server_default='MEDIUM'),
        sa.Column('status', sa.String(50), nullable=False, server_default='OPEN'),
        sa.Column('legal_opinion', sa.Text(), nullable=True),
        sa.Column('officer_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 9. Human Decisions
    op.create_table(
        'human_decisions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('application_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('applications.id', ondelete='CASCADE'), nullable=False),
        sa.Column('officer_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('role', sa.String(50), nullable=False),
        sa.Column('action', sa.String(50), nullable=False),
        sa.Column('stage', sa.String(50), nullable=False),
        sa.Column('old_value', postgresql.JSONB(), nullable=True),
        sa.Column('new_value', postgresql.JSONB(), nullable=True),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('evidence_ids', postgresql.JSONB(), server_default=sa.text("'[]'::jsonb")),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )

    # 10. Cryptographic Audit Ledger
    op.create_table(
        'audit_ledger',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('application_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('applications.id', ondelete='SET NULL'), nullable=True),
        sa.Column('actor_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('actor_role', sa.String(50), nullable=False),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('canonical_payload', postgresql.JSONB(), nullable=False),
        sa.Column('previous_hash', sa.String(64), nullable=False),
        sa.Column('current_hash', sa.String(64), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )
    op.create_index('idx_audit_ledger_created', 'audit_ledger', ['created_at'])
    op.create_index('idx_audit_ledger_app', 'audit_ledger', ['application_id'])


def downgrade() -> None:
    op.drop_table('audit_ledger')
    op.drop_table('human_decisions')
    op.drop_table('legal_flags')
    op.drop_table('parcel_overlaps')
    op.drop_table('cadastral_parcels')
    op.drop_table('evidence_records')
    op.drop_table('documents')
    op.drop_table('applications')
    op.drop_table('user_sessions')
    op.drop_table('users')
