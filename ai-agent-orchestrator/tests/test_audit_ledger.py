import pytest
from src.services.audit_service import CryptographicAuditLedger, GENESIS_HASH

def test_audit_ledger_cryptographic_hash_chain():
    """
    Acceptance Criteria 10 & 11:
    - Verifies tamper-evident audit ledger using SHA-256 hash chaining.
    - Previous hash is linked to current hash.
    - No 'Section 40' terminology.
    """
    ledger = CryptographicAuditLedger()
    app_id = "REQ-TEST-AUDIT-001"

    # 1. Record first event
    e1 = ledger.record_event(
        application_id=app_id,
        actor_id="officer-1",
        actor_role="verifier",
        action="DOCUMENT_VERIFIED",
        payload={"quality": "PASSED"}
    )
    assert e1["previous_hash"] == GENESIS_HASH
    assert len(e1["current_hash"]) == 64

    # 2. Record second event
    e2 = ledger.record_event(
        application_id=app_id,
        actor_id="officer-2",
        actor_role="revenue",
        action="MUTATION_SANCTIONED",
        payload={"status": "SANCTIONED"}
    )
    assert e2["previous_hash"] == e1["current_hash"]
    assert len(e2["current_hash"]) == 64

    # 3. Verify chain integrity
    verification = ledger.verify_chain(app_id)
    assert verification["is_valid"] is True
    assert verification["entries_verified"] >= 2


def test_audit_ledger_detects_tampering():
    """Verifies that altering any event data in the ledger breaks the hash chain."""
    ledger = CryptographicAuditLedger()
    app_id = "REQ-TEST-TAMPER-002"

    e1 = ledger.record_event(
        application_id=app_id,
        actor_id="officer-1",
        actor_role="verifier",
        action="ORIGINAL_ACTION",
        payload={"amount": 100}
    )
    e2 = ledger.record_event(
        application_id=app_id,
        actor_id="officer-2",
        actor_role="revenue",
        action="FOLLOWUP_ACTION",
        payload={"status": "CONFIRMED"}
    )

    # Tamper with e1 payload directly
    e1["canonical_payload"]["payload"]["amount"] = 999999

    # Verification should now fail and pinpoint tampering
    verification = ledger.verify_chain(app_id)
    assert verification["is_valid"] is False
    assert "tampered_at_index" in verification
