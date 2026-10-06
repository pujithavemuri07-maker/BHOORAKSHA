import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from src.models.entities import EvidenceRecord

class EvidenceRepository:
    """PostgreSQL repository for Evidence records."""

    @staticmethod
    def save_evidence_records(
        db: Session,
        application_id: uuid.UUID,
        document_id: Optional[uuid.UUID],
        evidence_items: List[Dict[str, Any]]
    ) -> List[EvidenceRecord]:
        """Persists a list of verification evidence records."""
        records = []
        for item in evidence_items:
            ev_id = item.get("evidence_id")
            if isinstance(ev_id, str):
                try:
                    ev_uuid = uuid.UUID(ev_id)
                except ValueError:
                    ev_uuid = uuid.uuid4()
            else:
                ev_uuid = ev_id or uuid.uuid4()

            doc_uuid = document_id
            if item.get("document_id"):
                try:
                    doc_uuid = uuid.UUID(str(item["document_id"]))
                except ValueError:
                    pass

            rec = EvidenceRecord(
                evidence_id=ev_uuid,
                application_id=application_id,
                document_id=doc_uuid,
                source_type=item.get("source_type", "OCR"),
                source_reference=str(item.get("source_reference", "reference")),
                source_mode=item.get("source_mode", "DEMO"),
                is_simulated=item.get("is_simulated", True),
                page=item.get("page"),
                region_bbox=item.get("region_bbox"),
                extracted_value=item.get("extracted_value"),
                expected_value=item.get("expected_value"),
                confidence=item.get("confidence", 0.0),
                finding_type=item.get("finding_type", "INFO"),
                severity=item.get("severity", "INFO"),
            )
            db.add(rec)
            records.append(rec)

        db.commit()
        return records

    @staticmethod
    def get_evidence_for_application(db: Session, application_id: uuid.UUID) -> List[EvidenceRecord]:
        """Retrieves all evidence records linked to the application."""
        return db.query(EvidenceRecord).filter(
            EvidenceRecord.application_id == application_id
        ).order_by(EvidenceRecord.created_at.asc()).all()

evidence_repo = EvidenceRepository()
