import logging
from typing import Dict, Any, Optional
import httpx

from shared.bhashini.config import BhashiniConfig

logger = logging.getLogger("bhashini_client")

class BhashiniClient:
    """
    Client for Bhashini (National Language Translation Mission / Dhruva API).
    Provides access to NMT (Translation), ASR (Speech-to-Text), TTS (Text-to-Speech),
    and OCR across 22 scheduled Indian languages.
    """
    def __init__(self, config: Optional[BhashiniConfig] = None):
        self.config = config or BhashiniConfig()

    async def _send_request(self, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Sends an authenticated request to the Bhashini inference pipeline with safety guards."""
        if not self.config.is_configured:
            return None

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.config.api_key,
            "userID": self.config.user_id,
        }

        try:
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                response = await client.post(
                    self.config.inference_url,
                    json=payload,
                    headers=headers
                )
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.warning(
                        "Bhashini API returned status %d: %s",
                        response.status_code,
                        response.text[:200]
                    )
                    return None
        except Exception as exc:
            logger.warning("Bhashini inference request failed gracefully: %s", exc)
            return None

    async def translate(self, text: str, source_lang: str, target_lang: str = "en") -> Optional[str]:
        """
        Translates text from source_lang to target_lang using Bhashini NMT.
        Returns None if not configured or if the call fails.
        """
        if not text or not self.config.is_configured:
            return None

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": source_lang,
                            "targetLanguage": target_lang
                        }
                    }
                }
            ],
            "inputData": {
                "input": [{"source": text}]
            }
        }

        data = await self._send_request(payload)
        if not data:
            return None

        try:
            tasks = data.get("pipelineResponse", [])
            for task in tasks:
                if task.get("taskType") == "translation":
                    output = task.get("output", [])
                    if output and "target" in output[0]:
                        return output[0]["target"]
        except Exception as exc:
            logger.warning("Failed to parse Bhashini translation response: %s", exc)

        return None

    async def ocr(self, image_content_base64: str, source_lang: str) -> Optional[str]:
        """Performs Indic OCR for scanned documents using Bhashini OCR models."""
        if not image_content_base64 or not self.config.is_configured:
            return None

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "ocr",
                    "config": {
                        "language": {"sourceLanguage": source_lang}
                    }
                }
            ],
            "inputData": {
                "image": [{"imageContent": image_content_base64}]
            }
        }

        data = await self._send_request(payload)
        if not data:
            return None

        try:
            tasks = data.get("pipelineResponse", [])
            for task in tasks:
                if task.get("taskType") == "ocr":
                    output = task.get("output", [])
                    if output and "source" in output[0]:
                        return output[0]["source"]
        except Exception as exc:
            logger.warning("Failed to parse Bhashini OCR response: %s", exc)

        return None
