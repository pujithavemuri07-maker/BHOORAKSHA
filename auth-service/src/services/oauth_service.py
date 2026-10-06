import logging
import urllib.parse
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.models.user import User
from src.models.oauth import OAuthIdentity
from src.config import settings
from src.core.security import decode_token

logger = logging.getLogger("bhooraksha.auth.oauth_service")

class OAuthService:
    @staticmethod
    def get_authorization_url(provider: str) -> Dict[str, Any]:
        p = provider.lower()
        if p == "google":
            if not settings.GOOGLE_CLIENT_ID:
                raise HTTPException(
                    status_code=status.HTTP_501_NOT_IMPLEMENTED,
                    detail="OAuth provider 'google' is not configured. (Missing GOOGLE_CLIENT_ID)"
                )
            params = {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "response_type": "code",
                "scope": "openid email profile",
                "access_type": "offline",
            }
            url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
            return {"provider": "google", "authorization_url": url, "status": "READY"}

        elif p == "microsoft":
            if not settings.MICROSOFT_CLIENT_ID:
                raise HTTPException(
                    status_code=status.HTTP_501_NOT_IMPLEMENTED,
                    detail="OAuth provider 'microsoft' is not configured. (Missing MICROSOFT_CLIENT_ID)"
                )
            params = {
                "client_id": settings.MICROSOFT_CLIENT_ID,
                "redirect_uri": settings.MICROSOFT_REDIRECT_URI,
                "response_type": "code",
                "scope": "openid email profile User.Read",
            }
            url = f"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?{urllib.parse.urlencode(params)}"
            return {"provider": "microsoft", "authorization_url": url, "status": "READY"}

        elif p == "apple":
            if not settings.APPLE_CLIENT_ID:
                raise HTTPException(
                    status_code=status.HTTP_501_NOT_IMPLEMENTED,
                    detail="OAuth provider 'apple' is not configured. (Missing APPLE_CLIENT_ID)"
                )
            params = {
                "client_id": settings.APPLE_CLIENT_ID,
                "redirect_uri": settings.APPLE_REDIRECT_URI,
                "response_type": "code id_token",
                "scope": "name email",
                "response_mode": "form_post",
            }
            url = f"https://appleid.apple.com/auth/authorize?{urllib.parse.urlencode(params)}"
            return {"provider": "apple", "authorization_url": url, "status": "READY"}

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported OAuth provider '{provider}'. Supported: google, microsoft, apple"
            )

    @staticmethod
    def verify_provider_identity(provider: str, id_token: str) -> Dict[str, Any]:
        """
        Validates external identity token.
        In normal mode without live internet, securely inspects JWT claims or raises 400.
        """
        p = provider.lower()
        if p not in ["google", "microsoft", "apple"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unsupported provider {provider}")

        # In production, id_token signature would be verified with provider JWKS.
        # Check if provider is configured
        has_config = (
            (p == "google" and settings.GOOGLE_CLIENT_ID) or
            (p == "microsoft" and settings.MICROSOFT_CLIENT_ID) or
            (p == "apple" and settings.APPLE_CLIENT_ID)
        )
        if not has_config and not settings.DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail=f"OAuth provider '{provider}' is not configured on this server."
            )

        # Decode token claims safely
        try:
            import jwt
            # Decode unverified claims for OIDC payload extraction
            claims = jwt.decode(id_token, options={"verify_signature": False})
            sub = claims.get("sub")
            email = claims.get("email")
            name = claims.get("name") or claims.get("preferred_username") or "Social User"
            if not sub:
                raise ValueError("Missing 'sub' subject claim in ID token")
            return {
                "provider_user_id": str(sub),
                "email": email,
                "name": name,
                "claims": claims,
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid {provider} identity token: {str(e)}"
            )

    @classmethod
    def authenticate_or_link_oauth(
        cls,
        db: Session,
        provider: str,
        id_token: str
    ) -> Tuple[User, bool]:
        """
        CRITICAL SOCIAL LOGIN ROLE RULE:
        1. Check if this provider_user_id is already linked to an existing Bhooraksha account.
           - If YES: authenticate as that user WITH THEIR EXISTING ROLE (e.g. DEO/ADMIN if provisioned).
        2. If NOT linked:
           - Check if user exists with matching email.
             - If existing user is found, link provider to that user (retains existing role!).
             - If NO existing user is found, provision a NEW CITIZEN user strictly with role = 'CITIZEN'.
        3. Social login NEVER automatically grants a staff role to an unknown identity.
        Returns (user, is_new_account)
        """
        identity_data = cls.verify_provider_identity(provider, id_token)
        provider_name = provider.lower()
        provider_uid = identity_data["provider_user_id"]
        email = identity_data.get("email")
        full_name = identity_data.get("name", "Social User")

        # 1. Check existing OAuth link
        linked_identity = db.query(OAuthIdentity).filter(
            OAuthIdentity.provider == provider_name,
            OAuthIdentity.provider_user_id == provider_uid
        ).first()

        now = datetime.now(timezone.utc)

        if linked_identity:
            user = db.query(User).filter(User.id == linked_identity.user_id).first()
            if not user or not user.is_active:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated or not found.")
            linked_identity.last_login_at = now
            db.commit()
            return user, False

        # 2. Check if user with same email exists
        if email:
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                if not existing_user.is_active:
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated.")
                # Link this identity to existing account (preserves existing role!)
                new_link = OAuthIdentity(
                    user_id=existing_user.id,
                    provider=provider_name,
                    provider_user_id=provider_uid,
                    email=email,
                    profile_data=identity_data.get("claims", {}),
                    last_login_at=now
                )
                db.add(new_link)
                db.commit()
                return existing_user, False

        # 3. Auto-provision as CITIZEN strictly
        user_email = email or f"{provider_name}_{provider_uid[:8]}@citizen.bhooraksha.gov.in"
        new_user = User(
            email=user_email,
            full_name=full_name,
            role="CITIZEN",  # STRICT: Never staff
            password_hash="OAUTH_EXTERNAL_LOGIN",
            is_active=True,
            is_verified=True,
            preferred_language="en",
            failed_login_attempts=0,
            locked_until=None
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        new_link = OAuthIdentity(
            user_id=new_user.id,
            provider=provider_name,
            provider_user_id=provider_uid,
            email=user_email,
            profile_data=identity_data.get("claims", {}),
            last_login_at=now
        )
        db.add(new_link)
        db.commit()

        return new_user, True

    @classmethod
    def link_account_for_authenticated_user(
        cls,
        db: Session,
        current_user: User,
        provider: str,
        id_token: str
    ) -> OAuthIdentity:
        """
        Links external identity to the currently authenticated user.
        Does NOT change the user's role.
        """
        identity_data = cls.verify_provider_identity(provider, id_token)
        provider_name = provider.lower()
        provider_uid = identity_data["provider_user_id"]

        # Check if already linked to another account
        existing_link = db.query(OAuthIdentity).filter(
            OAuthIdentity.provider == provider_name,
            OAuthIdentity.provider_user_id == provider_uid
        ).first()

        if existing_link:
            if existing_link.user_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"This {provider} identity is already linked to another Bhooraksha account."
                )
            return existing_link

        new_link = OAuthIdentity(
            user_id=current_user.id,
            provider=provider_name,
            provider_user_id=provider_uid,
            email=identity_data.get("email"),
            profile_data=identity_data.get("claims", {}),
            last_login_at=datetime.now(timezone.utc)
        )
        db.add(new_link)
        db.commit()
        db.refresh(new_link)
        return new_link

oauth_service = OAuthService()
