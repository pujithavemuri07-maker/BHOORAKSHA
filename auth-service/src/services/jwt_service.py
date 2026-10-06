from typing import Optional, Dict, Any
from src.core.security import create_access_token, create_refresh_token, decode_token
from src.config import settings

class JWTService:
    @staticmethod
    def generate_tokens(user_id: str, email: str, role: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        normalized_role = role.strip().upper()
        payload = {
            "sub": str(user_id),
            "email": email,
            "role": normalized_role,
        }
        if session_id:
            payload["sid"] = str(session_id)

        access_token = create_access_token(payload)
        refresh_token = create_refresh_token(payload)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_EXPIRE_MINUTES * 60,
        }

    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        return decode_token(token)

jwt_service = JWTService()
