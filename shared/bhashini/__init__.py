"""
Bhashini AI Integration Package for Bhooraksha.
Provides plug-and-play access to the National Language Translation Mission (NLTM) APIs
with automatic, zero-risk fallback to native/mock mechanisms.
"""

from shared.bhashini.config import BhashiniConfig
from shared.bhashini.client import BhashiniClient
from shared.bhashini.service import BhashiniService, bhashini_service

__all__ = [
    "BhashiniConfig",
    "BhashiniClient",
    "BhashiniService",
    "bhashini_service",
]
