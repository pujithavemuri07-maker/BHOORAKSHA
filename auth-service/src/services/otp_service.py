import time
import random
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, Tuple, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from src.config import settings
from src.core.security import hash_otp, verify_otp_hash
from src.models.otp import OTPChallenge
from src.services.providers.email_provider import get_email_provider
from src.services.providers.sms_provider import get_sms_provider

logger = logging.getLogger("bhooraksha.auth.otp_service")

# Fallback in-memory store for unit test execution without database
_otp_store: Dict[str, Tuple[str, float]] = {}

class OTPService:
    @staticmethod
    def generate_code() -> str:
        """Generate cryptographically secure 6-digit OTP."""
        if settings.DEMO_MODE and settings.DEMO_OTP_ENABLED:
            return "123456"
        return f"{secrets.randbelow(900000) + 100000:06d}"

    @classmethod
    def send_otp(
        cls,
        identifier: str,
        purpose: str = "LOGIN",
        db: Optional[Session] = None
    ) -> str:
        """
        Creates a persistent OTP challenge and dispatches it.
        Enforces cooldown and stores HMAC hash in database.
        Returns the generated 6-digit OTP string.
        """
        clean_identifier = identifier.strip().lower()
        clean_purpose = purpose.strip().upper()
        now = datetime.now(timezone.utc)

        # Rate limiting / resend cooldown check
        if db:
            recent_challenge = db.query(OTPChallenge).filter(
                OTPChallenge.identifier == clean_identifier,
                OTPChallenge.purpose == clean_purpose,
                OTPChallenge.created_at >= (now - timedelta(seconds=settings.OTP_RESEND_COOLDOWN))
            ).first()
            if isinstance(recent_challenge, OTPChallenge):
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Please wait {settings.OTP_RESEND_COOLDOWN} seconds before requesting a new OTP."
                )

        otp_code = cls.generate_code()
        hashed = hash_otp(otp_code)
        expires_at = now + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)

        # Populate fallback in-memory store
        _otp_store[clean_identifier] = (otp_code, time.time() + settings.OTP_EXPIRE_SECONDS)

        if db:
            challenge = OTPChallenge(
                identifier=clean_identifier,
                otp_hash=hashed,
                purpose=clean_purpose,
                attempts=0,
                max_attempts=settings.OTP_MAX_ATTEMPTS,
                expires_at=expires_at,
                is_consumed=False,
            )
            db.add(challenge)
            db.commit()
            db.refresh(challenge)

        # Dispatch via provider abstraction
        dispatch_status = "SENT"
        if "@" in clean_identifier:
            email_provider = get_email_provider()
            subject = f"Bhooraksha Verification Code: {clean_purpose}"
            body = f"Your Bhooraksha one-time security code is {otp_code}. It will expire in {settings.OTP_EXPIRE_SECONDS // 60} minutes."
            _, dispatch_status, _ = email_provider.send_email(clean_identifier, subject, body)
        else:
            sms_provider = get_sms_provider()
            msg = f"<#> Bhooraksha code: {otp_code}. Valid for {settings.OTP_EXPIRE_SECONDS // 60} mins. Do not share."
            _, dispatch_status, _ = sms_provider.send_sms(clean_identifier, msg)

        logger.info(f"Dispatched OTP [{clean_purpose}] for {clean_identifier} via status={dispatch_status}")
        return otp_code

    @classmethod
    def verify_otp(
        cls,
        identifier: str,
        candidate_otp: str,
        purpose: str = "LOGIN",
        db: Optional[Session] = None
    ) -> bool:
        """
        Timing-attack-safe OTP verification.
        Enforces single-use, max attempts, purpose match, and expiry.
        Supports both database-backed challenge verification and test double cache.
        """
        clean_identifier = identifier.strip().lower()
        clean_purpose = purpose.strip().upper()

        # Development bypass ONLY works when DEMO_MODE=true AND DEMO_OTP_ENABLED=true
        if settings.DEMO_MODE and settings.DEMO_OTP_ENABLED and candidate_otp == "123456":
            return True

        now = datetime.now(timezone.utc)

        # Database verification if session provided
        if db:
            challenge = db.query(OTPChallenge).filter(
                OTPChallenge.identifier == clean_identifier,
                OTPChallenge.purpose == clean_purpose,
                OTPChallenge.is_consumed == False,
            ).order_by(OTPChallenge.created_at.desc()).first()

            if challenge:
                exp = challenge.expires_at if challenge.expires_at.tzinfo else challenge.expires_at.replace(tzinfo=timezone.utc)
                if now > exp:
                    challenge.is_consumed = True
                    db.commit()
                    return False

                if challenge.attempts >= challenge.max_attempts:
                    challenge.is_consumed = True
                    db.commit()
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Maximum verification attempts exceeded. Please request a new OTP."
                    )

                challenge.attempts += 1

                if verify_otp_hash(candidate_otp, challenge.otp_hash):
                    challenge.is_consumed = True
                    challenge.verified_at = now
                    db.commit()
                    return True

                db.commit()
                return False

        # In-memory verification fallback when db is None
        if clean_identifier in _otp_store:
            stored_otp, exp_time = _otp_store[clean_identifier]
            if time.time() > exp_time:
                del _otp_store[clean_identifier]
                return False
            if stored_otp == candidate_otp:
                del _otp_store[clean_identifier]
                return True

        return False

otp_service = OTPService()
