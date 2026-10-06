from typing import Dict, Any, List
from src.agents.base import BaseAgent

class ReviewPriorityRoutingAgent(BaseAgent):
    """
    Agent 9: Review Priority & Routing Agent
    Calculates composite Review Priority Score (0 - 100) and priority level:
      - 0–29: LOW REVIEW PRIORITY
      - 30–69: MEDIUM REVIEW PRIORITY
      - 70–100: HIGH REVIEW PRIORITY
    Heuristic prototype scoring.
    AI NEVER automatically approves an application (auto_approvable removed).
    Routes to authorized human officer queue.
    """
    def __init__(self):
        super().__init__(
            name="ReviewPriorityRoutingAgent",
            role="Calculates review priority score (0-100), aggregates findings, and routes to authorized human officer"
        )

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        has_legal = context.get("has_legal_flags", False) or context.get("legal_review_required", False)
        has_gis = context.get("has_overlap", False) or context.get("spatial_review_required", False)
        quality_status = context.get("quality_status", "PASSED")
        quality_score = float(context.get("quality_score") or 95.0)
        has_duplicate = context.get("has_duplicate_alert", False)
        govt_status = context.get("govt_adapter_status") or context.get("govt_data", {}).get("response_status")

        # Heuristic scoring (0 = minimal review needed, 100 = urgent high review needed)
        score = 10
        contributing_findings: List[str] = []

        if has_legal:
            score += 45
            contributing_findings.append("Legal / Court reference or party consent inquiry required.")

        if has_gis:
            score += 30
            contributing_findings.append("Cadastral boundary overlap or geometry review required.")

        if quality_status == "WARNING" or quality_score < 75.0:
            score += 15
            contributing_findings.append("Document optical quality warnings detected.")
        elif quality_status == "FAILED":
            score += 35
            contributing_findings.append("Document optical quality failed threshold; resubmission may be required.")

        if has_duplicate:
            score += 25
            contributing_findings.append("Potential duplicate application detected for survey parcel.")

        if govt_status in ["UNAVAILABLE", "TIMEOUT"]:
            score += 15
            contributing_findings.append("Official government portal temporarily unavailable during automated check.")

        score = min(100, max(0, score))

        # Categorize into 3 priority bands
        if score <= 29:
            priority_level = "LOW"
            recommended_route = "STANDARD_OFFICER_REVIEW"
            sla_hours = 24
        elif score <= 69:
            priority_level = "MEDIUM"
            recommended_route = "SPECIALIST_GIS_LEGAL_REVIEW" if (has_gis or has_legal) else "SENIOR_VERIFIER_REVIEW"
            sla_hours = 48
        else:
            priority_level = "HIGH"
            recommended_route = "URGENT_OFFICER_HEARING"
            sla_hours = 72

        return {
            "agent_id": "AGENT_9_REVIEW_PRIORITY_ROUTING",
            "review_priority_score": score,
            "review_priority_level": priority_level,
            "contributing_findings": contributing_findings,
            "recommended_route": recommended_route,
            "sla_hours": sla_hours,
            # CRITICAL: AI NEVER automatically approves an application.
            # auto_approvable has been deliberately removed.
            # Backward-compatible fields for UI stores:
            "risk_score": score,
            "risk_level": priority_level.lower(),
            "recommended_stage": recommended_route,
        }

# Alias for backward-compatibility
RiskScoringAgent = ReviewPriorityRoutingAgent
