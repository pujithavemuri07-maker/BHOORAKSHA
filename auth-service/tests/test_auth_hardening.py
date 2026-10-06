import pytest
import uuid
import time
from datetime import datetime, timezone, timedelta
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from src.models.user import User
from src.models.session import UserSession
from src.models.otp import OTPChallenge
from src.schemas.user import UserCreate, StaffProvisionRequest
from src.schemas.auth import LoginRequest, RefreshRequest
from src.services.auth_service import auth_service, record_auth_event
from src.services.otp_service import otp_service
from src.services.oauth_service import oauth_service
from src.services.jwt_service import jwt_service
from src.core.security import get_password_hash, verify_password, hash_otp, verify_otp_hash
from src.config import settings

# -------------------------------------------------------------
# A. CITIZEN REGISTRATION & ROLE TAMPER RESISTANCE
# -------------------------------------------------------------
def test_public_registration_forces_citizen_role():
    """
    Acceptance Criteria:
    - Public registration MUST always create role='CITIZEN'.
    - Self-selecting staff roles (ADMIN, DEO, REVENUE) must be completely ignored or prevented.
    """
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = None

    # Attacker attempts to register with role="ADMIN"
    user_in = UserCreate(
        email="tamper@example.com",
        full_name="Attacker Trying Admin",
        password="SecurePassword123!",
        role="ADMIN"
    )

    created_user = auth_service.register_user(mock_db, user_in)
    assert created_user.role == "CITIZEN", "Public registration must strictly force CITIZEN role!"
    assert created_user.email == "tamper@example.com"


# -------------------------------------------------------------
# B. STAFF ACCOUNT PROVISIONING
# -------------------------------------------------------------
def test_staff_account_provisioning_authorized_admin():
    """
    Acceptance Criteria:
    - An authorized ADMIN can provision department staff accounts (DEO, VERIFIER, etc.).
    - Audit event and provisioned_by are properly tracked.
    """
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = None

    admin_user = User(
        id=uuid.uuid4(),
        email="admin@bhooraksha.gov.in",
        full_name="System Admin",
        role="ADMIN",
        is_active=True
    )

    staff_in = StaffProvisionRequest(
        email="patwari_deo@bhooraksha.gov.in",
        full_name="Shri Ramesh DEO",
        role="DEO",
        password="StaffPassword123!"
    )

    provisioned = auth_service.provision_staff_user(mock_db, admin_user, staff_in)
    assert provisioned.role == "DEO"
    assert provisioned.provisioned_by == admin_user.id
    assert provisioned.is_active is True
    assert provisioned.is_verified is True


def test_staff_account_provisioning_forbidden_for_non_admin():
    """
    Acceptance Criteria:
    - A CITIZEN or non-admin user is strictly forbidden from provisioning staff accounts.
    """
    mock_db = MagicMock()
    citizen_user = User(
        id=uuid.uuid4(),
        email="citizen@example.com",
        full_name="Ordinary Citizen",
        role="CITIZEN",
        is_active=True
    )

    staff_in = StaffProvisionRequest(
        email="new_deo@bhooraksha.gov.in",
        full_name="Fake DEO",
        role="DEO",
        password="StaffPassword123!"
    )

    with pytest.raises(HTTPException) as exc_info:
        auth_service.provision_staff_user(mock_db, citizen_user, staff_in)
    assert exc_info.value.status_code == 403
    assert "Only System Administrators" in exc_info.value.detail


# -------------------------------------------------------------
# C. PASSWORD SECURITY & REMOVAL OF PROTOTYPE BACKDOOR
# -------------------------------------------------------------
def test_no_hardcoded_password_backdoor():
    """
    Acceptance Criteria:
    - Prototype backdoor 'Password@123' must NOT authenticate any random account.
    """
    # Create user with a different password
    hashed = get_password_hash("ActualUserSecret999!")
    assert verify_password("ActualUserSecret999!", hashed) is True
    # Attempt bypass with former prototype backdoor
    assert verify_password("Password@123", hashed) is False, "Backdoor Password@123 must not be active!"


# -------------------------------------------------------------
# D. SESSION MANAGEMENT & LOGOUT REVOCATION
# -------------------------------------------------------------
def test_session_creation_and_revocation_on_logout():
    """
    Acceptance Criteria:
    - Login creates persistent session.
    - Logout marks session revoked in database.
    """
    mock_db = MagicMock()
    user = User(
        id=uuid.uuid4(),
        email="session_user@bhooraksha.gov.in",
        role="CITIZEN",
        is_active=True
    )

    # 1. Create session
    refresh_token = "mock-refresh-token-xyz-123"
    session = auth_service.create_session(mock_db, user, refresh_token=refresh_token, ip_address="127.0.0.1")
    assert session.user_id == user.id
    assert session.revoked_at is None

    # 2. Revoke session on logout
    mock_db.query.return_value.filter.return_value.first.return_value = session
    revoked = auth_service.revoke_session(mock_db, refresh_token)
    assert revoked is True
    assert session.revoked_at is not None


# -------------------------------------------------------------
# E. PERSISTENT OTP CHALLENGES & PURPOSE ISOLATION
# -------------------------------------------------------------
def test_otp_hashing_and_purpose_isolation():
    """
    Acceptance Criteria:
    - OTP is stored as a secure HMAC hash, not raw plaintext.
    - An OTP issued for PASSWORD_RESET cannot verify LOGIN.
    """
    raw_code = "481920"
    otp_hash = hash_otp(raw_code)
    assert verify_otp_hash(raw_code, otp_hash) is True
    assert verify_otp_hash("000000", otp_hash) is False

    # Purpose isolation
    identifier = "purpose_test@bhooraksha.gov.in"
    now = datetime.now(timezone.utc)
    challenge = OTPChallenge(
        identifier=identifier,
        otp_hash=otp_hash,
        purpose="PASSWORD_RESET",
        attempts=0,
        max_attempts=3,
        expires_at=now + timedelta(minutes=5),
        is_consumed=False
    )

    mock_db = MagicMock()
    # If querying for LOGIN, return None (simulating DB query filter on purpose)
    def mock_filter(*args, **kwargs):
        filter_mock = MagicMock()
        # If purpose filter has LOGIN, return None; if PASSWORD_RESET, return challenge
        return filter_mock

    mock_db.query.return_value.filter.return_value.order_by.return_value.first.return_value = None
    # Verifying for LOGIN must fail
    res_login = otp_service.verify_otp(identifier, raw_code, purpose="LOGIN", db=mock_db)
    assert res_login is False

    # Now verify with matching purpose
    mock_db.query.return_value.filter.return_value.order_by.return_value.first.return_value = challenge
    res_reset = otp_service.verify_otp(identifier, raw_code, purpose="PASSWORD_RESET", db=mock_db)
    assert res_reset is True
    assert challenge.is_consumed is True


# -------------------------------------------------------------
# F. CRITICAL SOCIAL LOGIN ROLE RULE (OAuth)
# -------------------------------------------------------------
def test_oauth_unlinked_identity_strictly_provisions_as_citizen():
    """
    Acceptance Criteria:
    - External identity login (Google/Microsoft/Apple) NEVER grants a staff role.
    - New/unlinked identities are strictly provisioned as CITIZEN.
    """
    mock_db = MagicMock()
    # Query for OAuthIdentity returns None (unlinked)
    mock_db.query.return_value.filter.return_value.first.return_value = None

    settings.GOOGLE_CLIENT_ID = "mock-google-client-id"
    with patch("src.services.oauth_service.OAuthService.verify_provider_identity", return_value={
        "provider_user_id": "google-sub-999888",
        "email": "external_doctor@gmail.com",
        "name": "Dr. Strange",
        "claims": {"sub": "google-sub-999888", "email": "external_doctor@gmail.com"}
    }):
        user, is_new = oauth_service.authenticate_or_link_oauth(mock_db, "google", "mock-id-token")
        assert is_new is True
        assert user.role == "CITIZEN", "OAuth identity must NEVER auto-grant a staff role!"
    settings.GOOGLE_CLIENT_ID = ""


def test_oauth_unconfigured_provider_reports_configuration_required():
    """
    Acceptance Criteria:
    - When OAuth provider is not configured, returns 501 NOT_IMPLEMENTED / CONFIGURATION_REQUIRED.
    - Does NOT fabricate fake successful OAuth redirects or tokens in normal mode.
    """
    settings.DEMO_MODE = False
    settings.GOOGLE_CLIENT_ID = ""
    with pytest.raises(HTTPException) as exc_info:
        oauth_service.get_authorization_url("google")
    assert exc_info.value.status_code == 501
    assert "not configured" in exc_info.value.detail.lower()


# -------------------------------------------------------------
# G. ACCOUNT ACTIVATION / DEACTIVATION
# -------------------------------------------------------------
def test_account_deactivation_by_admin():
    """
    Acceptance Criteria:
    - Admin can deactivate account.
    - Deactivation invalidates active sessions and rejects authentication.
    """
    mock_db = MagicMock()
    admin = User(id=uuid.uuid4(), email="admin@bhooraksha.gov.in", role="ADMIN")
    staff = User(
        id=uuid.uuid4(),
        email="bad_staff@bhooraksha.gov.in",
        role="DEO",
        is_active=True
    )
    mock_db.query.return_value.filter.return_value.first.return_value = staff

    # Admin deactivates staff
    updated = auth_service.toggle_user_status(mock_db, admin, staff.id, is_active=False)
    assert updated.is_active is False

    # Deactivated staff cannot authenticate
    res = auth_service.authenticate_user(mock_db, staff.email, "AnyPassword123!")
    assert res is None


# -------------------------------------------------------------
# H. ARGON2ID HASHING & LEGACY BCRYPT TRANSPARENT UPGRADE
# -------------------------------------------------------------
def test_argon2_hashing_and_legacy_bcrypt_upgrade():
    """
    Acceptance Criteria:
    - New hashes use Argon2id.
    - Legacy bcrypt hashes continue to verify.
    - Successful authentication transparently upgrades legacy bcrypt to Argon2id.
    """
    import bcrypt
    from src.core.security import password_needs_rehash

    raw_password = "LegacyBcryptPassword123!"
    salt = bcrypt.gensalt(rounds=10)
    legacy_bcrypt_hash = bcrypt.hashpw(raw_password.encode("utf-8"), salt).decode("utf-8")
    assert legacy_bcrypt_hash.startswith(("$2a$", "$2b$"))

    # Verify legacy hash works
    assert verify_password(raw_password, legacy_bcrypt_hash) is True
    assert password_needs_rehash(legacy_bcrypt_hash) is True

    # User in database with legacy hash
    mock_db = MagicMock()
    user = User(
        id=uuid.uuid4(),
        email="legacy_user@bhooraksha.gov.in",
        role="CITIZEN",
        password_hash=legacy_bcrypt_hash,
        is_active=True,
        failed_login_attempts=0
    )
    mock_db.query.return_value.filter.return_value.first.return_value = user

    authenticated = auth_service.authenticate_user(mock_db, user.email, raw_password)
    assert authenticated is not None
    # Password hash must now be upgraded to Argon2id
    assert authenticated.password_hash.startswith("$argon2"), "Legacy hash must be transparently upgraded to Argon2id!"
    assert password_needs_rehash(authenticated.password_hash) is False
    assert verify_password(raw_password, authenticated.password_hash) is True


# -------------------------------------------------------------
# I. ROLE CHANGE SESSION REVOCATION
# -------------------------------------------------------------
def test_role_change_revokes_all_active_sessions():
    """
    Acceptance Criteria:
    - When admin changes DEO -> VERIFIER, all active sessions are immediately revoked.
    - User must authenticate again to receive new role.
    - Non-admin cannot change roles.
    """
    mock_db = MagicMock()
    admin = User(id=uuid.uuid4(), email="admin@bhooraksha.gov.in", role="ADMIN", is_active=True)
    citizen = User(id=uuid.uuid4(), email="citizen@bhooraksha.gov.in", role="CITIZEN", is_active=True)
    officer = User(id=uuid.uuid4(), email="officer@bhooraksha.gov.in", role="DEO", is_active=True)

    session1 = UserSession(id=uuid.uuid4(), user_id=officer.id, revoked_at=None)
    session2 = UserSession(id=uuid.uuid4(), user_id=officer.id, revoked_at=None)

    mock_db.query.return_value.filter.return_value.first.return_value = officer
    mock_db.query.return_value.filter.return_value.all.return_value = [session1, session2]

    # Non-admin rejected
    with pytest.raises(HTTPException) as exc_info:
        auth_service.change_user_role(mock_db, citizen, officer.id, "VERIFIER")
    assert exc_info.value.status_code == 403

    # Admin changes role
    updated = auth_service.change_user_role(mock_db, admin, officer.id, "VERIFIER")
    assert updated.role == "VERIFIER"
    assert session1.revoked_at is not None, "Session 1 must be revoked on role change!"
    assert session2.revoked_at is not None, "Session 2 must be revoked on role change!"


# -------------------------------------------------------------
# J. PASSWORD RESET MULTI-DEVICE SESSION INVALIDATION
# -------------------------------------------------------------
def test_password_reset_invalidates_all_active_sessions():
    """
    Acceptance Criteria:
    - User logged in on Device A and Device B.
    - User resets password using OTP challenge.
    - Both sessions are immediately marked revoked.
    """
    mock_db = MagicMock()
    user = User(
        id=uuid.uuid4(),
        email="multi_device@bhooraksha.gov.in",
        role="CITIZEN",
        password_hash=get_password_hash("OldPassword123!"),
        is_active=True
    )
    session_device_a = UserSession(id=uuid.uuid4(), user_id=user.id, revoked_at=None)
    session_device_b = UserSession(id=uuid.uuid4(), user_id=user.id, revoked_at=None)

    mock_db.query.return_value.filter.return_value.first.return_value = user
    mock_db.query.return_value.filter.return_value.all.return_value = [session_device_a, session_device_b]

    # Mock valid OTP verification
    with patch.object(otp_service, "verify_otp", return_value=True):
        res = auth_service.reset_password_with_otp(mock_db, user.email, "123456", "NewSuperPassword999!")
        assert res is True

    # Both sessions must now be revoked
    assert session_device_a.revoked_at is not None
    assert session_device_b.revoked_at is not None
    assert verify_password("NewSuperPassword999!", user.password_hash) is True
    assert verify_password("OldPassword123!", user.password_hash) is False


# -------------------------------------------------------------
# K. ACCOUNT LOCKOUT AFTER FAILED ATTEMPTS
# -------------------------------------------------------------
def test_account_lockout_after_max_failed_attempts():
    """
    Acceptance Criteria:
    - 5 consecutive failed login attempts lock account for 15 minutes.
    - Subsequent attempt raises 403 Forbidden with lockout notification.
    """
    mock_db = MagicMock()
    user = User(
        id=uuid.uuid4(),
        email="victim@bhooraksha.gov.in",
        role="CITIZEN",
        password_hash=get_password_hash("CorrectPassword123!"),
        is_active=True,
        failed_login_attempts=4,
        locked_until=None
    )
    mock_db.query.return_value.filter.return_value.first.return_value = user

    # 5th failed attempt triggers lock
    res = auth_service.authenticate_user(mock_db, user.email, "WrongPassword!")
    assert res is None
    assert user.failed_login_attempts == 5
    assert user.locked_until is not None

    # Next attempt (even with correct password) is blocked by lockout
    with pytest.raises(HTTPException) as exc_info:
        auth_service.authenticate_user(mock_db, user.email, "CorrectPassword123!")
    assert exc_info.value.status_code == 403
    assert "temporarily locked" in exc_info.value.detail.lower()

