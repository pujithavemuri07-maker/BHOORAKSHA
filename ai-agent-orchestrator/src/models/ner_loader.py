import logging

logger = logging.getLogger("bhooraksha.ai.models.ner")

class NERModelLoader:
    _instance = None

    @classmethod
    def get_model(cls):
        if cls._instance is None:
            logger.info("Initializing MuRIL Indic Address & Land Entity Transformer...")
            cls._instance = {"model_name": "muril-address-ner", "vocab_size": 197000, "status": "READY"}
        return cls._instance
