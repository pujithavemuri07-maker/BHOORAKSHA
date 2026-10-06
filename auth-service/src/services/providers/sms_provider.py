import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
import urllib.request
import urllib.parse
import json
from src.config import settings

logger = logging.getLogger("bhooraksha.auth.sms_provider")

class SMSProvider(ABC):
    @abstractmethod
    def send_sms(self, phone: str, message: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Returns (success: bool, status_code: str, details: dict)
        status_code may be 'SENT', 'CONFIGURATION_REQUIRED', 'FAILED'
        """
        pass

class HTTPSMSProvider(SMSProvider):
    def send_sms(self, phone: str, message: str) -> Tuple[bool, str, Dict[str, Any]]:
        if not settings.SMS_GATEWAY_URL or not settings.SMS_API_KEY:
            logger.warning(f"SMS gateway credentials not configured. SMS to {phone} withheld.")
            return False, "CONFIGURATION_REQUIRED", {"reason": "SMS_GATEWAY_URL or SMS_API_KEY missing in environment"}

        try:
            payload = json.dumps({
                "to": phone,
                "sender": settings.SMS_SENDER_ID,
                "message": message,
            }).encode("utf-8")

            req = urllib.request.Request(
                settings.SMS_GATEWAY_URL,
                data=payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {settings.SMS_API_KEY}",
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                status_code = resp.status
                return True, "SENT", {"provider": "HTTP_GATEWAY", "status": status_code}
        except Exception as e:
            logger.error(f"SMS dispatch failure: {str(e)}")
            return False, "FAILED", {"error": str(e)}

class DevelopmentSMSProvider(SMSProvider):
    """Development/Demo SMS provider: logs to console, does not fabricate live telco delivery."""
    def send_sms(self, phone: str, message: str) -> Tuple[bool, str, Dict[str, Any]]:
        if not settings.SMS_GATEWAY_URL and not settings.DEMO_MODE:
            return False, "CONFIGURATION_REQUIRED", {"reason": "SMS provider credentials not configured"}

        logger.info(f"[DEV SMS] To: {phone} | Msg: {message}")
        return True, "SENT_DEV_MODE", {"mode": "development", "to": phone}

def get_sms_provider() -> SMSProvider:
    if settings.SMS_GATEWAY_URL and settings.SMS_API_KEY:
        return HTTPSMSProvider()
    return DevelopmentSMSProvider()
