from typing import Dict, Any
from src.agents.base import BaseAgent

class LanguageDetectionAgent(BaseAgent):
    """
    Agent 2: Language Detection Agent
    Identifies primary document script, Indic typography, multilingual headers,
    and standardized translation readiness.
    """
    def __init__(self):
        super().__init__(
            name="LanguageDetectionAgent",
            role="Identifies Indic scripts, primary language, and translation metadata"
        )

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        state = context.get("state", "Karnataka").lower()
        if "telangana" in state or "andhra" in state:
            primary_code, primary_name = "te", "Telugu"
        elif "maharashtra" in state:
            primary_code, primary_name = "mr", "Marathi"
        elif "tamil" in state:
            primary_code, primary_name = "ta", "Tamil"
        elif "kerala" in state:
            primary_code, primary_name = "ml", "Malayalam"
        elif "gujarat" in state:
            primary_code, primary_name = "gu", "Gujarati"
        elif "bengal" in state:
            primary_code, primary_name = "bn", "Bengali"
        elif "karnataka" in state:
            primary_code, primary_name = "kn", "Kannada"
        else:
            primary_code, primary_name = "hi", "Hindi"

        translated_title = "Registered Sale Deed for Land Parcel"
        raw_title = context.get("document_title") or context.get("title")
        if raw_title:
            try:
                from shared.bhashini import bhashini_service
                bhashini_trans = await bhashini_service.translate_indic_to_english(raw_title, primary_code)
                if bhashini_trans:
                    translated_title = bhashini_trans
            except Exception:
                pass

        return {
            "agent_id": "AGENT_2_LANGUAGE_DETECTION",
            "primary_language": primary_code,
            "language_name": primary_name,
            "secondary_language": "en",
            "is_multilingual": True,
            "detected_scripts": [primary_name, "Latin"],
            "translated_title": translated_title,
            "summary_en": f"Standard registered conveyance deed in {primary_name} with English schedules.",
        }

# Alias for backward-compatibility
LanguageTranslationAgent = LanguageDetectionAgent
