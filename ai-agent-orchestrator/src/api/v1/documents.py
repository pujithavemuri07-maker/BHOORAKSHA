from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from src.crew import crew

router = APIRouter(prefix="/documents", tags=["Document AI"])

@router.post("/process")
async def process_document(
    state: str = Form("Karnataka"),
    district: str = Form("Bengaluru Urban"),
    taluk: str = Form("Anekal"),
    village: str = Form("Sarjapura"),
    survey_number: str = Form("142"),
    subdivision_number: Optional[str] = Form("2A"),
    extent_acres: float = Form(2.45),
    document_type: str = Form("sale_deed"),
    file: Optional[UploadFile] = File(None),
):
    """
    Direct asynchronous trigger for the 10-agent AI verification pipeline.
    """
    context = {
        "application_no": f"BR-2026-DOC-{survey_number}",
        "state": state,
        "district": district,
        "taluk": taluk,
        "village": village,
        "survey_number": survey_number,
        "subdivision_number": subdivision_number,
        "extent_acres": extent_acres,
        "document_type": document_type,
        "file_name": file.filename if file else "deed_sample.pdf",
        "file_size": 1024 * 512,
    }

    result = await crew.run_pipeline(context)
    return {
        "status": "COMPLETED",
        "pipeline_result": result,
    }
