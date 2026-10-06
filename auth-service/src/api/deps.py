from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.database import get_db
from src.core.security import decode_token
from src.models.user import User
from src.models.session import UserSession

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload["sub"]

    # If session ID was encoded in token, verify it is still active and not revoked
    sid = payload.get("sid")
    if sid:
        try:
            session = db.query(UserSession).filter(UserSession.id == sid).first()
            if session and session.revoked_at is not None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session has been revoked. Please authenticate again.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        except Exception:
            pass

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )

    # Normalize role to uppercase server-authoritatively
    user.role = user.role.strip().upper()
    return user

def require_roles(allowed_roles: list[str]):
    normalized_allowed = [r.strip().upper() for r in allowed_roles]
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role.strip().upper()
        if user_role not in normalized_allowed and user_role != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: requires one of {normalized_allowed}",
            )
        return current_user
    return role_checker
