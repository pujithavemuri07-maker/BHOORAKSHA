import os
from dataclasses import dataclass

@dataclass
class BhashiniConfig:
    """Configuration for Bhashini Indic AI Services."""
    use_bhashini: bool = os.getenv("USE_BHASHINI", "false").lower() in ("true", "1", "yes")
    api_key: str = os.getenv("BHASHINI_API_KEY", "")
    user_id: str = os.getenv("BHASHINI_USER_ID", "")
    pipeline_id: str = os.getenv("BHASHINI_PIPELINE_ID", "")
    inference_url: str = os.getenv(
        "BHASHINI_INFERENCE_URL",
        "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    )
    timeout_seconds: float = float(os.getenv("BHASHINI_TIMEOUT", "5.0"))
    max_retries: int = int(os.getenv("BHASHINI_MAX_RETRIES", "2"))

    @property
    def is_configured(self) -> bool:
        """Returns True only if explicitly enabled and minimally configured with an API key."""
        return self.use_bhashini and bool(self.api_key.strip())
