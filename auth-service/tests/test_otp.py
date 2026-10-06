import time
from src.services.otp_service import otp_service, _otp_store
from src.config import settings

def test_otp_generation_and_validation():
    identifier = "citizen@example.com"
    otp = otp_service.send_otp(identifier)
    assert len(otp) == 6

    # Test correct verification
    assert otp_service.verify_otp(identifier, otp) is True

    # Test used or incorrect OTP
    assert otp_service.verify_otp(identifier, "000000") is False


def test_master_dev_otp_conditional_bypass():
    """
    Acceptance Criteria 15:
    - OTP bypass only works in explicit DEMO_MODE=true AND DEMO_OTP_ENABLED=true.
    - Never enable it by default.
    """
    identifier = "random_user@gov.in"

    # 1. When DEMO_OTP_ENABLED is True and DEMO_MODE is True -> Bypass permitted
    settings.DEMO_MODE = True
    settings.DEMO_OTP_ENABLED = True
    assert otp_service.verify_otp(identifier, "123456") is True

    # 2. When DEMO_OTP_ENABLED is False -> Bypass MUST FAIL
    settings.DEMO_OTP_ENABLED = False
    assert otp_service.verify_otp(identifier, "123456") is False

    # 3. When DEMO_MODE is False -> Bypass MUST FAIL
    settings.DEMO_MODE = False
    settings.DEMO_OTP_ENABLED = True
    assert otp_service.verify_otp(identifier, "123456") is False

    # Restore settings
    settings.DEMO_MODE = True
    settings.DEMO_OTP_ENABLED = True


def test_otp_expiration():
    """Verify that expired OTPs are rejected."""
    settings.DEMO_OTP_ENABLED = False
    identifier = "expiring_user@example.com"
    otp = otp_service.send_otp(identifier)

    # Force expiration in in-memory store
    _otp_store[identifier] = (otp, time.time() - 10)

    # Verification must fail
    assert otp_service.verify_otp(identifier, otp) is False

    # Restore setting
    settings.DEMO_OTP_ENABLED = True
