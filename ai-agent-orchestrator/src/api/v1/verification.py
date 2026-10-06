from fastapi import APIRouter

router = APIRouter(prefix="/verification", tags=["Verification"])

@router.get("/status/{application_no}")
async def get_verification_status(application_no: str):
    """Retrieve current verification confidence and AI stage."""
    return {
        "application_no": application_no,
        "quality_check": "PASSED",
        "ocr_confidence": 98.6,
        "ner_confidence": 98.2,
        "cross_verify_match": True,
        "spatial_overlap": False,
        "composite_risk_score": 14,
        "risk_level": "low",
        "next_sla_deadline": "24 hours",
    }
