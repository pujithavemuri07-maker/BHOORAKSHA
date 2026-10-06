import logging
from typing import Dict, Any, Optional
from shared.bhashini.config import BhashiniConfig
from shared.bhashini.client import BhashiniClient

logger = logging.getLogger("bhashini_service")

class BhashiniService:
    """
    High-level facade for Bhashini services.
    Ensures safe, non-blocking execution with automatic fallback to native/mock implementations.
    """
    _instance: Optional["BhashiniService"] = None

    def __init__(self, config: Optional[BhashiniConfig] = None):
        self.config = config or BhashiniConfig()
        self.client = BhashiniClient(self.config)

    @classmethod
    def get_instance(cls) -> "BhashiniService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @property
    def is_enabled(self) -> bool:
        return self.config.is_configured

    async def translate_indic_to_english(
        self,
        text: str,
        source_lang: str
    ) -> Optional[str]:
        """
        Translates Indic text (e.g. Kannada, Hindi, Marathi, Telugu) to English.
        Returns None if Bhashini is disabled or fails, allowing caller fallback.
        """
        if not self.is_enabled or not text:
            return None

        try:
            translated = await self.client.translate(
                text=text,
                source_lang=source_lang,
                target_lang="en"
            )
            return translated
        except Exception as exc:
            logger.warning("Bhashini translation fallback triggered: %s", exc)
            return None

    async def translate_english_to_indic(
        self,
        text: str,
        target_lang: str
    ) -> Optional[str]:
        """Translates English text to an Indic target language."""
        if not self.is_enabled or not text:
            return None

        try:
            translated = await self.client.translate(
                text=text,
                source_lang="en",
                target_lang=target_lang
            )
            return translated
        except Exception as exc:
            logger.warning("Bhashini translation to %s fallback triggered: %s", target_lang, exc)
            return None

    async def process_document_ocr(
        self,
        image_base64: str,
        lang_code: str
    ) -> Optional[str]:
        """Performs OCR extraction via Bhashini pipeline if enabled."""
        if not self.is_enabled or not image_base64:
            return None

        try:
            return await self.client.ocr(image_base64, source_lang=lang_code)
        except Exception as exc:
            logger.warning("Bhashini OCR fallback triggered: %s", exc)
            return None

# Convenience singleton instance
bhashini_service = BhashiniService.get_instance()
