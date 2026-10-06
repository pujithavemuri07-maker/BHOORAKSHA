import pytest
from datetime import datetime, timezone, timedelta
from unittest.mock import MagicMock
from fastapi import HTTPException

from src.core.security import create_access_token, decode_token, verify_password, get_password_hash
from src.services.auth_service import auth_service, record_auth_event
from src.models.user import User

def test_password_hashing():
    raw_pass = "SecureSecret123!"
    hashed = get_password_hash(raw_pass)
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_generation_and_decoding():
    payload = {"sub": "12345", "email": "test@bhooraksha.gov.in", "role": "citizen"}
    token = create_access_token(payload)
    assert isinstance(token, str)

    decoded = decode_token(token)
    assert decoded is not None
    assert decoded["sub"] == "12345"
    assert decoded["email"] == "test@bhooraksha.gov.in"
    assert decoded["role"] == "citizen"

def test_invalid_token_returns_none():
    assert decode_token("invalid.token.structure") is None


def test_account_lockout_after_failed_attempts():
    """
    Acceptance Criteria 14:
    - Account lockout is enforced after 5 failed attempts.
    """
    mock_db = MagicMock()
    user = User(
        email="lockout_test@bhooraksha.gov.in",
        password_hash=get_password_hash("CorrectPassword123!"),
        is_active=True,
        failed_login_attempts=0,
        locked_until=None
    )
    mock_db.query.return_value.filter.return_value.first.return_value = user

    # 4 failed attempts: not locked yet
    for _ in range(4):
        res = auth_service.authenticate_user(mock_db, user.email, "WrongPassword")
        assert res is None
        assert user.locked_until is None

    # 5th failed attempt: triggers lockout
    res5 = auth_service.authenticate_user(mock_db, user.email, "WrongPassword")
    assert res5 is None
    assert user.locked_until is not None
    assert user.failed_login_attempts >= 5

    # 6th attempt while locked: raises HTTP 403 Forbidden
    with pytest.raises(HTTPException) as exc_info:
        auth_service.authenticate_user(mock_db, user.email, "CorrectPassword123!")
    assert exc_info.value.status_code == 403
    assert "temporarily locked" in exc_info.value.detail


def test_password_recovery_and_reset():
    """
    Acceptance Criteria 13:
    - Password recovery exists (forgot password token -> reset password).
    """
    mock_db = MagicMock()
    user = User(
        email="recovery_test@bhooraksha.gov.in",
        password_hash=get_password_hash("OldPassword123!"),
        is_active=True,
    )
    mock_db.query.return_value.filter.return_value.first.return_value = user

    # 1. Request reset token
    token = auth_service.request_password_reset(mock_db, user.email)
    assert token is not None
    assert user.reset_token == token
    assert user.reset_token_expires_at is not None

    # 2. Reset password with valid token
    success = auth_service.reset_password(mock_db, token, "NewSecurePassword123!")
    assert success is True
    assert user.reset_token is None
    assert verify_password("NewSecurePassword123!", user.password_hash) is True
    assert verify_password("OldPassword123!", user.password_hash) is False


def test_auth_audit_events():
    """Verify security audit events are tracked."""
    record_auth_event("TEST_LOGIN_SUCCESS", "audited_user@bhooraksha.gov.in")
    trail = auth_service.get_auth_audit_trail("audited_user@bhooraksha.gov.in")
    assert len(trail) > 0
    assert any(e["event_type"] == "TEST_LOGIN_SUCCESS" for e in trail)
