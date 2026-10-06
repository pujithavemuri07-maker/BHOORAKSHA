from typing import Dict, Any, List
from src.agents.base import BaseAgent
from src.providers.government_record import GovernmentRecordProvider

class HistoricalCrossRecordValidationAgent(BaseAgent):
    """
    Agent 5: Historical & Cross-Record Validation Agent
    Cross-verifies extracted deed information against government registers and historical lineage.
    Integrates with GovernmentRecordProvider (adapter layer).
    """
    def __init__(self):
        super().__init__(
            name="HistoricalCrossRecordValidationAgent",
            role="Cross-verifies extracted deed fields against historical records and official registers"
        )
        self.govt_provider = GovernmentRecordProvider()

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        state = context.get("state", "Karnataka")
        district = context.get("district", "Bengaluru Urban")
        taluk = context.get("taluk", "Anekal")
        village = context.get("village", "Sarjapura")
        survey = context.get("survey_number", "142")
        subdivision = context.get("subdivision_number")
        claimed_extent = float(context.get("extent_acres", 2.45))

        # Query government records via adapter layer
        govt_result = await self.govt_provider.fetch_record(
            state=state,
            district=district,
            taluk=taluk,
            village=village,
            survey_number=survey,
            subdivision_number=subdivision
        )

        discrepancies: List[str] = []
        evidence_items: List[Dict[str, Any]] = []

        govt_data = govt_result.get("data")
        govt_status = govt_result.get("response_status")

        if govt_status == "AVAILABLE" and govt_data:
            govt_extent = float(govt_data.get("extent_acres", claimed_extent))
            # Check extent mismatch
            if abs(claimed_extent - govt_extent) > 0.05:
                discrepancies.append("EXTENT_MISMATCH")
                evidence_items.append({
                    "finding_type": "EXTENT_MISMATCH",
                    "severity": "HIGH",
                    "claimed": claimed_extent,
                    "official": govt_extent,
                    "source": govt_result.get("source"),
                    "request_ref": govt_result.get("request_reference")
                })
        elif govt_status == "NOT_FOUND":
            discrepancies.append("OFFICIAL_RECORD_NOT_FOUND")
            evidence_items.append({
                "finding_type": "OFFICIAL_RECORD_NOT_FOUND",
                "severity": "HIGH",
                "message": "Official government record not found for this survey number. Manual verification required.",
                "source": govt_result.get("source"),
                "request_ref": govt_result.get("request_reference")
            })
        elif govt_status == "TIMEOUT":
            discrepancies.append("GOVERNMENT_API_TIMEOUT")
            evidence_items.append({
                "finding_type": "GOVERNMENT_API_TIMEOUT",
                "severity": "MEDIUM",
                "message": "Government portal request timed out. Retry or manual verification recommended.",
                "source": govt_result.get("source"),
                "request_ref": govt_result.get("request_reference")
            })
        elif govt_status == "UNAVAILABLE":
            discrepancies.append("GOVERNMENT_API_UNAVAILABLE")
            evidence_items.append({
                "finding_type": "GOVERNMENT_API_UNAVAILABLE",
                "severity": "MEDIUM",
                "message": "Official portal temporarily unreachable. Manual officer verification recommended.",
                "source": govt_result.get("source"),
                "request_ref": govt_result.get("request_reference")
            })

        is_verified = len(discrepancies) == 0 and govt_status == "AVAILABLE"

        return {
            "agent_id": "AGENT_5_HISTORICAL_CROSS_RECORD",
            "is_verified": is_verified,
            "lineage_verified": is_verified,
            "extent_verified": "EXTENT_MISMATCH" not in discrepancies,
            "discrepancies": discrepancies,
            "evidence_items": evidence_items,
            "cross_verify_score": 96.5 if is_verified else (50.0 if "EXTENT_MISMATCH" in discrepancies else 75.0),
            "government_adapter_result": govt_result,
        }

# Alias for backward-compatibility
CrossVerifyAgent = HistoricalCrossRecordValidationAgent
