import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from src.models.entities import HumanDecision

class DecisionRepository:
    """PostgreSQL repository for Human verification decisions."""

    @staticmethod
    def create_decision(db: Session, decision_data: Dict[str, Any]) -> HumanDecision:
        """Persists a human officer review decision."""
        officer_id = decision_data.get("officer_id")
        if isinstance(officer_id, str):
            try:
                officer_uuid = uuid.UUID(officer_id)
            except ValueError:
                officer_uuid = uuid.uuid4()
        else:
            officer_uuid = officer_id or uuid.uuid4()

        decision = HumanDecision(
            id=decision_data.get("id") or uuid.uuid4(),
            application_id=decision_data["application_id"],
            officer_id=officer_uuid,
            role=decision_data["role"],
            action=decision_data["action"],
            stage=decision_data["stage"],
            decision=decision_data["decision"],
            old_value=decision_data.get("old_value"),
            new_value=decision_data.get("new_value"),
            reason=decision_data["reason"],
            evidence_ids=decision_data.get("evidence_ids", []),
        )
        db.add(decision)
        db.commit()
        db.refresh(decision)
        return decision

    @staticmethod
    def get_decisions(db: Session, application_id: uuid.UUID) -> List[HumanDecision]:
        """Retrieves all human decisions recorded for an application."""
        return db.query(HumanDecision).filter(
            HumanDecision.application_id == application_id
        ).order_by(HumanDecision.created_at.asc()).all()

decision_repo = DecisionRepository()
