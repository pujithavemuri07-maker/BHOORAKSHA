import pytest
import re
import warnings

# Suppress Starlette 1.3.1 deprecation warning when using httpx with testclient
try:
    from starlette.exceptions import StarletteDeprecationWarning
    warnings.filterwarnings("ignore", category=StarletteDeprecationWarning)
except ImportError:
    pass

from fastapi.testclient import TestClient
from src.main import app
from src.services.audit_service import audit_service

client = TestClient(app)

import jwt
from src.config import settings

def auth_headers(role: str = "VERIFIER", user_id: str = "a0000000-0000-0000-0000-000000000003") -> dict:
    payload = {"sub": user_id, "email": f"{role.lower()}@bhooraksha.gov.in", "role": role.upper()}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return {"Authorization": f"Bearer {token}"}

def test_application_creation_server_id_generation():
    """
    Acceptance Criteria 1 & 2:
    - Application IDs are server-generated in format REQ-YYYY-NNNNNN.
    - Citizen ID, Application ID, Parcel ID, and Document ID are separate.
    - Official ULPIN is null when unavailable (never fabricated).
    """
    payload = {
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Anekal",
        "village": "Sarjapura",
        "survey_number": "142",
        "subdivision_number": "2A",
        "extent_acres": 2.45,
        "document_type": "sale_deed",
        "applicant_name": "Rajesh Sharma"
    }
    response = client.post("/api/v1/applications", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True

    app_data = data["data"]
    app_no = app_data["application_no"]

    # Verify format: REQ-YYYY-NNNNNN
    match = re.match(r"^REQ-\d{4}-\d{6}$", app_no)
    assert match is not None, f"Application ID '{app_no}' does not match REQ-YYYY-NNNNNN format."

    # Verify separation of IDs
    assert app_data["application_id"] != app_no
    assert app_data["parcel_id"].startswith("PARCEL-")
    assert app_data["parcel_id"] != app_no
    assert app_data["parcel_id"] != app_data["applicant_id"]

    # Verify ULPIN is null (Criterion 3: ULPIN is never fabricated)
    assert app_data["official_ulpin"] is None
    assert app_data["ulpin_status"] == "UNASSIGNED"


def test_document_versioning_and_resubmission():
    """
    Acceptance Criteria:
    - Resubmission keeps the SAME application_no.
    - Creates a new document version (increments version number).
    - Preserves previous version.
    - Stores resubmission reason.
    - Preserves audit trail.
    """
    # 1. Create Application
    create_res = client.post("/api/v1/applications", json={
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Anekal",
        "village": "Sarjapura",
        "survey_number": "142",
        "extent_acres": 2.45
    })
    app_no = create_res.json()["data"]["application_no"]

    # 2. Upload Document Version 1
    file_v1 = ("test_deed_v1.pdf", b"%PDF-1.4 test document version 1 content", "application/pdf")
    upload_res = client.post(
        f"/api/v1/applications/{app_no}/documents",
        files={"file": file_v1},
        data={"document_type": "sale_deed"}
    )
    assert upload_res.status_code == 200
    doc_v1 = upload_res.json()["data"]
    assert doc_v1["document_version"] == 1
    assert doc_v1["is_current_version"] is True

    # 3. Resubmit Document Version 2
    file_v2 = ("test_deed_v2_clarified.pdf", b"%PDF-1.4 corrected document version 2 content", "application/pdf")
    resubmit_res = client.post(
        f"/api/v1/applications/{app_no}/resubmit",
        files={"file": file_v2},
        data={"resubmission_reason": "Corrected boundary schedule details as requested by verifier."}
    )
    assert resubmit_res.status_code == 200
    doc_v2 = resubmit_res.json()["data"]

    # Verify same application_no is maintained
    assert doc_v2["application_no"] == app_no
    assert doc_v2["document_version"] == 2
    assert doc_v2["is_current_version"] is True
    assert doc_v2["resubmission_reason"] == "Corrected boundary schedule details as requested by verifier."

    # 4. Fetch full application details
    detail_res = client.get(f"/api/v1/applications/{app_no}")
    assert detail_res.status_code == 200
    app_detail = detail_res.json()["data"]
    assert app_detail["total_document_versions"] == 2
    assert app_detail["documents"][0]["document_version"] == 1
    assert app_detail["documents"][0]["is_current_version"] is False
    assert app_detail["documents"][1]["document_version"] == 2
    assert app_detail["documents"][1]["is_current_version"] is True


def test_status_endpoint_never_hardcoded_approved():
    """
    Acceptance Criteria 6 & 21:
    - Status endpoints do not return hard-coded APPROVED responses.
    - AI never auto-approves.
    """
    create_res = client.post("/api/v1/applications", json={
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Anekal",
        "village": "Sarjapura",
        "survey_number": "142",
        "extent_acres": 2.45
    })
    app_no = create_res.json()["data"]["application_no"]

    # Check status before processing
    status_res1 = client.get(f"/api/v1/applications/{app_no}/status")
    assert status_res1.json()["data"]["status"] == "SUBMITTED"

    # Process through pipeline
    process_res = client.post(f"/api/v1/applications/{app_no}/process")
    assert process_res.status_code == 200
    proc_data = process_res.json()["data"]
    assert proc_data["status"] == "UNDER_HUMAN_REVIEW"

    # Check status after processing: MUST NOT be "APPROVED"
    status_res2 = client.get(f"/api/v1/applications/{app_no}/status")
    assert status_res2.json()["data"]["status"] != "APPROVED"
    assert status_res2.json()["data"]["status"] == "UNDER_HUMAN_REVIEW"


def test_human_officer_review_decision():
    """
    Acceptance Criteria 9 & 14:
    - AI flags and routes; authorized human officer decides.
    - Every decision records user, role, action, timestamp, old_value, new_value, reason, evidence.
    """
    app_no = "REQ-2026-000123"

    decision_payload = {
        "action": "DECIDE",
        "stage": "VERIFIER_STAGE",
        "decision": "APPROVE",
        "reason": "Physical spot inspection verified; boundaries consistent with village revenue map.",
        "evidence_ids": ["ev-doc-142", "ev-gis-overlap-zero"]
    }
    response = client.post(
        f"/api/v1/applications/{app_no}/review",
        json=decision_payload,
        headers=auth_headers("VERIFIER", "a0000000-0000-0000-0000-000000000003")
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["action"] == "DECIDE"
    assert data["decision"] == "APPROVE"
    assert data["officer_id"] == "a0000000-0000-0000-0000-000000000003"
    assert data["role"].upper() == "VERIFIER"
    assert data["new_value"]["status"] == "VERIFIED"

    # Verify status changed on application
    app_res = client.get(f"/api/v1/applications/{app_no}")
    assert app_res.json()["data"]["status"] == "VERIFIED"


def test_mutation_preparation_assistant():
    """
    Acceptance Criteria 9 & 16:
    - Mutation requires authorized human action.
    - Application must be VERIFIED first.
    - In DEMO mode, disclaimer explicitly states no official record was modified.
    """
    app_no = "REQ-2026-000123"
    # Ensure app is VERIFIED first for mutation
    client.post(
        f"/api/v1/applications/{app_no}/review",
        json={
            "action": "DECIDE",
            "stage": "VERIFIER_STAGE",
            "decision": "APPROVE",
            "reason": "Verified for mutation testing",
            "evidence_ids": ["ev-1"]
        },
        headers=auth_headers("VERIFIER", "a0000000-0000-0000-0000-000000000003")
    )

    # Unauthorized citizen role should fail with 403 Forbidden
    unauth_res = client.post(
        f"/api/v1/applications/{app_no}/mutation/prepare",
        json={"officer_approval_notes": "Citizen requested mutation."},
        headers=auth_headers("CITIZEN", "citizen-01")
    )
    assert unauth_res.status_code == 403
    assert "Forbidden" in unauth_res.json()["detail"]

    # Authorized revenue officer succeeds
    auth_res = client.post(
        f"/api/v1/applications/{app_no}/mutation/prepare",
        json={"officer_approval_notes": "Tehsildar final verification complete; mutation packet sanctioned."},
        headers=auth_headers("REVENUE", "a0000000-0000-0000-0000-000000000006")
    )
    assert auth_res.status_code == 200
    data = auth_res.json()["data"]
    assert "MUT-PKT-" in data["packet_id"]
    assert "No official government record was modified" in data["official_disclaimer"]


def test_unauthorized_citizen_decision_attempt():
    """Verify that citizens are strictly forbidden from approving or rejecting applications."""
    app_no = "REQ-2026-000124"
    response = client.post(
        f"/api/v1/applications/{app_no}/review",
        json={
            "action": "DECIDE",
            "stage": "CITIZEN_ATTEMPT",
            "decision": "APPROVE",
            "reason": "Attempting unauthorized approval",
            "evidence_ids": []
        },
        headers=auth_headers("CITIZEN", "citizen-123")
    )
    assert response.status_code == 403
    assert "Citizens cannot record verification review decisions" in response.json()["detail"]


def test_mutation_rejected_on_unverified_application():
    """Verify that mutation packet preparation is rejected if application is not VERIFIED."""
    # Create fresh application in SUBMITTED state
    create_res = client.post("/api/v1/applications", json={
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Anekal",
        "village": "Sarjapura",
        "survey_number": "99",
        "extent_acres": 1.5
    })
    app_no = create_res.json()["data"]["application_no"]

    # Attempt mutation on unverified application
    res = client.post(
        f"/api/v1/applications/{app_no}/mutation/prepare",
        json={"officer_approval_notes": "Attempting premature mutation."},
        headers=auth_headers("REVENUE", "officer-01")
    )
    assert res.status_code == 400
    assert "must be VERIFIED" in res.json()["detail"]


def test_complete_end_to_end_lifecycle():
    """
    Acceptance Criteria: Complete E2E verification across all 13 phases.
    Uses the SAME:
      - application_no
      - application
      - document versions
      - evidence records
      - findings
      - review decisions
      - audit history
    """
    # 1. Application creation
    create_res = client.post("/api/v1/applications", json={
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Anekal",
        "village": "Sarjapura",
        "survey_number": "142",
        "extent_acres": 2.45,
        "applicant_name": "Suresh Patel"
    })
    assert create_res.status_code == 201
    app_data = create_res.json()["data"]
    app_no = app_data["application_no"]
    assert app_data["status"] == "SUBMITTED"
    assert app_data["official_ulpin"] is None
    assert app_data["ulpin_status"] == "UNASSIGNED"

    # 2. Document upload (Version 1)
    file_v1 = ("sale_deed_v1.pdf", b"%PDF-1.4 mock sale deed content v1", "application/pdf")
    upload_res = client.post(
        f"/api/v1/applications/{app_no}/documents",
        files={"file": file_v1},
        data={"document_type": "sale_deed"}
    )
    assert upload_res.status_code == 200
    doc_v1 = upload_res.json()["data"]
    assert doc_v1["document_version"] == 1
    assert doc_v1["is_current_version"] is True
    doc_id_v1 = doc_v1["document_id"]

    # 3. 9-agent verification pipeline
    proc_res = client.post(f"/api/v1/applications/{app_no}/process")
    assert proc_res.status_code == 200
    proc_data = proc_res.json()["data"]
    assert proc_data["status"] == "UNDER_HUMAN_REVIEW"
    assert proc_data["agents_executed"] == 9
    assert proc_data["evidence_count"] > 0

    # 4. Inspect evidence integrity
    findings_res = client.get(f"/api/v1/applications/{app_no}/findings")
    assert findings_res.status_code == 200
    evidence_list = findings_res.json()["data"]["evidence"]
    assert len(evidence_list) > 0
    first_ev = evidence_list[0]
    assert "evidence_id" in first_ev
    assert first_ev["application_id"] == app_no
    assert first_ev["source_mode"] == "DEMO"
    assert first_ev["is_simulated"] is True

    # 5. Human review: Request Changes (requires resubmission)
    req_changes_res = client.post(
        f"/api/v1/applications/{app_no}/review",
        json={
            "action": "REQUEST_CHANGES",
            "stage": "VERIFIER_STAGE",
            "decision": "REQUEST_CHANGES",
            "reason": "Boundary schedule in deed is blurred; please provide clarified scan.",
            "evidence_ids": [first_ev["evidence_id"]]
        },
        headers=auth_headers("VERIFIER", "officer-verifier-01")
    )
    assert req_changes_res.status_code == 200
    assert req_changes_res.json()["data"]["decision"] == "REQUEST_CHANGES"

    # Verify status is RESUBMISSION_REQUIRED
    app_res = client.get(f"/api/v1/applications/{app_no}")
    assert app_res.json()["data"]["status"] == "RESUBMISSION_REQUIRED"

    # 6. Citizen Resubmission (Version 2)
    file_v2 = ("sale_deed_v2_clean.pdf", b"%PDF-1.4 mock clarified scan v2", "application/pdf")
    resubmit_res = client.post(
        f"/api/v1/applications/{app_no}/resubmit",
        files={"file": file_v2},
        data={"resubmission_reason": "High-resolution color scan provided."}
    )
    assert resubmit_res.status_code == 200
    doc_v2 = resubmit_res.json()["data"]
    assert doc_v2["application_no"] == app_no
    assert doc_v2["document_version"] == 2
    assert doc_v2["is_current_version"] is True

    # 7. Processing document version 2
    proc2_res = client.post(f"/api/v1/applications/{app_no}/process")
    assert proc2_res.status_code == 200
    assert proc2_res.json()["data"]["status"] == "UNDER_HUMAN_REVIEW"

    # 8. Human review: Officer APPROVE decision
    approve_res = client.post(
        f"/api/v1/applications/{app_no}/review",
        json={
            "action": "DECIDE",
            "stage": "VERIFIER_STAGE",
            "decision": "APPROVE",
            "reason": "Clarified scan verified successfully against village map.",
            "evidence_ids": [first_ev["evidence_id"]]
        },
        headers=auth_headers("VERIFIER", "officer-verifier-01")
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["data"]["decision"] == "APPROVE"

    # Verify status transitioned to VERIFIED
    app_verified = client.get(f"/api/v1/applications/{app_no}").json()["data"]
    assert app_verified["status"] == "VERIFIED"

    # 9. Mutation packet preparation by authorized revenue officer
    mutation_res = client.post(
        f"/api/v1/applications/{app_no}/mutation/prepare",
        json={"officer_approval_notes": "All title and spatial checks passed; mutation packet sanctioned."},
        headers=auth_headers("REVENUE", "officer-revenue-01")
    )
    assert mutation_res.status_code == 200
    mutation_data = mutation_res.json()["data"]
    assert mutation_data["application_no"] == app_no
    assert "MUT-PKT-" in mutation_data["packet_id"]

    # Official application status remains VERIFIED (does NOT claim govt mutation happened)
    app_final = client.get(f"/api/v1/applications/{app_no}").json()["data"]
    assert app_final["status"] == "VERIFIED"

    # 10. Audit Ledger Verification
    audit_res = client.get(f"/api/v1/applications/{app_no}/audit")
    assert audit_res.status_code == 200
    audit_data = audit_res.json()["data"]
    assert audit_data["chain_valid"] is True
    trail = audit_data["trail"]

    # Verify all 8 required audit event types are recorded
    actions = [e["action"] for e in trail]
    assert "APPLICATION_CREATED" in actions
    assert "DOCUMENT_UPLOADED" in actions
    assert "VERIFICATION_STARTED" in actions
    assert "VERIFICATION_COMPLETED" in actions
    assert "HUMAN_REVIEW" in actions
    assert "OFFICER_DECISION" in actions
    assert "DOCUMENT_RESUBMITTED" in actions
    assert "MUTATION_PACKET_PREPARED" in actions


def test_verification_report_disclaimer():
    """
    Acceptance Criteria 17:
    - Verification report is clearly NOT an 'Official Title Certificate'.
    """
    response = client.get("/api/v1/applications/REQ-2026-000123/report")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["report_title"] == "Bhooraksha Verification Report"
    assert "NOT an Official Title Certificate" in data["official_disclaimer"]


def test_legacy_frontend_api_compatibility():
    """
    Acceptance Criteria 12:
    - Verifies backward compatibility of legacy frontend-facing endpoints:
      - POST /api/v1/documents/upload
      - GET  /api/v1/documents/status/{task_id}
      - POST /api/v1/documents/process/{application_id}
      - GET  /api/v1/verification/status/{application_no}
    """
    # 1. POST /api/v1/documents/upload
    file_payload = ("test_deed.pdf", b"%PDF-1.4 test document content", "application/pdf")
    upload_res = client.post("/api/v1/documents/upload", files={"file": file_payload})
    assert upload_res.status_code == 200
    up_data = upload_res.json()
    assert "application_id" in up_data
    app_no = up_data["application_id"]

    # 2. GET /api/v1/documents/status/{task_id}
    status_res = client.get(f"/api/v1/documents/status/{app_no}")
    assert status_res.status_code == 200
    st_data = status_res.json()
    assert st_data["task_id"] == app_no
    assert "verification_status" in st_data["result"]

    # 3. POST /api/v1/documents/process/{application_id}
    proc_res = client.post(f"/api/v1/documents/process/{app_no}")
    assert proc_res.status_code == 200
    p_data = proc_res.json()
    assert p_data["status"] == "success"
    assert p_data["application_id"] == app_no

    # 4. GET /api/v1/verification/status/{application_no}
    verif_res = client.get(f"/api/v1/verification/status/{app_no}")
    assert verif_res.status_code == 200
    v_data = verif_res.json()
    assert v_data["application_no"] == app_no
    assert "ocr_confidence" in v_data
    assert "composite_risk_score" in v_data


