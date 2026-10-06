from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from src.database import get_db
from src.models.user import User
from src.schemas.auth import SendOTPRequest, VerifyOTPRequest, TokenResponse
from src.services.otp_service import otp_service
from src.services.jwt_service import jwt_service
from src.services.auth_service import auth_service, record_auth_event
from src.config import settings

router = APIRouter(prefix="/auth/otp", tags=["OTP Authentication"])

@router.post("/send")
def send_otp(payload: SendOTPRequest, db: Session = Depends(get_db)):
    """Generate and dispatch persistent OTP challenge for login, verification, or reset."""
    purpose = payload.purpose.upper() if payload.purpose else "LOGIN"
    otp = otp_service.send_otp(payload.phone_or_email, purpose=purpose, db=db)
    record_auth_event("OTP_DISPATCHED", payload.phone_or_email, details={"purpose": purpose}, db=db)

    resp = {
        "status": "success",
        "message": f"OTP dispatched to {payload.phone_or_email}",
        "purpose": purpose,
        "expires_in_seconds": settings.OTP_EXPIRE_SECONDS,
    }
    # Only expose debug_otp if both DEMO_MODE and DEMO_OTP_ENABLED are explicitly true
    if settings.DEMO_MODE and settings.DEMO_OTP_ENABLED:
        resp["debug_otp"] = otp

    return resp

@router.post("/verify", response_model=TokenResponse)
def verify_otp(payload: VerifyOTPRequest, request: Request, db: Session = Depends(get_db)):
    """Verify single-use persistent OTP and authenticate session."""
    purpose = payload.purpose.upper() if payload.purpose else "LOGIN"
    is_valid = otp_service.verify_otp(payload.phone_or_email, payload.otp, purpose=purpose, db=db)
    if not is_valid:
        record_auth_event("OTP_VERIFICATION_FAILED", payload.phone_or_email, details={"purpose": purpose}, db=db)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid, expired, or previously consumed OTP code",
        )

    # Find user by phone or email, or create citizen user if not exists
    user = db.query(User).filter(
        (User.phone == payload.phone_or_email) | (User.email == payload.phone_or_email)
    ).first()

    if not user:
        # Auto-provision citizen for seamless OTP mobile login (STRICTLY CITIZEN)
        user = User(
            email=f"{payload.phone_or_email}@citizen.bhooraksha.gov.in" if "@" not in payload.phone_or_email else payload.phone_or_email,
            phone=payload.phone_or_email if "@" not in payload.phone_or_email else None,
            full_name="Citizen User",
            role="CITIZEN",
            password_hash="OTP_VERIFIED",
            is_active=True,
            is_verified=True,
            failed_login_attempts=0,
            locked_until=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated.")

    user.role = user.role.strip().upper()
    tokens = jwt_service.generate_tokens(
        user_id=str(user.id),
        email=user.email,
        role=user.role,
    )

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    # Create persistent session
    auth_service.create_session(
        db=db,
        user=user,
        refresh_token=tokens["refresh_token"],
        ip_address=client_ip,
        user_agent=user_agent
    )

    record_auth_event("OTP_LOGIN_SUCCESS", payload.phone_or_email, str(user.id), {"purpose": purpose}, ip_address=client_ip, user_agent=user_agent, db=db)

    return {
        **tokens,
        "user": user,
    }
