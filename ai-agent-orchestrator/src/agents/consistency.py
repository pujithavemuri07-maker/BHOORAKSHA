from typing import Dict, Any, List
from src.agents.base import BaseAgent

class DuplicateConsistencyAgent(BaseAgent):
    """
    Agent 8: Duplicate & Consistency Agent
    Detects concurrent or previous duplicate submissions for the same survey parcel,
    party name spelling inconsistencies across documents, and internal discrepancies.
    """
    def __init__(self):
        super().__init__(
            name="DuplicateConsistencyAgent",
            role="Detects duplicate parcel applications, party name variations, and cross-document inconsistencies"
        )

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        survey = str(context.get("survey_number", "142"))
        applicant_name = context.get("applicant_name", "Rajesh Sharma")
        claimed_owner = context.get("claimed_owner", "Rajesh Sharma")

        findings: List[Dict[str, Any]] = []

        # Party name consistency check
        name_matched = (applicant_name.lower() in claimed_owner.lower() or claimed_owner.lower() in applicant_name.lower())
        if not name_matched:
            findings.append({
                "finding_type": "PARTY_NAME_VARIATION",
                "severity": "LOW",
                "message": f"Minor variation detected between applicant '{applicant_name}' and deed owner '{claimed_owner}'."
            })

        # Check duplicate application simulation
        is_duplicate = context.get("is_duplicate_submission", False)
        if is_duplicate:
            findings.append({
                "finding_type": "DUPLICATE_APPLICATION_ALERT",
                "severity": "HIGH",
                "message": f"An existing application is already under active verification for Survey #{survey}."
            })

        has_inconsistency = len(findings) > 0
        consistency_score = 98.0 if not has_inconsistency else (60.0 if is_duplicate else 85.0)

        return {
            "agent_id": "AGENT_8_DUPLICATE_CONSISTENCY",
            "has_duplicate_alert": is_duplicate,
            "is_consistent": not has_inconsistency,
            "consistency_score": consistency_score,
            "findings": findings,
            "recommended_action": "OFFICER_REVIEW" if has_inconsistency else "PROCEED"
        }
