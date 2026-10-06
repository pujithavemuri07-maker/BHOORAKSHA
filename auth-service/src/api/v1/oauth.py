from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import Dict, Any

from src.database import get_db
from src.models.user import User
from src.schemas.auth import TokenResponse, OAuthLoginRequest, OAuthLinkRequest
from src.services.oauth_service import oauth_service
from src.services.jwt_service import jwt_service
from src.services.auth_service import auth_service, record_auth_event
from src.api.deps import get_current_user

router = APIRouter(prefix="/auth/oauth", tags=["OAuth / OIDC"])

@router.get("/{provider}/authorize")
def get_oauth_authorize_url(provider: str):
    """
    Get provider authorization URL for Google, Microsoft, or Apple.
    Returns 501 NOT IMPLEMENTED / CONFIGURATION_REQUIRED if provider credentials are missing.
    """
    return oauth_service.get_authorization_url(provider)

@router.post("/{provider}/callback", response_model=TokenResponse)
def oauth_callback(
    provider: str,
    payload: OAuthLoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticate via OAuth/OIDC.
    CRITICAL SOCIAL LOGIN ROLE RULE:
    External identity login NEVER automatically grants a staff role.
    If unlinked, provisions strictly as CITIZEN.
    If linked to an authorized staff account, retains existing role.
    """
    if not payload.id_token and not payload.code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Either id_token or authorization code required.")

    id_token = payload.id_token or payload.code
    user, is_new = oauth_service.authenticate_or_link_oauth(db, provider, id_token)

    tokens = jwt_service.generate_tokens(
        user_id=str(user.id),
        email=user.email,
        role=user.role,
    )

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    auth_service.create_session(
        db=db,
        user=user,
        refresh_token=tokens["refresh_token"],
        ip_address=client_ip,
        user_agent=user_agent
    )

    event_type = "OAUTH_USER_REGISTERED" if is_new else "OAUTH_LOGIN_SUCCESS"
    record_auth_event(
        event_type,
        user.email,
        str(user.id),
        {"provider": provider, "role": user.role},
        ip_address=client_ip,
        user_agent=user_agent,
        db=db
    )

    return {
        **tokens,
        "user": user,
    }

@router.post("/link")
def link_oauth_identity(
    payload: OAuthLinkRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Link external OAuth provider identity (Google/Microsoft/Apple) to existing authenticated account.
    Privilege escalation is impossible: existing Bhooraksha role remains unchanged.
    """
    link = oauth_service.link_account_for_authenticated_user(
        db=db,
        current_user=current_user,
        provider=payload.provider,
        id_token=payload.id_token
    )
    record_auth_event(
        "PROVIDER_LINKED",
        current_user.email,
        str(current_user.id),
        {"provider": payload.provider, "role": current_user.role},
        db=db
    )
    return {
        "status": "success",
        "message": f"Successfully linked {payload.provider} identity to {current_user.email}",
        "provider": payload.provider,
    }
