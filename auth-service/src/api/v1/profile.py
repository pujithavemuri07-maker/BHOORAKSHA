from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.models.user import User
from src.schemas.user import UserUpdate, UserResponse
from src.api.deps import get_current_user

router = APIRouter(prefix="/auth/profile", tags=["User Profile"])

@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Retrieve profile of authenticated user."""
    return current_user

@router.put("", response_model=UserResponse)
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile details of current user."""
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.phone is not None:
        current_user.phone = payload.phone
    if payload.preferred_language is not None:
        current_user.preferred_language = payload.preferred_language

    db.commit()
    db.refresh(current_user)
    return current_user
