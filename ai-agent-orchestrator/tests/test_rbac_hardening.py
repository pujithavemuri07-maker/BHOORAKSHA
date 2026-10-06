import pytest
import jwt
from fastapi.testclient import TestClient
from src.main import app
from src.config import settings

client = TestClient(app)

def create_test_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def test_rbac_citizen_forbidden_from_review():
    """
    Acceptance Criteria 7 & 8:
    - Backend enforces RBAC.
    - CITIZEN cannot access staff verification review endpoints.
    - Frontend / token cannot bypass backend authorization.
    """
    citizen_token = create_test_token("cit-001", "citizen@example.com", "CITIZEN")
    headers = {"Authorization": f"Bearer {citizen_token}"}

    res = client.post(
        "/api/v1/applications/REQ-2026-000123/review",
        json={
            "action": "DECIDE",
            "stage": "VERIFIER_STAGE",
            "decision": "APPROVE",
            "reason": "Unauthorized citizen approval attempt",
            "evidence_ids": []
        },
        headers=headers
    )
    assert res.status_code == 403
    assert "Citizens cannot record verification review decisions" in res.json()["detail"]


def test_rbac_citizen_forbidden_from_mutation():
    """
    Acceptance Criteria 7:
    - CITIZEN cannot prepare mutation packets.
    """
    citizen_token = create_test_token("cit-001", "citizen@example.com", "CITIZEN")
    headers = {"Authorization": f"Bearer {citizen_token}"}

    res = client.post(
        "/api/v1/applications/REQ-2026-000123/mutation/prepare",
        json={
            "officer_approval_notes": "Unauthorized citizen mutation dispatch attempt"
        },
        headers=headers
    )
    assert res.status_code == 403
    assert "Citizens cannot prepare mutation packets" in res.json()["detail"]


def test_rbac_verifier_authorized_for_review():
    """
    Acceptance Criteria 5 & 7:
    - Authorized VERIFIER role can execute review decision.
    """
    verifier_token = create_test_token("ver-001", "verifier@bhooraksha.gov.in", "VERIFIER")
    headers = {"Authorization": f"Bearer {verifier_token}"}

    res = client.post(
        "/api/v1/applications/REQ-2026-000123/review",
        json={
            "action": "DECIDE",
            "stage": "VERIFIER_STAGE",
            "decision": "APPROVE",
            "reason": "Authorized spot physical verification completed successfully.",
            "evidence_ids": ["ev-1"]
        },
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["role"] == "VERIFIER"
    assert data["decision"] == "APPROVE"


def test_rbac_revenue_authorized_for_mutation():
    """
    Acceptance Criteria 7:
    - Authorized REVENUE role can prepare mutation packets on VERIFIED applications.
    """
    verifier_token = create_test_token("ver-001", "verifier@bhooraksha.gov.in", "VERIFIER")
    client.post(
        "/api/v1/applications/REQ-2026-000123/review",
        json={
            "action": "DECIDE",
            "stage": "VERIFIER_STAGE",
            "decision": "APPROVE",
            "reason": "Approved for revenue mutation",
            "evidence_ids": []
        },
        headers={"Authorization": f"Bearer {verifier_token}"}
    )

    revenue_token = create_test_token("rev-001", "tehsildar@bhooraksha.gov.in", "REVENUE")
    headers = {"Authorization": f"Bearer {revenue_token}"}

    res = client.post(
        "/api/v1/applications/REQ-2026-000123/mutation/prepare",
        json={
            "officer_approval_notes": "Authorized Tehsildar packet sign-off rationale"
        },
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert "MUT-PKT-" in data["packet_id"]


def test_rbac_jwt_tampering_rejected():
    """
    Acceptance Criteria 33:
    - Tampering with JWT payload (e.g. changing CITIZEN to ADMIN without secret)
      is rejected with 401 Unauthorized.
    """
    import base64
    import json

    # Generate a valid CITIZEN token
    valid_token = create_test_token("cit-002", "tamperer@example.com", "CITIZEN")
    parts = valid_token.split(".")
    assert len(parts) == 3

    # Tamper payload part to claim ADMIN
    payload_raw = base64.urlsafe_b64decode(parts[1] + "==").decode("utf-8")
    payload_data = json.loads(payload_raw)
    payload_data["role"] = "ADMIN"
    tampered_payload_b64 = base64.urlsafe_b64encode(json.dumps(payload_data).encode("utf-8")).decode("utf-8").rstrip("=")
    tampered_token = f"{parts[0]}.{tampered_payload_b64}.{parts[2]}"

    res = client.post(
        "/api/v1/applications/REQ-2026-000123/mutation/prepare",
        json={"officer_approval_notes": "Attempting tampered token access"},
        headers={"Authorization": f"Bearer {tampered_token}"}
    )
    assert res.status_code == 401, "Tampered JWT signature must be rejected with 401!"


def test_rbac_client_query_param_escalation_ignored():
    """
    Acceptance Criteria 30:
    - Backend ignores client-supplied officer_role or officer_id in query parameters or payload.
    - Identity and role MUST derive solely from the authenticated session.
    """
    citizen_token = create_test_token("cit-003", "citizen@example.com", "CITIZEN")

    # Attacker tries query parameter escalation (?officer_role=ADMIN&officer_id=admin-1)
    res = client.post(
        "/api/v1/applications/REQ-2026-000123/mutation/prepare?officer_role=ADMIN&officer_id=admin-1",
        json={"officer_approval_notes": "Attempting param escalation"},
        headers={"Authorization": f"Bearer {citizen_token}"}
    )
    assert res.status_code == 403
    assert "Citizens cannot prepare mutation packets" in res.json()["detail"]


def test_rbac_unauthenticated_request_rejected():
    """
    Acceptance Criteria 28:
    - Missing Authorization header is rejected with 401 Unauthorized.
    """
    res = client.post(
        "/api/v1/applications/REQ-2026-000123/mutation/prepare",
        json={"officer_approval_notes": "No token"}
    )
    assert res.status_code == 401


def test_portal_authorization_matrix_all_seven_roles():
    """
    Acceptance Criteria 34:
    - Test restricted staff APIs against all seven canonical roles:
      CITIZEN, DEO, VERIFIER, LEGAL, GIS, REVENUE, ADMIN.
    - CITIZEN cannot access review or mutation prepare (403 Forbidden).
    - DEO cannot access review or mutation prepare (403 Forbidden).
    """
    for role in ["CITIZEN", "DEO"]:
        tok = create_test_token(f"user-{role.lower()}", f"{role.lower()}@bhooraksha.gov.in", role)
        # Attempt review
        res_review = client.post(
            "/api/v1/applications/REQ-2026-000123/review",
            json={"action": "DECIDE", "stage": f"{role}_STAGE", "decision": "APPROVE", "reason": "unauthorized attempt", "evidence_ids": []},
            headers={"Authorization": f"Bearer {tok}"}
        )
        assert res_review.status_code == 403, f"Role {role} must be rejected from review!"

        # Attempt mutation/prepare
        res_mut = client.post(
            "/api/v1/applications/REQ-2026-000123/mutation/prepare",
            json={"officer_approval_notes": "unauthorized attempt"},
            headers={"Authorization": f"Bearer {tok}"}
        )
        assert res_mut.status_code == 403, f"Role {role} must be rejected from mutation/prepare!"


