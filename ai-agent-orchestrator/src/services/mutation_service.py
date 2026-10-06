import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import os
import logging
from src.services.audit_service import audit_service

logger = logging.getLogger("bhooraksha.services.mutation")

class MutationPreparationAssistant:
    """
    Mutation Preparation & Dispatch Assistant.
    Workflow:
      verification -> authorized human approval -> mutation packet preparation ->
      human confirmation -> government adapter -> submission -> response.

    NEVER automatically modifies a government land record.
    In DEMO mode, returns: 'Mutation packet prepared. No official government record was modified.'
    """

    def __init__(self):
        self.demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"

    def prepare_mutation_packet(
        self,
        application_no: str,
        parcel_id: str,
        officer_id: str,
        officer_role: str,
        application_data: Dict[str, Any],
        officer_approval_notes: str,
        db: Optional[Any] = None
    ) -> Dict[str, Any]:
        """
        Prepares a standardized mutation dispatch packet following authorized human approval.
        Does NOT automatically submit or modify external government records.
        """
        # Enforce human authorization requirement
        clean_role = officer_role.strip().lower() if officer_role else ""
        if not officer_id or clean_role not in ["verifier", "revenue", "admin"]:
            raise ValueError(f"Unauthorized role '{officer_role}'. Mutation preparation requires authorized revenue officer approval.")

        packet_id = f"MUT-PKT-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        prepared_at = datetime.now(timezone.utc).isoformat()

        packet = {
            "packet_id": packet_id,
            "application_no": application_no,
            "parcel_id": parcel_id,
            "authorized_by": {
                "officer_id": officer_id,
                "role": officer_role,
                "approval_notes": officer_approval_notes,
                "authorized_at": prepared_at,
            },
            "applicant": application_data.get("applicant_name", "Rajesh Sharma"),
            "vendor": application_data.get("vendor_name", "Devendra Sharma"),
            "property_details": {
                "state": application_data.get("state", "Karnataka"),
                "district": application_data.get("district", "Bengaluru Urban"),
                "taluk": application_data.get("taluk", "Anekal"),
                "village": application_data.get("village", "Sarjapura"),
                "survey_number": application_data.get("survey_number", "142"),
                "extent_acres": application_data.get("extent_acres", 2.45),
            },
            "verification_summary": {
                "review_priority": application_data.get("review_priority_level", "LOW"),
                "status": "APPROVED_BY_OFFICER",
            },
            "dispatch_status": "PREPARED_PENDING_CONFIRMATION",
            "source_mode": "DEMO" if self.demo_mode else "SANDBOX",
            "official_disclaimer": "Mutation packet prepared. No official government record was modified." if self.demo_mode else "Mutation packet staged for secure dispatch to State Revenue Gateway upon final confirmation.",
        }

        # Record event in cryptographic audit ledger
        audit_service.record_event(
            application_id=application_no,
            actor_id=officer_id,
            actor_role=officer_role,
            action="MUTATION_PACKET_PREPARED",
            payload={
                "packet_id": packet_id,
                "application_no": application_no,
                "parcel_id": parcel_id,
                "status": packet["dispatch_status"]
            },
            db=db
        )

        return packet

mutation_service = MutationPreparationAssistant()
