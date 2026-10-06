from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any, List
import uuid

from src.database import get_db
from src.models.user import User
from src.schemas.user import UserCreate, UserResponse, StaffProvisionRequest, UserStatusUpdate, UserRoleUpdate
from src.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshRequest,
    LogoutRequest,
    PasswordChangeRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from src.services.auth_service import auth_service, record_auth_event
from src.services.jwt_service import jwt_service
from src.api.deps import get_current_user, require_roles
from src.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Public Citizen Registration.
    CRITICAL SECURITY BOUNDARY: Public registration strictly creates CITIZEN role.
    Client cannot self-assign staff roles (DEO/VERIFIER/ADMIN/etc.).
    """
    return auth_service.register_user(db, user_in)

@router.post("/staff/provision", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def provision_staff(
    payload: StaffProvisionRequest,
    current_admin: User = Depends(require_roles(["ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Authorized Staff Account Provisioning.
    ADMIN authority is strictly enforced server-side.
    Provisions DEO, VERIFIER, LEGAL, GIS, REVENUE, or ADMIN accounts.
    """
    return auth_service.provision_staff_user(db, current_admin, payload)

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    """Authenticate user with email/password, track lockout, and establish persistent session."""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    user = auth_service.authenticate_user(db, payload.email, payload.password, ip_address=client_ip, user_agent=user_agent)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Issue tokens
    tokens = jwt_service.generate_tokens(
        user_id=str(user.id),
        email=user.email,
        role=user.role,
    )

    # Create persistent session
    auth_service.create_session(
        db=db,
        user=user,
        refresh_token=tokens["refresh_token"],
        ip_address=client_ip,
        user_agent=user_agent
    )

    return {
        **tokens,
        "user": user,
    }

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: RefreshRequest, request: Request, db: Session = Depends(get_db)):
    """Refresh access token using a valid, non-revoked refresh token."""
    decoded = jwt_service.verify_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user = db.query(User).filter(User.id == decoded["sub"]).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    tokens = jwt_service.generate_tokens(
        user_id=str(user.id),
        email=user.email,
        role=user.role,
    )
    return {
        **tokens,
        "user": user,
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve currently authenticated user identity and role claims."""
    return current_user

@router.post("/logout")
def logout(
    payload: Optional[LogoutRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Logout current user session and revoke credentials.
    Invalidates session in database and emits persistent LOGOUT audit event.
    """
    if payload and payload.refresh_token:
        auth_service.revoke_session(db, payload.refresh_token)
    else:
        auth_service.revoke_all_user_sessions(db, current_user.id)

    record_auth_event("LOGOUT", current_user.email, str(current_user.id), db=db)
    return {"message": "Successfully logged out and session revoked."}

@router.post("/password/change")
def change_password(
    payload: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change password for currently authenticated user."""
    auth_service.change_password(db, str(current_user.id), payload.current_password, payload.new_password)
    return {"message": "Password changed successfully."}

@router.post("/password/forgot")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiate password recovery flow and dispatch persistent OTP challenge.
    Does NOT reveal reset tokens in normal production responses.
    """
    otp = auth_service.request_password_reset(db, payload.email_or_phone)
    resp = {
        "message": "If this email/phone is registered, password reset instructions have been dispatched.",
    }
    # Only reveal debug OTP in explicit isolated demo mode
    if settings.DEMO_MODE and settings.DEMO_OTP_ENABLED and otp:
        resp["debug_otp"] = otp
    return resp

@router.post("/password/reset")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset password using validated single-use OTP.
    Invalidates all active sessions for this account upon completion.
    """
    auth_service.reset_password_with_otp(db, payload.identifier, payload.otp, payload.new_password)
    return {"message": "Password has been successfully reset. Existing sessions have been invalidated. Please log in with your new password."}

@router.patch("/users/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: uuid.UUID,
    payload: UserStatusUpdate,
    current_admin: User = Depends(require_roles(["ADMIN"])),
    db: Session = Depends(get_db)
):
    """Admin-only account activation or deactivation. Deactivation immediately revokes active sessions."""
    return auth_service.toggle_user_status(db, current_admin, user_id, payload.is_active)

@router.patch("/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: uuid.UUID,
    payload: UserRoleUpdate,
    current_admin: User = Depends(require_roles(["ADMIN"])),
    db: Session = Depends(get_db)
):
    """Admin-only role change. Changes user role and immediately revokes active sessions."""
    return auth_service.change_user_role(db, current_admin, user_id, payload.role)


@router.get("/audit", response_model=List[Dict[str, Any]])
def get_auth_audit_trail(
    email: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve authentication security audit events from persistent ledger."""
    # Non-admin users can ONLY inspect their own audit records; attempts to query others are rejected with 403 Forbidden
    is_admin = (current_user.role or "").strip().upper() == "ADMIN"
    if not is_admin:
        if email and email.strip().lower() != current_user.email.strip().lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden: you may only access your own authentication audit events."
            )
        if user_id and str(user_id).strip() != str(current_user.id).strip():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden: you may only access your own authentication audit events."
            )
    
    filter_email = email if is_admin else current_user.email
    return auth_service.get_auth_audit_trail(db, filter_email)

