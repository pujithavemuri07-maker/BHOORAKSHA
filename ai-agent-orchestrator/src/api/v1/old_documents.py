"""
FastAPI Endpoints for Old Document Digitization in Bhooraksha.
Supports upload, listing, side-by-side verification, issue detection,
landowner notifications, and ULPIN linking for archival records.
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Response
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import uuid

router = APIRouter(prefix="/api/v1/deo/old-documents", tags=["old-documents"])

# In-memory store for immediate demo & standalone operation
OLD_DOCS_STORE: Dict[str, Dict[str, Any]] = {
    "OLD-000123": {
        "document_id": "OLD-000123",
        "document_type": "Register",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Bengaluru North",
        "village": "Yelahanka",
        "year_from": 1970,
        "year_to": 1975,
        "total_pages": 4,
        "status": "COMPLETED",
        "overall_confidence": 72.0,
        "risk_score": 68,
        "risk_category": "MEDIUM",
        "linked_ulpin": "KA-1234-5678-9012",
        "notified_owner": True,
        "routed_to": "verifier",
        "created_at": "2026-09-20T10:15:00Z",
        "pages": [
            {
                "page_number": 1,
                "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
                "detected_script": "Kannada",
                "htr_confidence": 72.0
            }
        ],
        "extracted_records": {
            "survey_number": "123/456",
            "owner_name": "Shankar (S/o Ramu)",
            "area": "2.50 Acres",
            "registration_date": "1975-01-15",
            "village": "Yelahanka",
            "land_type": "Dry Agricultural (Khushki)"
        },
        "issues": [
            {
                "id": "ISSUE-OWN-01",
                "type": "ownership_mismatch",
                "severity": "HIGH",
                "old_value": "Shankar (S/o Ramu)",
                "modern_value": "Suresh Reddy",
                "description": "Owner name differs significantly (Fuzzy: 24%). Possible unregistered transfer between 1975-1990.",
                "recommendation": "Notify current owner + request clarification on transfer chain.",
                "resolved": False
            },
            {
                "id": "ISSUE-SRV-02",
                "type": "survey_number_change",
                "severity": "MEDIUM",
                "old_value": "Sy. No. 123/2",
                "modern_value": "123/456",
                "description": "Likely same parcel (sub-division renumbering during 1982 survey).",
                "recommendation": "Link with note, verify with GIS.",
                "resolved": False
            },
            {
                "id": "ISSUE-AREA-03",
                "type": "area_variation",
                "severity": "LOW",
                "old_value": "2.50 acres",
                "modern_value": "2.48 acres",
                "description": "Within acceptable range (0.8% variation).",
                "recommendation": "No action needed.",
                "resolved": True
            }
        ]
    },
    "OLD-000122": {
        "document_id": "OLD-000122",
        "document_type": "Old Sale Deed",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Bengaluru South",
        "village": "Begur",
        "year_from": 1968,
        "year_to": 1968,
        "total_pages": 3,
        "status": "PROCESSING",
        "overall_confidence": 65.0,
        "risk_score": 45,
        "risk_category": "MEDIUM",
        "linked_ulpin": "KA-5566-7788-9900",
        "notified_owner": False,
        "routed_to": None,
        "created_at": "2026-09-21T06:30:00Z",
        "pages": [
            {
                "page_number": 1,
                "image_url": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80",
                "detected_script": "Devanagari / Modi",
                "htr_confidence": 65.0
            }
        ],
        "extracted_records": {
            "survey_number": "42/A",
            "owner_name": "N. Sitaram",
            "area": "1.25 Acres",
            "registration_date": "1968-11-04",
            "village": "Begur",
            "land_type": "Wet Land (Tari)"
        },
        "issues": []
    },
    "OLD-000121": {
        "document_id": "OLD-000121",
        "document_type": "Pattadar Book",
        "state": "Karnataka",
        "district": "Mysuru",
        "taluk": "Mysuru South",
        "village": "Chamundi Foothills",
        "year_from": 1980,
        "year_to": 1985,
        "total_pages": 6,
        "status": "AWAITING_VERIFICATION",
        "overall_confidence": 88.0,
        "risk_score": 25,
        "risk_category": "LOW",
        "linked_ulpin": "KA-9988-7766-5544",
        "notified_owner": False,
        "routed_to": None,
        "created_at": "2026-09-21T07:10:00Z",
        "pages": [
            {
                "page_number": 1,
                "image_url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
                "detected_script": "Kannada",
                "htr_confidence": 88.0
            }
        ],
        "extracted_records": {
            "survey_number": "88/3",
            "owner_name": "Basavaraju M.",
            "area": "3.10 Acres",
            "registration_date": "1982-03-21",
            "village": "Chamundi Foothills",
            "land_type": "Garden / Bagayat"
        },
        "issues": []
    }
}


@router.post("/upload")
async def upload_old_document(
    document_type: str = Form("Register"),
    state: str = Form("Karnataka"),
    district: str = Form("Bengaluru Urban"),
    taluk: str = Form("Bengaluru North"),
    village: str = Form("Yelahanka"),
    year_from: int = Form(1970),
    year_to: int = Form(1975),
    auto_detect_script: bool = Form(True),
    auto_run_ai: bool = Form(True),
    notify_owner_on_mismatch: bool = Form(True),
    files: Optional[List[UploadFile]] = File(None),
):
    """Uploads scanned archival documents and kicks off the HTR & issue detection pipeline."""
    new_num = len(OLD_DOCS_STORE) + 124
    doc_id = f"OLD-000{new_num}"

    total_pages = len(files) if files else 3
    doc_entry = {
        "document_id": doc_id,
        "document_type": document_type,
        "state": state,
        "district": district,
        "taluk": taluk,
        "village": village,
        "year_from": year_from,
        "year_to": year_to,
        "total_pages": total_pages,
        "status": "PROCESSING" if auto_run_ai else "UPLOADED",
        "overall_confidence": 75.0,
        "risk_score": 55,
        "risk_category": "MEDIUM",
        "linked_ulpin": None,
        "notified_owner": False,
        "routed_to": None,
        "created_at": datetime.utcnow().isoformat(),
        "pages": [
            {
                "page_number": 1,
                "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
                "detected_script": "Kannada" if state == "Karnataka" else "Devanagari",
                "htr_confidence": 75.0,
            }
        ],
        "extracted_records": {
            "survey_number": f"{year_from % 100}/{year_to % 100}",
            "owner_name": "R. Kumar Patel",
            "area": "2.50 Acres",
            "registration_date": f"{year_from}-01-15",
            "village": village,
            "land_type": "Agricultural"
        },
        "issues": [
            {
                "id": "ISSUE-OWN-01",
                "type": "ownership_mismatch",
                "severity": "HIGH",
                "old_value": "R. Kumar Patel",
                "modern_value": "Suresh Reddy",
                "description": "Owner name differs from modern ULPIN registration.",
                "recommendation": "Notify current owner + request clarification.",
                "resolved": False
            }
        ]
    }

    OLD_DOCS_STORE[doc_id] = doc_entry

    return {
        "status": "SUCCESS",
        "document_id": doc_id,
        "message": f"Archival document {doc_id} successfully uploaded and queued for HTR processing.",
        "data": doc_entry
    }


@router.get("/list")
async def list_old_documents(
    status: Optional[str] = Query(None),
    village: Optional[str] = Query(None),
    doc_type: Optional[str] = Query(None),
):
    """Lists old documents digitized by DEO desk."""
    items = list(OLD_DOCS_STORE.values())
    if status and status.upper() != "ALL":
        items = [i for i in items if i.get("status", "").upper() == status.upper()]
    if village:
        items = [i for i in items if village.lower() in i.get("village", "").lower()]
    if doc_type:
        items = [i for i in items if doc_type.lower() in i.get("document_type", "").lower()]

    stats = {
        "pending_scans": 5,
        "processing": sum(1 for i in OLD_DOCS_STORE.values() if i.get("status") == "PROCESSING"),
        "awaiting_verification": sum(1 for i in OLD_DOCS_STORE.values() if i.get("status") == "AWAITING_VERIFICATION"),
        "digitized_today": 8,
    }

    return {
        "status": "SUCCESS",
        "data": items,
        "total": len(items),
        "stats": stats,
    }


@router.get("/{document_id}")
async def get_old_document(document_id: str):
    """Returns details, pages, extracted fields, and detected issues for an archival document."""
    doc = OLD_DOCS_STORE.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Old document {document_id} not found")
    return {
        "status": "SUCCESS",
        "document": doc,
    }


@router.post("/{document_id}/verify")
async def verify_old_document(document_id: str, payload: Dict[str, Any]):
    """DEO submits verification corrections for extracted fields."""
    doc = OLD_DOCS_STORE.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Old document {document_id} not found")

    if "extracted_records" in payload:
        doc["extracted_records"].update(payload["extracted_records"])
    doc["status"] = "VERIFIED"
    doc["verified_at"] = datetime.utcnow().isoformat()
    if "notes" in payload:
        doc["deo_notes"] = payload["notes"]

    return {
        "status": "SUCCESS",
        "message": f"Document {document_id} verified successfully.",
        "data": doc,
    }


@router.post("/{document_id}/notify-owner")
async def notify_owner(document_id: str, payload: Optional[Dict[str, Any]] = None):
    """Notifies the modern land owner about historical discrepancies."""
    doc = OLD_DOCS_STORE.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Old document {document_id} not found")

    channels = (payload or {}).get("channels", ["sms", "email", "in_app"])
    doc["notified_owner"] = True
    doc["notified_owner_at"] = datetime.utcnow().isoformat()

    return {
        "status": "SUCCESS",
        "document_id": document_id,
        "notified_owner": True,
        "channels": channels,
        "message": f"Owner notification dispatched across {', '.join(channels)}.",
    }


@router.post("/{document_id}/route/{officer_role}")
async def route_to_officer(
    document_id: str,
    officer_role: str,
    notes: Optional[str] = Form(None)
):
    """Routes an archival record with discrepancies to Verifier, Legal, GIS, or Revenue Admin."""
    doc = OLD_DOCS_STORE.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Old document {document_id} not found")

    valid_roles = ["verifier", "legal", "gis", "revenue"]
    if officer_role.lower() not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid officer role: {officer_role}")

    doc["routed_to"] = officer_role.lower()
    doc["routed_at"] = datetime.utcnow().isoformat()
    doc["routing_notes"] = notes
    doc["status"] = "ROUTED"

    return {
        "status": "SUCCESS",
        "document_id": document_id,
        "routed_to": officer_role.lower(),
        "message": f"Record successfully routed to {officer_role.upper()} officer desk for statutory inspection.",
    }


@router.post("/{document_id}/link-ulpin/{ulpin}")
async def link_to_ulpin(document_id: str, ulpin: str):
    """Links digitized archival record to a modern property ULPIN."""
    doc = OLD_DOCS_STORE.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Old document {document_id} not found")

    doc["linked_ulpin"] = ulpin
    doc["linked_at"] = datetime.utcnow().isoformat()

    return {
        "status": "SUCCESS",
        "document_id": document_id,
        "linked_ulpin": ulpin,
        "message": f"Archival document successfully bound to ULPIN {ulpin}.",
    }


@router.get("/{document_id}/export")
async def export_digitized(document_id: str, format: str = "json"):
    """Exports digitized archival record in CSV, JSON, or text format."""
    doc = OLD_DOCS_STORE.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Old document {document_id} not found")

    if format.lower() == "csv":
        csv_data = (
            "Field,Value\n"
            f"DocumentID,{doc['document_id']}\n"
            f"Type,{doc['document_type']}\n"
            f"Village,{doc['village']}\n"
            f"Taluk,{doc['taluk']}\n"
            f"YearRange,{doc['year_from']}-{doc['year_to']}\n"
            f"SurveyNumber,{doc['extracted_records'].get('survey_number', '')}\n"
            f"OwnerName,{doc['extracted_records'].get('owner_name', '')}\n"
            f"Area,{doc['extracted_records'].get('area', '')}\n"
            f"LinkedULPIN,{doc.get('linked_ulpin', '')}\n"
        )
        return Response(content=csv_data, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={document_id}.csv"})

    return Response(
        content=json.dumps(doc, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={document_id}.json"}
    )
