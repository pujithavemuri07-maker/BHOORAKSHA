import os
import sys
import json
import time
import uuid
import urllib.request
import urllib.error

ai_agent_dir = os.path.join(os.path.dirname(__file__), "ai-agent-orchestrator")
if ai_agent_dir not in sys.path:
    sys.path.insert(0, ai_agent_dir)

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

def make_request(url, method="GET", headers=None, data=None):
    if headers is None:
        headers = {}
    if "User-Agent" not in headers:
        headers["User-Agent"] = "BhoorakshaTestClient/1.0"
    if data and isinstance(data, dict):
        data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body.startswith("{") or body.startswith("[") else {"raw": body[:200]}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"error": body}
    except Exception as e:
        return 500, {"error": str(e)}

def run_tests():
    print("=" * 70)
    print("🚀 BHOORAKSHA END-TO-END DOCUMENT PROCESSING & VERIFICATION TEST")
    print("=" * 70)
    
    # 1. Health checks on API endpoints
    print("\n[Step 1] Checking Core Service Health...")
    status, auth_docs = make_request("http://localhost:8000/docs")
    print(f"  -> Auth Service API (8000): {'ONLINE' if status == 200 else 'FAILED (' + str(status) + ')'}")
    status, ai_docs = make_request("http://localhost:8001/docs")
    print(f"  -> AI Orchestrator API (8001): {'ONLINE' if status == 200 else 'FAILED (' + str(status) + ')'}")
    status, gateway = make_request("http://localhost:8080/")
    print(f"  -> Unified Gateway (8080): {'ONLINE' if status == 200 else 'FAILED (' + str(status) + ')'}")

    # 2. Test Modern Document Verification via 9-Agent Crew directly
    print("\n[Step 2] Testing 9-Agent Modern Document Processing Pipeline...")
    from src.crew import crew
    
    test_context = {
        "application_no": "REQ-2026-QA-TEST-001",
        "document_id": str(uuid.uuid4()),
        "file_name": "karnataka_sale_deed_sample.pdf",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Anekal",
        "village": "Sarjapura",
        "survey_number": "142/2A",
        "extent_acres": 2.45,
        "applicant_name": "Rajesh V. Sharma",
        "source_mode": "DEMO",
        "is_simulated": True,
    }
    
    t0 = time.time()
    crew_result = crew.process_document(test_context)
    elapsed = time.time() - t0
    
    print(f"  -> Pipeline Status: {crew_result.get('status')} (Completed in {elapsed:.3f}s)")
    res = crew_result.get("result", {})
    
    print(f"  -> Quality Assessment Score: {res.get('quality', {}).get('quality_score', 'N/A')}/100")
    print(f"  -> Language Detected: {res.get('language', {}).get('detected_language', 'N/A')} (Confidence: {res.get('language', {}).get('confidence', 'N/A')})")
    extracted_fields = res.get('extraction', {}).get('fields', [])
    print(f"  -> OCR Extracted Fields count: {len(extracted_fields)}")
    for f in extracted_fields[:3]:
        print(f"     * {f.get('field')}: '{f.get('value')}' (Confidence: {f.get('confidence')})")
    
    print(f"  -> Rule & Schedule Validation: {res.get('rule_validation', {}).get('status', 'N/A')} (Issues: {len(res.get('rule_validation', {}).get('issues', []))})")
    print(f"  -> Historical Cross-Record Verification: {res.get('historical_cross_record', {}).get('status', 'N/A')} (Match score: {res.get('historical_cross_record', {}).get('match_score', 'N/A')}%)")
    print(f"  -> GIS Spatial Validation: {res.get('gis', {}).get('status', 'N/A')} (Boundary match: {res.get('gis', {}).get('boundary_match_percentage', 'N/A')}%)")
    print(f"  -> Legal Party Evidence Review: {res.get('legal', {}).get('status', 'N/A')} (Court encumbrance flag: {res.get('legal', {}).get('has_active_litigation', False)})")
    print(f"  -> Consistency Score: {res.get('consistency', {}).get('score', 'N/A')}%")
    print(f"  -> Composite Review Priority: Level={res.get('review_priority', {}).get('priority_level', 'N/A')}, Score={res.get('review_priority', {}).get('priority_score', 'N/A')}")
    print(f"  -> Total Evidence Items Generated: {len(res.get('all_evidence', []))}")

    # 3. Test Archival Handwritten Document Pipeline (HTR + Indian Scripts)
    print("\n[Step 3] Testing Old Archival Handwritten Document Pipeline (HTR & Issue Detection)...")
    old_doc_context = {
        "application_no": "REQ-2026-ARCHIVE-002",
        "document_id": "OLD-DOC-KA-1975-098",
        "is_old_document": True,
        "script_hint": "kannada",
        "file_name": "jamabandi_register_1975.jpg",
        "modern_record": {
            "owner_name": "Suresh Ramu Reddy",
            "survey_number": "123/456-A",
            "extent_area": "2.10 Acres",
            "registration_date": "2018-05-20",
            "ulpin": "KA-2026-1002-3344"
        }
    }
    
    t1 = time.time()
    old_res_wrapper = crew.process_document(old_doc_context)
    elapsed_htr = time.time() - t1
    old_res = old_res_wrapper.get("result", {})
    
    print(f"  -> Archival Pipeline Status: {old_res.get('status')} (Completed in {elapsed_htr:.3f}s)")
    print(f"  -> Preprocessing (Deskew/Sauvola/CLAHE): {old_res.get('preprocessing', {}).get('status', 'COMPLETED')}")
    htr_data = old_res.get("htr", {})
    print(f"  -> Multilingual HTR Primary Model: {htr_data.get('primary_model')}")
    print(f"  -> Detected Script: {htr_data.get('detected_script')} (Script Purity: {htr_data.get('script_purity_score')})")
    print(f"  -> Overall Transcription Confidence: {htr_data.get('overall_confidence')}")
    print(f"  -> Extracted Handwritten Fields:")
    for f in htr_data.get("fields", []):
        review_flag = "⚠️ [Needs Review]" if f.get("needs_review") else "✅ [Confident]"
        print(f"     * {f.get('field')}: '{f.get('value')}' (Confidence: {f.get('confidence')}) {review_flag}")
    
    print(f"\n[Step 4] Cross-Data Verification & Discrepancy Detection (Archival vs Modern):")
    issues = old_res.get("issues", [])
    print(f"  -> Detected Discrepancies Count: {len(issues)}")
    for i, issue in enumerate(issues, 1):
        print(f"     [{i}] Type: {issue.get('type')} | Severity: {issue.get('severity')}")
        print(f"         Details: {issue.get('description')}")
        print(f"         Recommendation: {issue.get('recommendation')}")
        print(f"         Escalation Route: {issue.get('recommended_route')}")
    
    print(f"  -> Composite Risk Score: {old_res.get('risk_score')}/100 ({old_res.get('risk_category')})")
    print(f"  -> Recommended Routing: {old_res.get('recommended_routing')}")

    # 4. Test Application API & Corrections Workflow
    print("\n[Step 5] Testing Human Review Decision & Correction Workflow...")
    from src.database import SessionLocal
    from src.repositories.application_repository import application_repo
    from src.repositories.decision_repository import decision_repo
    from src.services.audit_service import audit_service
    
    db = SessionLocal()
    app_no = f"REQ-2026-CORR-{uuid.uuid4().hex[:6].upper()}"
    try:
        test_user_id = uuid.UUID("a0000000-0000-0000-0000-000000000001")
        # Create application
        app = application_repo.create_application(
            db=db,
            app_data={
                "application_no": app_no,
                "applicant_id": test_user_id,
                "parcel_id": f"PARCEL-2026-KA-{uuid.uuid4().hex[:6].upper()}",
                "state": "Karnataka",
                "district": "Bengaluru Urban",
                "taluk": "Anekal",
                "village": "Sarjapura",
                "survey_number": "142/2A",
                "extent_acres": 2.45,
                "status": "UNDER_HUMAN_REVIEW",
                "current_stage": "VERIFIER_STAGE",
                "metadata": {"applicant_name": "Correction Test User"},
            }
        )
        print(f"  -> Application Created in PostgreSQL: {app.application_no}")
        
        # Record initial creation in Audit Ledger
        audit_service.record_event(
            action="APPLICATION_CREATED",
            actor_id=test_user_id,
            actor_role="CITIZEN",
            application_id=app_no,
            payload={"status": "SUBMITTED", "extent": 2.45},
            db=db
        )
        
        # Simulate Girdawar / Verifier correcting extent after physical boundary inspection
        print("  -> Applying Human Officer Correction (DEO/Verifier Field Rectification)...")
        corrected_extent = 2.42
        decision = decision_repo.create_decision(
            db=db,
            decision_data={
                "application_id": app.id,
                "stage": "VERIFIER_STAGE",
                "action": "FIELD_CORRECTION",
                "decision": "CORRECTION_APPLIED",
                "role": "verifier",
                "reason": "Corrected extent from 2.45 to 2.42 acres based on physical boundary demarcation and cadastral GeoJSON fit.",
                "old_value": {"extent_acres": 2.45},
                "new_value": {"extent_acres": corrected_extent},
                "officer_id": test_user_id,
                "evidence_ids": [],
            }
        )
        
        # Update application with corrected value
        application_repo.update_application(
            db=db,
            application_no=app_no,
            update_data={"extent_acres": corrected_extent, "status": "VERIFIER_APPROVED", "current_stage": "LEGAL_REVIEW"}
        )
        
        # Record correction in cryptographic audit ledger
        audit_service.record_event(
            action="FIELD_CORRECTION_APPLIED",
            actor_id=test_user_id,
            actor_role="VERIFIER",
            application_id=app_no,
            payload={
                "decision_id": str(decision.id),
                "field": "extent_acres",
                "old_value": 2.45,
                "new_value": corrected_extent,
                "officer_notes": decision.reason
            },
            db=db
        )
        
        # Validate Cryptographic Hash Chain
        chain_verification = audit_service.verify_chain(app_no, db=db)
        print(f"  -> Audit Ledger Tamper-Proof Chain Integrity: {'VALID (PASS)' if chain_verification.get('is_valid') else 'FAILED'}")
        print(f"  -> Total Ledger Blocks Verified: {chain_verification.get('entries_verified')}")
        print(f"  -> Updated Application Extent in DB: {application_repo.get_application(db, app_no).extent_acres} Acres")
        print(f"  -> Updated Application Status: {application_repo.get_application(db, app_no).status}")
        
    finally:
        db.close()
        
    print("\n" + "=" * 70)
    print("🎯 END-TO-END DOCUMENT PROCESSING & VERIFICATION TEST COMPLETED!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
