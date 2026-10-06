import logging

logger = logging.getLogger("bhooraksha.ai.models.ocr")

class OCRModelLoader:
    _instance = None

    @classmethod
    def get_model(cls):
        if cls._instance is None:
            logger.info("Initializing Chitrapathak-1 Multilingual Indic OCR Engine...")
            cls._instance = {"model_name": "chitrapathak-1", "languages": 10, "status": "READY"}
        return cls._instance
