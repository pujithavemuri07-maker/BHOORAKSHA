from fastapi import APIRouter
from src.api.v1.auth import router as auth_router
from src.api.v1.otp import router as otp_router
from src.api.v1.profile import router as profile_router
from src.api.v1.oauth import router as oauth_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(auth_router)
api_v1_router.include_router(otp_router)
api_v1_router.include_router(profile_router)
api_v1_router.include_router(oauth_router)
