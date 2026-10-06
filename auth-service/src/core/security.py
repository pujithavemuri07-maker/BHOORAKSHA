from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import bcrypt
import jwt
from src.config import settings

import hashlib
import hmac

from passlib.hash import argon2

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    try:
        if hashed_password.startswith("$argon2"):
            return argon2.verify(plain_password, hashed_password)
        elif hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
            return bcrypt.checkpw(
                plain_password.encode("utf-8")[:72],
                hashed_password.encode("utf-8")
            )
        else:
            # Fallback attempt
            return argon2.verify(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Generate Argon2id password hash."""
    return argon2.hash(password)

def password_needs_rehash(hashed_password: str) -> bool:
    """Check if a password hash is legacy (e.g. bcrypt) or needs Argon2 parameter update."""
    if not hashed_password:
        return True
    if hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        return True
    if hashed_password.startswith("$argon2"):
        try:
            return argon2.needs_update(hashed_password)
        except Exception:
            return True
    return True


def hash_otp(otp: str, secret_key: str = settings.SECRET_KEY) -> str:
    """Compute HMAC-SHA256 hash of OTP code for persistent storage."""
    return hmac.new(secret_key.encode("utf-8"), otp.encode("utf-8"), hashlib.sha256).hexdigest()

def verify_otp_hash(otp: str, otp_hash: str, secret_key: str = settings.SECRET_KEY) -> bool:
    """Timing-attack-safe comparison of OTP candidate hash."""
    expected = hash_otp(otp, secret_key)
    return hmac.compare_digest(expected, otp_hash)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: Dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
