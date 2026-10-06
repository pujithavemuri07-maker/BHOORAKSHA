from typing import Dict, Any
from src.agents.base import BaseAgent
from src.providers.quality_assessment import get_quality_provider

class QualityAssessmentAgent(BaseAgent):
    """
    Agent 1: Quality Assessment Agent
    Evaluates optical resolution, blur (Laplacian variance), brightness, contrast,
    orientation, and physical page readability via QualityAssessmentProvider.
    Does NOT infer DPI or image quality from file size.
    """
    def __init__(self):
        super().__init__(
            name="QualityAssessmentAgent",
            role="Evaluates document optical quality, blur, contrast, resolution, and orientation"
        )

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        file_path = context.get("file_path")
        mode = "REAL" if file_path else "DEMO"
        provider = get_quality_provider(mode=mode)

        assessment = await provider.assess(file_path, context)
        quality_score = assessment.get("quality_score") or 0.0

        return {
            "agent_id": "AGENT_1_QUALITY_ASSESSMENT",
            "quality_status": assessment.get("status", "PASSED"),
            "quality_score": quality_score,
            "blur_metric": assessment.get("blur_metric"),
            "brightness_metric": assessment.get("brightness_metric"),
            "contrast_metric": assessment.get("contrast_metric"),
            "resolution": assessment.get("resolution"),
            "orientation": assessment.get("orientation"),
            "findings": assessment.get("findings", []),
            "is_acceptable": quality_score >= 70.0 if assessment.get("measured") else True,
            "provider": assessment.get("provider"),
            "is_simulated": assessment.get("is_simulated", False),
        }

# Alias for backward-compatibility
DocumentQualityAgent = QualityAssessmentAgent
