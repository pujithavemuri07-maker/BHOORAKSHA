from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger("bhooraksha.providers.extraction")

class DocumentExtractionProvider(ABC):
    """Abstract base provider for land document extraction."""

    @abstractmethod
    async def extract(self, file_path: Optional[str], context: Dict[str, Any]) -> Dict[str, Any]:
        """Extract structured fields with evidence from document."""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the extraction provider."""
        pass

    @property
    @abstractmethod
    def is_simulated(self) -> bool:
        """True if the provider returns simulated demo data."""
        pass


class DemoDocumentExtractionProvider(DocumentExtractionProvider):
    """
    DEMO Document Extraction Provider.
    Clearly marked as simulated. Provides mock OCR/NER data with field-level evidence.
    """

    @property
    def provider_name(self) -> str:
        return "DEMO_OCR_PROVIDER"

    @property
    def is_simulated(self) -> bool:
        return True

    async def extract(self, file_path: Optional[str], context: Dict[str, Any]) -> Dict[str, Any]:
        village = context.get("village", "Sarjapura")
        survey = context.get("survey_number", "142")
        subdivision = context.get("subdivision_number", "2A")
        extent = float(context.get("extent_acres", 2.45))
        state = context.get("state", "Karnataka")

        full_survey = f"{survey}/{subdivision}" if subdivision else str(survey)

        # Field-level evidence structure
        extracted_fields = [
            {
                "field": "survey_number",
                "value": full_survey,
                "confidence": 0.98,
                "evidence": {
                    "page": 1,
                    "bbox": [120, 330, 560, 390],
                    "text": f"ಸರ್ವೆ ನಂಬರ್: {full_survey} (Survey No. {full_survey})"
                },
                "source": "DEMO_OCR"
            },
            {
                "field": "extent_acres",
                "value": extent,
                "confidence": 0.96,
                "evidence": {
                    "page": 1,
                    "bbox": [120, 400, 500, 440],
                    "text": f"ವಿಸ್ತೀರ್ಣ: {extent} ಎಕರೆ (Extent: {extent} Acres)"
                },
                "source": "DEMO_OCR"
            },
            {
                "field": "village",
                "value": village,
                "confidence": 0.97,
                "evidence": {
                    "page": 1,
                    "bbox": [120, 280, 450, 320],
                    "text": f"ಗ್ರಾಮ: {village} (Village: {village})"
                },
                "source": "DEMO_OCR"
            },
            {
                "field": "executant",
                "value": "Devendra Sharma",
                "confidence": 0.95,
                "evidence": {
                    "page": 1,
                    "bbox": [120, 200, 520, 240],
                    "text": "ಬರೆದುಕೊಟ್ಟವರು: ದೇವೇಂದ್ರ ಶರ್ಮಾ (Devendra Sharma)"
                },
                "source": "DEMO_OCR"
            },
            {
                "field": "claimant",
                "value": "Rajesh Sharma",
                "confidence": 0.97,
                "evidence": {
                    "page": 1,
                    "bbox": [120, 240, 520, 280],
                    "text": "ಬರೆಸಿಕೊಂಡವರು: ರಾಜೇಶ್ ಶರ್ಮಾ (Rajesh Sharma)"
                },
                "source": "DEMO_OCR"
            },
            {
                "field": "document_number",
                "value": "2024/09412",
                "confidence": 0.99,
                "evidence": {
                    "page": 1,
                    "bbox": [400, 100, 750, 140],
                    "text": "ನೋಂದಣಿ ಸಂಖ್ಯೆ: 2024/09412 (Registration No: 2024/09412)"
                },
                "source": "DEMO_OCR"
            },
            {
                "field": "boundaries",
                "value": {
                    "north": "Government Drainage Channel",
                    "south": "Survey No 143 (Muniyappa Land)",
                    "east": "30 Feet Village Road",
                    "west": f"Survey No {survey}/1 (Gowda Property)"
                },
                "confidence": 0.92,
                "evidence": {
                    "page": 2,
                    "bbox": [100, 500, 700, 680],
                    "text": "ಚಕ್ಕುಬಂದಿ: ಉತ್ತರ: ಸರ್ಕಾರಿ ಕಾಲುವೆ, ದಕ್ಷಿಣ: ಮುನಿಯಪ್ಪ ಜಮೀನು ಸರ್ವೆ #143, ಪೂರ್ವ: 30 ಅಡಿ ರಸ್ತೆ, ಪಶ್ಚಿಮ: ಗೌಡರ ಜಮೀನು"
                },
                "source": "DEMO_OCR"
            }
        ]

        raw_text = f"""ಕರ್ನಾಟಕ ಸರ್ಕಾರ - ನೋಂದಣಿ ಮತ್ತು ಮುದ್ರಾಂಕ ಇಲಾಖೆ
ಕ್ರಯ ಪತ್ರ (DEED OF SALE) - ನೋಂದಣಿ ಸಂಖ್ಯೆ: 2024/09412
ದಿನಾಂಕ: 14/02/2024
ಬರೆದುಕೊಟ್ಟವರು: ದೇವೇಂದ್ರ ಶರ್ಮಾ (Devendra Sharma)
ಬರೆಸಿಕೊಂಡವರು: ರಾಜೇಶ್ ಶರ್ಮಾ (Rajesh Sharma)
ಗ್ರಾಮ: {village}, ತಾಲೂಕು: ಆನೇಕಲ್, ಜಿಲ್ಲೆ: ಬೆಂಗಳೂರು ನಗರ
ಸರ್ವೆ ನಂಬರ್: {full_survey}, ವಿಸ್ತೀರ್ಣ: {extent} ಎಕರೆ (Acres)
ಚಕ್ಕುಬಂದಿ:
ಉತ್ತರ: ಸರ್ಕಾರಿ ಕಾಲುವೆ (Govt Channel)
ದಕ್ಷಿಣ: ಮುನಿಯಪ್ಪ ಜಮೀನು ಸರ್ವೆ #143
ಪೂರ್ವ: 30 ಅಡಿ ಗ್ರಾಮ ರಸ್ತೆ
ಪಶ್ಚಿಮ: ಗೌಡರ ಜಮೀನು"""

        return {
            "provider": self.provider_name,
            "is_simulated": True,
            "source_mode": "DEMO",
            "detected_script": "Kannada / Devanagari / Latin",
            "confidence": 0.96,
            "raw_text": raw_text,
            "character_count": len(raw_text),
            "fields": extracted_fields,
            "entities": {
                "owners": ["Rajesh Sharma", "ರಾಜೇಶ್ ಶರ್ಮಾ"],
                "executants": ["Devendra Sharma", "ದೇವೇಂದ್ರ ಶರ್ಮಾ"],
                "survey_number": full_survey,
                "extent_acres": extent,
                "boundaries": {
                    "north": "Government Drainage Channel",
                    "south": "Survey No 143 (Muniyappa Land)",
                    "east": "30 Feet Village Road",
                    "west": f"Survey No {survey}/1 (Gowda Property)"
                },
                "registration_date": "2024-02-14",
                "deed_number": "2024/09412"
            }
        }


class PaddleOCRDocumentExtractionProvider(DocumentExtractionProvider):
    """Pluggable PaddleOCR provider slot for Indic multilingual extraction."""
    @property
    def provider_name(self) -> str:
        return "PADDLEOCR"

    @property
    def is_simulated(self) -> bool:
        return False

    async def extract(self, file_path: Optional[str], context: Dict[str, Any]) -> Dict[str, Any]:
        # Pluggable placeholder when PaddleOCR weights are mounted
        logger.warning("PaddleOCR weights not mounted, falling back to DEMO provider.")
        demo = DemoDocumentExtractionProvider()
        res = await demo.extract(file_path, context)
        res["provider"] = "PADDLEOCR (FALLBACK_TO_DEMO)"
        return res


class TesseractDocumentExtractionProvider(DocumentExtractionProvider):
    """Pluggable Tesseract OCR provider slot."""
    @property
    def provider_name(self) -> str:
        return "TESSERACT"

    @property
    def is_simulated(self) -> bool:
        return False

    async def extract(self, file_path: Optional[str], context: Dict[str, Any]) -> Dict[str, Any]:
        logger.warning("Tesseract not configured, falling back to DEMO provider.")
        demo = DemoDocumentExtractionProvider()
        res = await demo.extract(file_path, context)
        res["provider"] = "TESSERACT (FALLBACK_TO_DEMO)"
        return res


def get_extraction_provider(provider_type: str = "DEMO") -> DocumentExtractionProvider:
    providers = {
        "DEMO": DemoDocumentExtractionProvider,
        "PADDLEOCR": PaddleOCRDocumentExtractionProvider,
        "TESSERACT": TesseractDocumentExtractionProvider,
    }
    cls = providers.get(provider_type.upper(), DemoDocumentExtractionProvider)
    return cls()
