import os
from typing import Any, List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Load root .env if present to ensure proper DB configuration
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
if os.path.exists(env_path):
    load_dotenv(env_path, override=True)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "Bhooraksha AI Agent Orchestrator"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/bhooraksha")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

    MODEL_PATH: str = os.getenv("MODEL_PATH", "./models")
    OCR_MODEL: str = os.getenv("OCR_MODEL", "chitrapathak-1")
    NER_MODEL: str = os.getenv("NER_MODEL", "muril-address-ner")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "mock-gemini-key")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bhooraksha-development-super-secret-key-2026!")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "false").lower() == "true"
    USE_BHASHINI: bool = os.getenv("USE_BHASHINI", "false").lower() == "true"
    BHASHINI_API_KEY: str = os.getenv("BHASHINI_API_KEY", "")
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://localhost:3006",
    ]

    @field_validator("CORS_ORIGINS")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if v.startswith("["):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return []

settings = Settings()
