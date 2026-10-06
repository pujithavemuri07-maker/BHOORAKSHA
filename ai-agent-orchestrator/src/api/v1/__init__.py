from fastapi import APIRouter
from src.api.v1.documents import router as documents_router
from src.api.v1.verification import router as verification_router
from src.api.v1.applications import router as applications_router

ai_v1_router = APIRouter(prefix="/api/v1")
ai_v1_router.include_router(applications_router)
ai_v1_router.include_router(documents_router)
ai_v1_router.include_router(verification_router)
