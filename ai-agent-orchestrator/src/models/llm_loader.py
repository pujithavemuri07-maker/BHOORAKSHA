import logging

logger = logging.getLogger("bhooraksha.ai.models.llm")

class LLMModelLoader:
    _instance = None

    @classmethod
    def get_client(cls):
        if cls._instance is None:
            logger.info("Initializing Indic Legal LLM Inference Client...")
            cls._instance = {"provider": "gemini", "status": "CONNECTED"}
        return cls._instance
