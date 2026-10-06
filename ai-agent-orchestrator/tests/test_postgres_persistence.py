"""
Real PostgreSQL Persistence Integration Tests.
Executes against active PostgreSQL database defined in settings.DATABASE_URL.
If PostgreSQL is unreachable, tests are safely skipped and reported as
POSTGRESQL INTEGRATION TEST NOT VERIFIED.
"""
import uuid
import pytest
from sqlalchemy import text
from src.database import engine, SessionLocal, Base
from src.models.entities import User
from src.repositories.application_repository import application_repo
from src.repositories.document_repository import document_repo
from src.repositories.evidence_repository import evidence_repo
from src.repositories.decision_repository import decision_repo
from src.services.audit_service import audit_service

TEST_USER_ID = uuid.UUID("a0000000-0000-0000-0000-000000000001")

def is_postgres_available() -> bool:
    """Checks if the configured database is accessible and tables are prepared."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        Base.metadata.create_all(bind=engine)
        return True
    except Exception:
        return False


POSTGRES_AVAILABLE = is_postgres_available()
SKIP_REASON = "Database instance not accessible at DATABASE_URL - PERSISTENCE TEST NOT VERIFIED"


@pytest.mark.skipif(not POSTGRES_AVAILABLE, reason=SKIP_REASON)
class TestPostgresPersistence:
    """
    End-to-End Persistence Integration Test Suite.
    Validates table persistence and cross-session retrieval.
    """
    @pytest.fixture(autouse=True)
    def setup_db_tables(self):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            existing = db.query(User).filter(User.id == TEST_USER_ID).first()
            if not existing:
                test_user = User(
                    id=TEST_USER_ID,
                    email="persistence_test@bhooraksha.gov.in",
                    full_name="Persistence Test User",
                    password_hash="argon2_mock_hash",
                    role="citizen"
                )
                db.add(test_user)
                db.commit()
        finally:
            db.close()

    def test_application_creation_in_postgres(self):
        """Validates Application record creation and retrieval from PostgreSQL."""
        db = SessionLocal()
        try:
            app_no = f"REQ-PG-{uuid.uuid4().hex[:8].upper()}"
            created_app = application_repo.create_application(
                db=db,
                app_data={
                    "application_no": app_no,
                    "applicant_id": TEST_USER_ID,
                    "parcel_id": f"PARCEL-{uuid.uuid4().hex[:6]}",
                    "state": "Karnataka",
                    "district": "Bengaluru Urban",
                    "taluk": "Anekal",
                    "village": "Sarjapura",
                    "survey_number": "101/A",
                    "extent_acres": 1.75,
                    "status": "SUBMITTED",
                    "ulpin_status": "UNASSIGNED",
                    "metadata": {"applicant_name": "PG Test Applicant"},
                }
            )
            assert created_app is not None
            assert created_app.application_no == app_no

            # Query back from DB
            fetched = application_repo.get_application(db, app_no)
            assert fetched is not None
            assert fetched.metadata_json.get("applicant_name") == "PG Test Applicant"
            assert float(fetched.extent_acres) == 1.75
        finally:
            db.close()

    def test_document_upload_in_postgres(self):
        """Validates Document versioning and persistence in PostgreSQL."""
        db = SessionLocal()
        try:
            app_no = f"REQ-PG-{uuid.uuid4().hex[:8].upper()}"
            app = application_repo.create_application(
                db=db,
                app_data={
                    "application_no": app_no,
                    "applicant_id": TEST_USER_ID,
                    "parcel_id": f"PARCEL-{uuid.uuid4().hex[:6]}",
                    "state": "Karnataka",
                    "district": "Bengaluru Urban",
                    "taluk": "Anekal",
                    "village": "Sarjapura",
                    "survey_number": "102/B",
                    "extent_acres": 2.5,
                    "metadata": {"applicant_name": "Doc Test Applicant"},
                }
            )

            # Version 1
            doc_v1 = document_repo.create_document(
                db=db,
                doc_data={
                    "application_id": app.id,
                    "document_version": 1,
                    "is_current_version": True,
                    "file_name": "sale_deed_v1.pdf",
                    "storage_path": f"/storage/{app_no}/sale_deed_v1.pdf",
                    "document_type": "sale_deed",
                }
            )
            assert doc_v1.document_version == 1
            assert doc_v1.is_current_version is True

            # Resubmission: Deprecate v1 and create v2
            document_repo.deprecate_previous_versions(db, app.id)
            doc_v2 = document_repo.create_document(
                db=db,
                doc_data={
                    "application_id": app.id,
                    "document_version": 2,
                    "is_current_version": True,
                    "file_name": "sale_deed_v2.pdf",
                    "storage_path": f"/storage/{app_no}/sale_deed_v2.pdf",
                    "document_type": "sale_deed",
                    "resubmission_reason": "High resolution scan",
                }
            )

            docs = document_repo.get_documents(db, app.id)
            assert len(docs) == 2
            assert docs[0].is_current_version is False
            assert docs[1].is_current_version is True
        finally:
            db.close()

    def test_evidence_records_in_postgres(self):
        """Validates EvidenceRecord batch insertion and retrieval from PostgreSQL."""
        db = SessionLocal()
        try:
            app_no = f"REQ-PG-{uuid.uuid4().hex[:8].upper()}"
            app = application_repo.create_application(
                db=db,
                app_data={
                    "application_no": app_no,
                    "applicant_id": TEST_USER_ID,
                    "parcel_id": f"PARCEL-{uuid.uuid4().hex[:6]}",
                    "state": "Karnataka",
                    "district": "Bengaluru Urban",
                    "taluk": "Anekal",
                    "village": "Sarjapura",
                    "survey_number": "103/C",
                    "extent_acres": 3.0,
                    "metadata": {"applicant_name": "Evidence Test Applicant"},
                }
            )

            evidence_items = [
                {
                    "evidence_id": str(uuid.uuid4()),
                    "source_type": "OCR",
                    "source_reference": "sale_deed.pdf",
                    "finding_type": "EXTRACTED_OWNER",
                    "severity": "INFO",
                    "extracted_value": "Evidence Test Applicant",
                    "confidence": 0.95,
                    "source_mode": "DEMO",
                    "is_simulated": True,
                },
                {
                    "evidence_id": str(uuid.uuid4()),
                    "source_type": "GIS",
                    "source_reference": "Cadastral Layer",
                    "finding_type": "GIS_SPATIAL_ANALYSIS",
                    "severity": "LOW",
                    "extracted_value": "3.0 Acres",
                    "confidence": 0.98,
                    "source_mode": "DEMO",
                    "is_simulated": True,
                }
            ]

            saved = evidence_repo.save_evidence_records(db, app.id, None, evidence_items)
            assert len(saved) == 2

            retrieved = evidence_repo.get_evidence_for_application(db, app.id)
            assert len(retrieved) == 2
            assert {e.source_type for e in retrieved} == {"OCR", "GIS"}
        finally:
            db.close()

    def test_human_decision_in_postgres(self):
        """Validates HumanDecision record persistence and retrieval from PostgreSQL."""
        db = SessionLocal()
        try:
            app_no = f"REQ-PG-{uuid.uuid4().hex[:8].upper()}"
            app = application_repo.create_application(
                db=db,
                app_data={
                    "application_no": app_no,
                    "applicant_id": TEST_USER_ID,
                    "parcel_id": f"PARCEL-{uuid.uuid4().hex[:6]}",
                    "state": "Karnataka",
                    "district": "Bengaluru Urban",
                    "taluk": "Anekal",
                    "village": "Sarjapura",
                    "survey_number": "104/D",
                    "extent_acres": 1.2,
                    "metadata": {"applicant_name": "Decision Test Applicant"},
                }
            )

            decision = decision_repo.create_decision(
                db=db,
                decision_data={
                    "application_id": app.id,
                    "stage": "VERIFIER_STAGE",
                    "action": "APPROVE",
                    "decision": "APPROVE",
                    "role": "verifier",
                    "reason": "All physical and digital records match.",
                    "officer_id": TEST_USER_ID,
                    "evidence_ids": [],
                }
            )
            assert decision is not None
            assert decision.decision == "APPROVE"

            history = decision_repo.get_decisions(db, app.id)
            assert len(history) == 1
            assert history[0].role == "verifier"
        finally:
            db.close()

    def test_audit_ledger_in_postgres(self):
        """Validates AuditLedgerEntry cryptographic hash chain in PostgreSQL."""
        db = SessionLocal()
        try:
            app_no = f"REQ-PG-{uuid.uuid4().hex[:8].upper()}"
            app = application_repo.create_application(
                db=db,
                app_data={
                    "application_no": app_no,
                    "applicant_id": TEST_USER_ID,
                    "parcel_id": f"PARCEL-{uuid.uuid4().hex[:6]}",
                    "state": "Karnataka",
                    "district": "Bengaluru Urban",
                    "taluk": "Anekal",
                    "village": "Sarjapura",
                    "survey_number": "105/E",
                    "extent_acres": 0.85,
                    "metadata": {"applicant_name": "Audit Test Applicant"},
                }
            )

            e1 = audit_service.record_event(
                action="APPLICATION_CREATED",
                actor_id=None,
                actor_role="SYSTEM",
                application_id=app_no,
                payload={"status": "SUBMITTED"},
                db=db,
            )
            e2 = audit_service.record_event(
                action="DOCUMENT_UPLOADED",
                actor_id=None,
                actor_role="CITIZEN",
                application_id=app_no,
                payload={"version": 1},
                db=db,
            )

            assert e2["previous_hash"] == e1["current_hash"]

            # Verify chain
            verification = audit_service.verify_chain(app_no, db=db)
            assert verification["is_valid"] is True
            assert verification["entries_verified"] == 2
        finally:
            db.close()

    def test_application_persists_across_server_restart(self):
        """
        Simulates a complete server/process restart by closing the current session,
        disposing the engine connection pool, opening a brand new session, and
        asserting that previously stored data is fully intact in PostgreSQL.
        """
        app_no = f"REQ-PG-{uuid.uuid4().hex[:8].upper()}"

        # Session 1: Create application and document
        session_1 = SessionLocal()
        try:
            app = application_repo.create_application(
                db=session_1,
                app_data={
                    "application_no": app_no,
                    "applicant_id": TEST_USER_ID,
                    "parcel_id": f"PARCEL-{uuid.uuid4().hex[:6]}",
                    "state": "Karnataka",
                    "district": "Bengaluru Urban",
                    "taluk": "Anekal",
                    "village": "Sarjapura",
                    "survey_number": "106/F",
                    "extent_acres": 4.12,
                    "metadata": {"applicant_name": "Persistence Verification Applicant"},
                }
            )
            app_id = app.id
            document_repo.create_document(
                db=session_1,
                doc_data={
                    "application_id": app_id,
                    "document_version": 1,
                    "is_current_version": True,
                    "file_name": "persisted_deed.pdf",
                    "storage_path": f"/storage/{app_no}/persisted_deed.pdf",
                    "document_type": "sale_deed",
                }
            )
        finally:
            session_1.close()

        # Simulate restart: dispose connection pool
        engine.dispose()

        # Session 2: Fresh session after restart
        session_2 = SessionLocal()
        try:
            persisted_app = application_repo.get_application(session_2, app_no)
            assert persisted_app is not None, "Application must persist in PostgreSQL across server restarts"
            assert persisted_app.metadata_json.get("applicant_name") == "Persistence Verification Applicant"
            assert float(persisted_app.extent_acres) == 4.12

            persisted_docs = document_repo.get_documents(session_2, persisted_app.id)
            assert len(persisted_docs) == 1, "Documents must persist in PostgreSQL across server restarts"
            assert persisted_docs[0].file_name == "persisted_deed.pdf"
        finally:
            session_2.close()
