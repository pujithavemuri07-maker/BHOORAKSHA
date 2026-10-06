from datetime import datetime, timezone, timedelta
import uuid
import secrets
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from src.models.user import User
from src.models.session import UserSession
from src.models.audit import AuthAuditEvent
from src.schemas.user import UserCreate, StaffProvisionRequest, CANONICAL_ROLES, STAFF_ROLES
from src.core.security import get_password_hash, verify_password, password_needs_rehash
from src.config import settings
from src.services.otp_service import otp_service

logger = logging.getLogger("bhooraksha.auth.service")

# Fallback in-memory audit log for inspection / test isolation
_auth_audit_logs: List[Dict[str, Any]] = []

def record_auth_event(
    event_type: str,
    email: str,
    user_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    db: Optional[Session] = None
):
    entry = {
        "event_type": event_type,
        "email": email,
        "user_id": user_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ip_address": ip_address,
        "user_agent": user_agent,
        "details": details or {},
    }
    _auth_audit_logs.append(entry)

    # Persist to database if Session is provided
    if db:
        try:
            uid = None
            if user_id:
                try:
                    uid = uuid.UUID(str(user_id))
                except Exception:
                    pass
            audit_rec = AuthAuditEvent(
                event_type=event_type,
                email=email,
                user_id=uid,
                ip_address=ip_address,
                user_agent=user_agent,
                details=details or {},
            )
            db.add(audit_rec)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to persist audit event to DB: {e}")

    logger.info(f"Auth Event [{event_type}] for user {email}")

class AuthService:
    @staticmethod
    def register_user(db: Session, user_in: UserCreate) -> User:
        """
        Public citizen registration.
        CRITICAL SECURITY RULE: Public self-registration ALWAYS creates role = 'CITIZEN'.
        Client-supplied role parameters are strictly ignored / forbidden.
        """
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )

        if user_in.phone:
            existing_phone = db.query(User).filter(User.phone == user_in.phone).first()
            if existing_phone:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User with this phone number already exists."
                )

        user = User(
            email=user_in.email,
            phone=user_in.phone,
            full_name=user_in.full_name,
            role="CITIZEN",  # Server-authoritative: NEVER trust client role
            password_hash=get_password_hash(user_in.password),
            preferred_language=user_in.preferred_language or "en",
            is_active=True,
            is_verified=False,
            failed_login_attempts=0,
            locked_until=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        record_auth_event("USER_REGISTERED", user.email, str(user.id), {"role": "CITIZEN"}, db=db)
        return user

    @staticmethod
    def provision_staff_user(db: Session, admin_user: User, staff_in: StaffProvisionRequest) -> User:
        """
        Authorized Staff Account Provisioning.
        Only an authenticated ADMIN can provision staff accounts (DEO, VERIFIER, LEGAL, GIS, REVENUE, ADMIN).
        Records provisioning admin ID, timestamp, and audit event.
        """
        if admin_user.role.upper() != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: Only System Administrators can provision department staff accounts."
            )

        target_role = staff_in.role.strip().upper()
        if target_role not in STAFF_ROLES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid staff role '{staff_in.role}'. Allowed: {STAFF_ROLES}"
            )

        existing_user = db.query(User).filter(User.email == staff_in.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with email '{staff_in.email}' already exists."
            )

        user = User(
            email=staff_in.email,
            phone=staff_in.phone,
            full_name=staff_in.full_name,
            role=target_role,
            password_hash=get_password_hash(staff_in.password),
            preferred_language=staff_in.preferred_language or "en",
            is_active=True,
            is_verified=True,
            provisioned_by=admin_user.id,
            failed_login_attempts=0,
            locked_until=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        record_auth_event(
            "STAFF_ACCOUNT_PROVISIONED",
            user.email,
            str(user.id),
            {
                "provisioned_role": target_role,
                "provisioned_by_admin": str(admin_user.id),
                "admin_email": admin_user.email,
            },
            db=db
        )
        return user

    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Optional[User]:
        """
        Authenticate user with email and password.
        Guards against brute force with exponential/threshold account lockout.
        """
        user = db.query(User).filter(User.email == email).first()
        if not user or not user.is_active:
            record_auth_event("LOGIN_FAILURE", email, details={"reason": "User not found or inactive"}, ip_address=ip_address, user_agent=user_agent, db=db)
            return None

        now = datetime.now(timezone.utc)

        # Check account lockout
        if user.locked_until:
            locked_until = user.locked_until if user.locked_until.tzinfo else user.locked_until.replace(tzinfo=timezone.utc)
            if locked_until > now:
                remaining_mins = max(1, int((locked_until - now).total_seconds() / 60))
                record_auth_event(
                    "LOGIN_FAILURE",
                    email,
                    str(user.id),
                    {"reason": "ACCOUNT_LOCKED", "remaining_minutes": remaining_mins},
                    ip_address=ip_address,
                    user_agent=user_agent,
                    db=db
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Account is temporarily locked due to excessive failed attempts. Please try again in {remaining_mins} minutes."
                )
            else:
                user.locked_until = None
                user.failed_login_attempts = 0

        # Verify password (NO backdoor)
        if not verify_password(password, user.password_hash):
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                user.locked_until = now + timedelta(minutes=settings.ACCOUNT_LOCKOUT_MINUTES)
                record_auth_event("ACCOUNT_LOCKED", email, str(user.id), {"attempts": user.failed_login_attempts}, ip_address=ip_address, user_agent=user_agent, db=db)
            else:
                record_auth_event("LOGIN_FAILURE", email, str(user.id), {"attempts": user.failed_login_attempts}, ip_address=ip_address, user_agent=user_agent, db=db)
            db.commit()
            return None

        # Successful login: reset failed counters and normalize role
        user.failed_login_attempts = 0
        user.locked_until = None
        user.role = user.role.strip().upper()

        # Transparently upgrade legacy hash (e.g. bcrypt) to Argon2id
        if password_needs_rehash(user.password_hash):
            user.password_hash = get_password_hash(password)
            logger.info(f"Transparently upgraded password hash to Argon2id for user {user.email}")

        db.commit()

        record_auth_event("LOGIN_SUCCESS", email, str(user.id), {"role": user.role}, ip_address=ip_address, user_agent=user_agent, db=db)
        return user

    @staticmethod
    def create_session(
        db: Session,
        user: User,
        refresh_token: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> UserSession:
        """Create and store persistent user session."""
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        session = UserSession(
            user_id=user.id,
            refresh_token=refresh_token,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=expires_at,
            revoked_at=None,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def revoke_session(db: Session, refresh_token: str) -> bool:
        """Revoke specific user session on logout."""
        session = db.query(UserSession).filter(UserSession.refresh_token == refresh_token).first()
        if session:
            session.revoked_at = datetime.now(timezone.utc)
            db.commit()
            return True
        return False

    @staticmethod
    def revoke_all_user_sessions(db: Session, user_id: uuid.UUID) -> int:
        """Revoke all active sessions for user (used upon password reset or deactivation)."""
        now = datetime.now(timezone.utc)
        active_sessions = db.query(UserSession).filter(
            UserSession.user_id == user_id,
            UserSession.revoked_at == None
        ).all()
        for s in active_sessions:
            s.revoked_at = now
        db.commit()
        return len(active_sessions)

    @staticmethod
    def change_password(db: Session, user_id: str, current_password: str, new_password: str) -> bool:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        if not verify_password(current_password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")

        user.password_hash = get_password_hash(new_password)
        db.commit()
        record_auth_event("PASSWORD_CHANGED", user.email, str(user.id), db=db)
        return True

    @staticmethod
    def request_password_reset(db: Session, email_or_phone: str) -> Optional[str]:
        """
        Initiate password recovery flow using persistent OTP.
        Avoids user enumeration by returning a generic response.
        """
        identifier = email_or_phone.strip().lower()
        user = db.query(User).filter(
            (User.email == identifier) | (User.phone == identifier)
        ).first()

        if not user:
            record_auth_event("PASSWORD_RESET_REQUESTED_UNKNOWN_USER", identifier, db=db)
            return None

        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        db.commit()

        record_auth_event("PASSWORD_RESET_REQUESTED", user.email, str(user.id), db=db)
        return reset_token

    @classmethod
    def reset_password(cls, db: Session, reset_token: str, new_password: str) -> bool:
        """Backward-compatible reset method for token-based resets."""
        user = db.query(User).filter(User.reset_token == reset_token).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")

        user.password_hash = get_password_hash(new_password)
        user.reset_token = None
        user.reset_token_expires_at = None
        user.failed_login_attempts = 0
        user.locked_until = None
        db.commit()

        cls.revoke_all_user_sessions(db, user.id)
        record_auth_event("PASSWORD_RESET_COMPLETED", user.email, str(user.id), db=db)
        return True

    @classmethod
    def reset_password_with_otp(
        cls,
        db: Session,
        identifier: str,
        otp: str,
        new_password: str
    ) -> bool:
        """
        Reset password using validated OTP.
        Revokes all active sessions for this user.
        """
        is_valid = otp_service.verify_otp(identifier, otp, purpose="PASSWORD_RESET", db=db)
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset code.")

        clean_id = identifier.strip().lower()
        user = db.query(User).filter(
            (User.email == clean_id) | (User.phone == clean_id)
        ).first()

        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

        user.password_hash = get_password_hash(new_password)
        user.failed_login_attempts = 0
        user.locked_until = None
        user.reset_token = None
        user.reset_token_expires_at = None
        db.commit()

        # Invalidate all existing sessions
        cls.revoke_all_user_sessions(db, user.id)

        record_auth_event("PASSWORD_RESET_COMPLETED", user.email, str(user.id), db=db)
        return True

    @classmethod
    def toggle_user_status(cls, db: Session, admin_user: User, target_user_id: uuid.UUID, is_active: bool) -> User:
        """ADMIN-only account activation / deactivation."""
        if admin_user.role.upper() != "ADMIN":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only administrators can modify user status.")

        target = db.query(User).filter(User.id == target_user_id).first()
        if not target:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        target.is_active = is_active
        if not is_active:
            # Invalidate all active sessions for deactivated user
            cls.revoke_all_user_sessions(db, target.id)
            record_auth_event("ACCOUNT_DEACTIVATED", target.email, str(target.id), {"by_admin": str(admin_user.id)}, db=db)
        else:
            record_auth_event("ACCOUNT_ACTIVATED", target.email, str(target.id), {"by_admin": str(admin_user.id)}, db=db)

        db.commit()
        db.refresh(target)
        return target

    @classmethod
    def change_user_role(cls, db: Session, admin_user: User, target_user_id: uuid.UUID, new_role: str) -> User:
        """ADMIN-only role changes. Immediately revokes all active sessions for the target user."""
        if (admin_user.role or "").strip().upper() != "ADMIN":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only administrators can modify user roles.")

        norm_role = new_role.strip().upper()
        if norm_role not in CANONICAL_ROLES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid canonical role: {new_role}")

        target = db.query(User).filter(User.id == target_user_id).first()
        if not target:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        old_role = target.role
        target.role = norm_role

        # Revoke all existing sessions so user cannot retain previous authorization
        cls.revoke_all_user_sessions(db, target.id)

        record_auth_event(
            "ROLE_CHANGED",
            target.email,
            str(target.id),
            {"old_role": old_role, "new_role": norm_role, "by_admin": str(admin_user.id)},
            db=db
        )

        db.commit()
        db.refresh(target)
        return target


    @staticmethod
    def get_auth_audit_trail(db: Optional[Session] = None, email: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve authentication audit trail from database, with fallback to in-memory store."""
        if db:
            try:
                query = db.query(AuthAuditEvent)
                if email:
                    query = query.filter(AuthAuditEvent.email == email)
                events = query.order_by(AuthAuditEvent.created_at.desc()).limit(200).all()
                if events:
                    return [
                        {
                            "id": str(e.id),
                            "event_type": e.event_type,
                            "email": e.email,
                            "user_id": str(e.user_id) if e.user_id else None,
                            "ip_address": e.ip_address,
                            "user_agent": e.user_agent,
                            "details": e.details or {},
                            "timestamp": e.created_at.isoformat() if e.created_at else "",
                        }
                        for e in events
                    ]
            except Exception:
                pass

        if email:
            return [e for e in _auth_audit_logs if e.get("email") == email]
        return list(_auth_audit_logs)

auth_service = AuthService()
