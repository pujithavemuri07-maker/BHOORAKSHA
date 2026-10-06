from typing import Dict, Any, Optional
from src.agents.base import BaseAgent
from src.providers.document_extraction import get_extraction_provider

class DocumentExtractionAgent(BaseAgent):
    """
    Agent 3: Document Extraction Agent
    Unifies OCR and Named Entity Recognition (NER) into a single logical extraction agent.
    Uses DocumentExtractionProvider. Every extracted field includes field-level evidence
    (page, bounding box, raw text, confidence, source).
    """
    def __init__(self, provider_type: str = "DEMO"):
        super().__init__(
            name="DocumentExtractionAgent",
            role="Extracts deed schedules, party entities, boundaries, and survey numbers with bounding box evidence"
        )
        self.provider = get_extraction_provider(provider_type)

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        file_path = context.get("file_path")
        extraction = await self.provider.extract(file_path, context)

        return {
            "agent_id": "AGENT_3_DOCUMENT_EXTRACTION",
            "provider": extraction.get("provider"),
            "is_simulated": extraction.get("is_simulated", True),
            "source_mode": extraction.get("source_mode", "DEMO"),
            "detected_script": extraction.get("detected_script"),
            "confidence": extraction.get("confidence", 0.95),
            "raw_text": extraction.get("raw_text"),
            "character_count": extraction.get("character_count", 0),
            "fields": extraction.get("fields", []),
            "entities": extraction.get("entities", {}),
        }

# Backward-compatibility wrappers for legacy code/tests
class IndicOCRAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="IndicOCRAgent", role="Legacy wrapper for OCR extraction")
        self.extraction_agent = DocumentExtractionAgent()

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        res = await self.extraction_agent.process(context)
        return {
            "ocr_model": "chitrapathak-1",
            "detected_script": res.get("detected_script"),
            "confidence": res.get("confidence", 0.95) * 100,
            "raw_text": res.get("raw_text"),
            "character_count": res.get("character_count"),
            "fields": res.get("fields"),
        }

class IndicNERAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="IndicNERAgent", role="Legacy wrapper for NER extraction")
        self.extraction_agent = DocumentExtractionAgent()

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        res = await self.extraction_agent.process(context)
        return {
            "ner_model": "muril-address-ner",
            "entities": res.get("entities"),
            "ner_confidence": res.get("confidence", 0.95) * 100,
        }
