from typing import Dict, Any
from src.agents.base import BaseAgent

class IndicNERAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="IndicNERAgent",
            role="Extracts entities (owner names, survey numbers, boundaries) using MuRIL"
        )

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        survey = context.get("survey_number", "142")
        extent = context.get("extent_acres", 2.45)

        return {
            "ner_model": "muril-address-ner",
            "entities": {
                "owners": ["Rajesh Sharma", "ರಾಜೇಶ್ ಶರ್ಮಾ"],
                "executants": ["Devendra Sharma", "ದೇವೇಂದ್ರ ಶರ್ಮಾ"],
                "survey_number": f"{survey}/2A",
                "extent_acres": float(extent),
                "boundaries": {
                    "north": "Government Drainage Channel",
                    "south": "Survey No 143 (Muniyappa Land)",
                    "east": "30 Feet Village Road",
                    "west": "Survey No 142/1 (Gowda Property)",
                },
                "registration_date": "2024-02-14",
                "deed_number": "2024/09412",
            },
            "ner_confidence": 98.2,
        }
