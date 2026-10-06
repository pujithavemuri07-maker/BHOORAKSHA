from typing import Dict, Any, List
from src.agents.base import BaseAgent
from src.providers.court_record import CourtRecordProvider

class LegalPartyEvidenceReviewAgent(BaseAgent):
    """
    Agent 7: Legal & Party Evidence Review Agent
    Identifies missing parties, missing consents, missing NOCs, POA references,
    court-order references, and possible encumbrance evidence.
    Does NOT produce 'is_title_marketable' or ownership validity claims.
    Outputs legal_review_required, evidence_findings, and supporting_references.
    """
    def __init__(self):
        super().__init__(
            name="LegalPartyEvidenceReviewAgent",
            role="Identifies missing parties, consent/NOC gaps, POA references, and court record references"
        )
        self.court_provider = CourtRecordProvider()

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        survey = str(context.get("survey_number", "142"))
        state = context.get("state", "Karnataka")
        district = context.get("district", "Bengaluru Urban")
        party_names = context.get("party_names", ["Rajesh Sharma", "Devendra Sharma"])

        # Query court record reference adapter
        court_res = await self.court_provider.search_references(
            state=state,
            district=district,
            survey_number=survey,
            party_names=party_names
        )

        evidence_findings: List[Dict[str, Any]] = []
        supporting_references: List[Dict[str, Any]] = []

        # Check court references
        if court_res.get("has_court_references"):
            for ref in court_res.get("court_references", []):
                evidence_findings.append({
                    "finding_type": "COURT_RECORD_REFERENCE",
                    "severity": "HIGH",
                    "case_number": ref.get("case_number"),
                    "court": ref.get("court_name"),
                    "message": ref.get("summary"),
                    "source": court_res.get("source"),
                    "disclaimer": ref.get("disclaimer")
                })
                supporting_references.append({
                    "type": "COURT_CASE",
                    "reference": ref.get("case_number"),
                    "details": ref
                })

        # Check for POA / Consent gaps if indicated in context
        if context.get("has_poa"):
            evidence_findings.append({
                "finding_type": "POWER_OF_ATTORNEY_REFERENCE",
                "severity": "MEDIUM",
                "message": "Conveyance executed via Power of Attorney. Verification of POA validity and principal survival required."
            })
            supporting_references.append({
                "type": "POA_DOCUMENT",
                "reference": context.get("poa_number", "POA-PENDING-VERIFICATION")
            })

        if context.get("missing_noc"):
            evidence_findings.append({
                "finding_type": "MISSING_NOC_EVIDENCE",
                "severity": "MEDIUM",
                "message": "Non-Agricultural conversion NOC or revenue clearance certificate reference not detected."
            })

        legal_review_required = len(evidence_findings) > 0

        return {
            "agent_id": "AGENT_7_LEGAL_PARTY_EVIDENCE_REVIEW",
            "legal_review_required": legal_review_required,
            "evidence_findings": evidence_findings,
            "supporting_references": supporting_references,
            "court_adapter_status": court_res.get("status"),
            # Note: No 'is_title_marketable' or 'ownership legally valid' produced.
            # Legal authority resides exclusively with authorized revenue/legal officers.
        }

# Alias for backward-compatibility
LegalAnalysisAgent = LegalPartyEvidenceReviewAgent
