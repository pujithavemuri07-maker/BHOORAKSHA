import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
from src.config import settings

logger = logging.getLogger("bhooraksha.auth.email_provider")

class EmailProvider(ABC):
    @abstractmethod
    def send_email(self, to_email: str, subject: str, body: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Returns (success: bool, status_code: str, details: dict)
        status_code may be 'SENT', 'CONFIGURATION_REQUIRED', 'FAILED'
        """
        pass

class SMTPEmailProvider(EmailProvider):
    def send_email(self, to_email: str, subject: str, body: str) -> Tuple[bool, str, Dict[str, Any]]:
        if not settings.SMTP_HOST:
            logger.warning(f"SMTP provider not configured. Attempted email to {to_email}")
            return False, "CONFIGURATION_REQUIRED", {"reason": "SMTP_HOST is not configured in environment"}

        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            msg = MIMEMultipart()
            msg["From"] = settings.SMTP_FROM
            msg["To"] = to_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=5) as server:
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                    server.starttls()
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)

            logger.info(f"Email successfully dispatched to {to_email}")
            return True, "SENT", {"provider": "SMTP", "to": to_email}
        except Exception as e:
            logger.error(f"SMTP dispatch failure: {str(e)}")
            return False, "FAILED", {"error": str(e)}

class DevelopmentEmailProvider(EmailProvider):
    """Development/Demo fallback provider: logs email to console, does not fabricate live SMTP."""
    def send_email(self, to_email: str, subject: str, body: str) -> Tuple[bool, str, Dict[str, Any]]:
        if not settings.SMTP_HOST and not settings.DEMO_MODE:
            return False, "CONFIGURATION_REQUIRED", {"reason": "Email provider credentials not configured"}
        
        logger.info(f"[DEV EMAIL] To: {to_email} | Subject: {subject} | Body: {body}")
        return True, "SENT_DEV_MODE", {"mode": "development", "to": to_email}

def get_email_provider() -> EmailProvider:
    if settings.SMTP_HOST:
        return SMTPEmailProvider()
    return DevelopmentEmailProvider()
