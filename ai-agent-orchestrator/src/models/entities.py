import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func
from src.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, nullable=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="citizen")
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    preferred_language = Column(String(10), default="en", nullable=False)
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    reset_token = Column(String(255), nullable=True)
    reset_token_expires_at = Column(DateTime(timezone=True), nullable=True)
    provisioned_by = Column(PG_UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    refresh_token = Column(String(512), unique=True, nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class OTPChallenge(Base):
    __tablename__ = "otp_challenges"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    identifier = Column(String(255), nullable=False, index=True)
    otp_hash = Column(String(255), nullable=False)
    purpose = Column(String(50), nullable=False, default="LOGIN")
    attempts = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=3, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    is_consumed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class OAuthIdentity(Base):
    __tablename__ = "oauth_identities"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider = Column(String(50), nullable=False)
    provider_user_id = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    profile_data = Column(JSON, default=dict)
    linked_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login_at = Column(DateTime(timezone=True), nullable=True)


class AuthAuditEvent(Base):
    __tablename__ = "auth_audit_events"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(100), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    details = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class Application(Base):
    __tablename__ = "applications"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_no = Column(String(50), unique=True, index=True, nullable=False)
    applicant_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    parcel_id = Column(String(100), nullable=False)
    official_ulpin = Column(String(50), nullable=True)
    ulpin_source = Column(String(100), nullable=True)
    ulpin_status = Column(String(50), nullable=False, default="UNASSIGNED")
    ulpin_verified_at = Column(DateTime(timezone=True), nullable=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    taluk = Column(String(100), nullable=False)
    village = Column(String(100), nullable=False)
    survey_number = Column(String(50), nullable=False)
    subdivision_number = Column(String(50), nullable=True)
    extent_acres = Column(Numeric(10, 4), nullable=False)
    status = Column(String(50), nullable=False, default="submitted", index=True)
    current_stage = Column(String(50), nullable=False, default="QUALITY_CHECK")
    review_priority_score = Column(Integer, nullable=False, default=10)
    review_priority_level = Column(String(20), nullable=False, default="low")
    recommended_route = Column(String(100), default="STANDARD_VERIFICATION")
    contributing_findings = Column(JSON, default=list)
    sla_deadline = Column(DateTime(timezone=True), nullable=True)
    metadata_json = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class Document(Base):
    __tablename__ = "documents"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), index=True, nullable=False)
    document_version = Column(Integer, nullable=False, default=1)
    is_current_version = Column(Boolean, nullable=False, default=True)
    resubmission_reason = Column(Text, nullable=True)
    document_type = Column(String(50), nullable=False, default="sale_deed")
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False, default=0)
    mime_type = Column(String(100), nullable=False, default="application/pdf")
    storage_path = Column(String(500), nullable=False)
    quality_score = Column(Numeric(5, 2), default=0.00)
    blur_metric = Column(Numeric(10, 2), nullable=True)
    brightness_metric = Column(Numeric(10, 2), nullable=True)
    contrast_metric = Column(Numeric(10, 2), nullable=True)
    resolution = Column(String(50), nullable=True)
    orientation = Column(Integer, default=0)
    quality_status = Column(String(50), default="PENDING")
    quality_findings = Column(JSON, default=list)
    extracted_text = Column(Text, nullable=True)
    confidence_score = Column(Numeric(5, 2), default=0.00)
    entities = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    evidence_id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), index=True, nullable=False)
    document_id = Column(PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    source_type = Column(String(50), nullable=False)
    source_reference = Column(String(255), nullable=False)
    source_mode = Column(String(20), default="DEMO")
    is_simulated = Column(Boolean, default=True)
    page = Column(Integer, nullable=True)
    region_bbox = Column(JSON, nullable=True)
    extracted_value = Column(JSON, nullable=True)
    expected_value = Column(JSON, nullable=True)
    confidence = Column(Numeric(5, 2), default=0.00)
    finding_type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False, default="INFO")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CadastralParcel(Base):
    __tablename__ = "cadastral_parcels"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="SET NULL"), nullable=True)
    parcel_id = Column(String(100), unique=True, nullable=False)
    survey_number = Column(String(50), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    taluk = Column(String(100), nullable=False)
    village = Column(String(100), nullable=False)
    area_sqm = Column(Numeric(12, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ParcelOverlap(Base):
    __tablename__ = "parcel_overlaps"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_parcel_id = Column(PG_UUID(as_uuid=True), ForeignKey("cadastral_parcels.id", ondelete="CASCADE"), nullable=False)
    overlapping_parcel_id = Column(PG_UUID(as_uuid=True), ForeignKey("cadastral_parcels.id", ondelete="CASCADE"), nullable=False)
    overlap_area_sqm = Column(Numeric(12, 2), nullable=False)
    overlap_percentage = Column(Numeric(5, 2), nullable=False)
    status = Column(String(50), nullable=False, default="DETECTED")
    resolved_by = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)


class LegalFlag(Base):
    __tablename__ = "legal_flags"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    flag_code = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False, default="MEDIUM")
    status = Column(String(50), nullable=False, default="OPEN")
    legal_opinion = Column(Text, nullable=True)
    officer_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)


class HumanDecision(Base):
    __tablename__ = "human_decisions"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    officer_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False)
    stage = Column(String(50), nullable=False)
    decision = Column(String(50), nullable=False)
    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    reason = Column(Text, nullable=False)
    evidence_ids = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLedgerEntry(Base):
    __tablename__ = "audit_ledger"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="SET NULL"), index=True, nullable=True)
    actor_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    actor_role = Column(String(50), nullable=False)
    action = Column(String(100), nullable=False)
    canonical_payload = Column(JSON, nullable=False)
    previous_hash = Column(String(64), nullable=False)
    current_hash = Column(String(64), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
