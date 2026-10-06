from typing import Optional, List
from fastapi import Depends, HTTPException, status, Header
import jwt
from sqlalchemy.orm import Session
from src.database import get_db
from src.config import settings
from src.models.entities import User

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except Exception:
        return None

def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Extract user from Bearer token if provided."""
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        return None

    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    if user and not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    return user

def require_roles(allowed_roles: List[str]):
    """
    Enforces that user role matches one of allowed_roles (or ADMIN).
    Checks Bearer token or validates server-side identity.
    """
    normalized_allowed = [r.strip().upper() for r in allowed_roles]

    def checker(
        authorization: Optional[str] = Header(None),
        db: Session = Depends(get_db)
    ) -> dict:
        if not authorization or not authorization.startswith("Bearer "):
            # If no token, raise 401 Unauthorized
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication token required",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = authorization.split(" ", 1)[1]
        payload = decode_token(token)
        if not payload or "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_role = str(payload.get("role", "")).strip().upper()
        if user_role not in normalized_allowed and user_role != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: requires one of {normalized_allowed}, got {user_role}",
            )

        return {"user_id": payload["sub"], "role": user_role, "email": payload.get("email")}

    return checker
