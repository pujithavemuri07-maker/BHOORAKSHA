import hashlib
import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import logging
from sqlalchemy.orm import Session
from src.models.entities import AuditLedgerEntry, Application

logger = logging.getLogger("bhooraksha.services.audit")

GENESIS_HASH = "0" * 64

# Test double fallback when DB is not injected
_audit_ledger_store: List[Dict[str, Any]] = []

class CryptographicAuditLedger:
    """
    Tamper-Evident Cryptographic Audit Ledger.
    Every event is canonicalized to JSON, linked to the previous SHA-256 hash,
    and hashed to form an immutable hash chain:
      current_hash = SHA256(previous_hash + canonical_payload_json)
    Persists to PostgreSQL audit_ledger table.
    """

    @staticmethod
    def _canonical_json(data: Dict[str, Any]) -> str:
        """Serializes dictionary to deterministic, sorted canonical JSON string."""
        return json.dumps(data, sort_keys=True, separators=(',', ':'), default=str)

    @classmethod
    def record_event(
        cls,
        application_id: Optional[str],
        actor_id: Optional[str],
        actor_role: str,
        action: str,
        payload: Dict[str, Any],
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        """Records an auditable event onto the tamper-evident cryptographic hash chain."""
        timestamp = datetime.now(timezone.utc).isoformat()
        event_id = str(uuid.uuid4())

        # Resolve previous hash from database or in-memory fallback
        previous_hash = GENESIS_HASH
        app_db_id = None

        if db is not None and application_id:
            app_record = db.query(Application).filter(Application.application_no == application_id).first()
            if app_record:
                app_db_id = app_record.id
                last_entry = db.query(AuditLedgerEntry).filter(
                    AuditLedgerEntry.application_id == app_db_id
                ).order_by(AuditLedgerEntry.created_at.desc()).first()
                if last_entry:
                    previous_hash = last_entry.current_hash
        elif application_id:
            app_events = [e for e in _audit_ledger_store if e.get("application_id") == application_id]
            if app_events:
                previous_hash = app_events[-1]["current_hash"]

        canonical_payload = {
            "event_id": event_id,
            "application_id": str(application_id) if application_id else None,
            "actor_id": str(actor_id) if actor_id else "SYSTEM",
            "actor_role": actor_role,
            "action": action,
            "payload": payload,
            "timestamp": timestamp,
        }

        canonical_str = cls._canonical_json(canonical_payload)
        to_hash = f"{previous_hash}{canonical_str}".encode("utf-8")
        current_hash = hashlib.sha256(to_hash).hexdigest()

        entry_dict = {
            "id": event_id,
            "application_id": application_id,
            "actor_id": actor_id,
            "actor_role": actor_role,
            "action": action,
            "canonical_payload": canonical_payload,
            "previous_hash": previous_hash,
            "current_hash": current_hash,
            "timestamp": timestamp,
        }

        # Persist to PostgreSQL if database session is provided
        if db is not None:
            actor_uuid = None
            if actor_id:
                if isinstance(actor_id, uuid.UUID):
                    actor_uuid = actor_id
                else:
                    try:
                        actor_uuid = uuid.UUID(str(actor_id))
                    except (ValueError, AttributeError):
                        actor_uuid = None

            db_entry = AuditLedgerEntry(
                id=uuid.UUID(str(event_id)) if isinstance(event_id, str) else event_id,
                application_id=app_db_id,
                actor_id=actor_uuid,
                actor_role=actor_role,
                action=action,
                canonical_payload=canonical_payload,
                previous_hash=previous_hash,
                current_hash=current_hash,
                created_at=datetime.fromisoformat(timestamp),
            )
            db.add(db_entry)
            db.commit()

        _audit_ledger_store.append(entry_dict)
        logger.info(f"Audit event recorded: [{action}] by [{actor_role}] (Hash: {current_hash[:12]}...)")
        return entry_dict

    @classmethod
    def get_trail(
        cls,
        application_id: Optional[str] = None,
        db: Optional[Session] = None
    ) -> List[Dict[str, Any]]:
        """Retrieves audit entries for an application or entire ledger."""
        if db is not None and application_id:
            app_record = db.query(Application).filter(Application.application_no == application_id).first()
            if app_record:
                db_entries = db.query(AuditLedgerEntry).filter(
                    AuditLedgerEntry.application_id == app_record.id
                ).order_by(AuditLedgerEntry.created_at.asc()).all()

                return [
                    {
                        "id": str(e.id),
                        "application_id": application_id,
                        "actor_id": str(e.actor_id) if e.actor_id else None,
                        "actor_role": e.actor_role,
                        "action": e.action,
                        "canonical_payload": e.canonical_payload,
                        "previous_hash": e.previous_hash,
                        "current_hash": e.current_hash,
                        "timestamp": e.created_at.isoformat() if e.created_at else "",
                    }
                    for e in db_entries
                ]

        if application_id:
            return [e for e in _audit_ledger_store if e.get("application_id") == application_id]
        return list(_audit_ledger_store)

    @classmethod
    def verify_chain(
        cls,
        application_id: Optional[str] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        """
        Verifies the cryptographic integrity of the hash chain from database records or memory.
        Returns is_valid, entries_verified, and tamper_details if any tampering is detected.
        """
        chain = cls.get_trail(application_id, db=db)
        if not chain:
            return {"is_valid": True, "entries_verified": 0, "message": "Chain is empty."}

        expected_previous = GENESIS_HASH
        for idx, entry in enumerate(chain):
            if entry["previous_hash"] != expected_previous:
                return {
                    "is_valid": False,
                    "tampered_at_index": idx,
                    "event_id": entry["id"],
                    "error": f"Previous hash mismatch at index {idx}."
                }

            canonical_str = cls._canonical_json(entry["canonical_payload"])
            computed_hash = hashlib.sha256(f"{entry['previous_hash']}{canonical_str}".encode("utf-8")).hexdigest()

            if computed_hash != entry["current_hash"]:
                return {
                    "is_valid": False,
                    "tampered_at_index": idx,
                    "event_id": entry["id"],
                    "error": f"Hash integrity failure at index {idx}. Data has been modified."
                }

            expected_previous = entry["current_hash"]

        return {
            "is_valid": True,
            "entries_verified": len(chain),
            "latest_hash": chain[-1]["current_hash"],
            "message": "Cryptographic hash chain verified. Zero tampering detected."
        }

audit_service = CryptographicAuditLedger()
