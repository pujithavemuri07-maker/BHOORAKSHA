"""add old documents digitization tables

Revision ID: 003_add_old_documents
Revises: 002_auth_hardening
Create Date: 2026-09-21 08:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '003_add_old_documents'
down_revision = '002_auth_hardening'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Old Documents Table
    op.create_table(
        'old_documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('document_id', sa.String(length=50), unique=True, nullable=False),
        sa.Column('document_type', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('district', sa.String(length=100), nullable=True),
        sa.Column('taluk', sa.String(length=100), nullable=True),
        sa.Column('village', sa.String(length=100), nullable=True),
        sa.Column('year_from', sa.Integer(), nullable=True),
        sa.Column('year_to', sa.Integer(), nullable=True),
        sa.Column('total_pages', sa.Integer(), server_default='0', nullable=False),
        sa.Column('uploaded_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='uploaded', nullable=False),
        sa.Column('overall_confidence', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('risk_score', sa.Integer(), nullable=True),
        sa.Column('risk_category', sa.String(length=20), nullable=True),
        sa.Column('linked_ulpin', sa.String(length=50), nullable=True),
        sa.Column('linked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('notified_owner', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('notified_owner_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('routed_to', sa.String(length=50), nullable=True),
        sa.Column('routed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('idx_old_docs_status', 'old_documents', ['status'])
    op.create_index('idx_old_docs_uploader', 'old_documents', ['uploaded_by'])
    op.create_index('idx_old_docs_ulpin', 'old_documents', ['linked_ulpin'])

    # 2. Old Document Pages Table
    op.create_table(
        'old_document_pages',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('old_documents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('page_number', sa.Integer(), nullable=False),
        sa.Column('image_path', sa.String(length=500), nullable=True),
        sa.Column('preprocessed_path', sa.String(length=500), nullable=True),
        sa.Column('raw_text', sa.Text(), nullable=True),
        sa.Column('htr_confidence', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('detected_script', sa.String(length=50), nullable=True),
        sa.Column('detected_language', sa.String(length=50), nullable=True),
        sa.Column('layout_json', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('processing_status', sa.String(length=50), server_default='pending', nullable=False),
        sa.Column('processing_error', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('idx_old_pages_doc', 'old_document_pages', ['document_id'])

    # 3. Extracted Records from Old Documents
    op.create_table(
        'old_document_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('old_documents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('page_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('old_document_pages.id', ondelete='SET NULL'), nullable=True),
        sa.Column('survey_number', sa.String(length=100), nullable=True),
        sa.Column('sub_division', sa.String(length=50), nullable=True),
        sa.Column('owner_name', sa.String(length=255), nullable=True),
        sa.Column('father_name', sa.String(length=255), nullable=True),
        sa.Column('area', sa.Numeric(precision=10, scale=4), nullable=True),
        sa.Column('area_unit', sa.String(length=20), server_default='Acres', nullable=True),
        sa.Column('land_type', sa.String(length=100), nullable=True),
        sa.Column('boundaries', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('registration_number', sa.String(length=100), nullable=True),
        sa.Column('registration_date', sa.Date(), nullable=True),
        sa.Column('mutation_number', sa.String(length=100), nullable=True),
        sa.Column('remarks', sa.Text(), nullable=True),
        sa.Column('field_confidence', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('verified_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('verification_notes', sa.Text(), nullable=True),
        sa.Column('final_text', sa.Text(), nullable=True),
        sa.Column('linked_ulpin', sa.String(length=50), nullable=True),
        sa.Column('link_confidence', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('link_status', sa.String(length=30), server_default='unlinked', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('idx_old_records_survey', 'old_document_records', ['survey_number'])

    # 4. Issues Detected
    op.create_table(
        'old_document_issues',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('old_documents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('issue_type', sa.String(length=50), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('old_value', sa.Text(), nullable=True),
        sa.Column('modern_value', sa.Text(), nullable=True),
        sa.Column('recommendation', sa.Text(), nullable=True),
        sa.Column('resolved', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('resolved_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('resolution_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('idx_old_issues_doc', 'old_document_issues', ['document_id'])

    # 5. HTR Corrections Table
    op.create_table(
        'old_document_corrections',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('page_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('old_document_pages.id', ondelete='CASCADE'), nullable=True),
        sa.Column('field_name', sa.String(length=100), nullable=False),
        sa.Column('original_text', sa.Text(), nullable=True),
        sa.Column('corrected_text', sa.Text(), nullable=False),
        sa.Column('bounding_box', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('corrected_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('corrected_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )


def downgrade():
    op.drop_table('old_document_corrections')
    op.drop_table('old_document_issues')
    op.drop_table('old_document_records')
    op.drop_table('old_document_pages')
    op.drop_table('old_documents')
