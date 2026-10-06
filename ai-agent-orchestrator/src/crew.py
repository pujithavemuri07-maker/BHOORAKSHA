import asyncio
import uuid
from typing import Dict, Any, List
from src.agents import (
    QualityAssessmentAgent,
    LanguageDetectionAgent,
    DocumentExtractionAgent,
    RuleValidationAgent,
    HistoricalCrossRecordValidationAgent,
    GISSpatialValidationAgent,
    LegalPartyEvidenceReviewAgent,
    DuplicateConsistencyAgent,
    ReviewPriorityRoutingAgent,
    OldDocPreprocessor,
    HTRRecognizer,
    IssueDetector,
    OwnerNotifier,
)

class VerificationCrew:
    """
    Unified 9-Agent Logical Verification Orchestrator for Bhooraksha.
    Coordinates sequential & parallel execution of the 9 logical verification agents:
      1. Quality Assessment Agent
      2. Language Detection Agent
      3. Document Extraction Agent
      4. Rule Validation Agent
      5. Historical & Cross-Record Validation Agent
      6. GIS / Spatial Validation Agent
      7. Legal & Party Evidence Review Agent
      8. Duplicate & Consistency Agent
      9. Review Priority & Routing Agent
    """
    def __init__(self):
        self.quality_agent = QualityAssessmentAgent()
        self.language_agent = LanguageDetectionAgent()
        self.extraction_agent = DocumentExtractionAgent()
        self.rule_validation_agent = RuleValidationAgent()
        self.historical_agent = HistoricalCrossRecordValidationAgent()
        self.gis_agent = GISSpatialValidationAgent()
        self.legal_agent = LegalPartyEvidenceReviewAgent()
        self.consistency_agent = DuplicateConsistencyAgent()
        self.review_priority_agent = ReviewPriorityRoutingAgent()
        # Old Document Digitization Specialized Agents
        self.old_doc_preprocessor = OldDocPreprocessor()
        self.htr_agent = HTRRecognizer()
        self.issue_detector = IssueDetector()
        self.owner_notifier = OwnerNotifier()

    async def run_pipeline(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the 9 logical verification agents:
        Step 1: Document Quality Assessment
        Step 2: Parallel Perception (Language Detection + Document Extraction)
        Step 3: Rule & Mathematical Schedule Validation
        Step 4: Parallel Deep Verification (Historical/Govt Cross-Record, GIS Boundary, Legal Review, Consistency)
        Step 5: Composite Review Priority & Human Routing
        """
        app_no = context.get("application_no")
        doc_id = context.get("document_id")
        source_mode = context.get("source_mode", "DEMO")
        is_simulated = context.get("is_simulated", True)

        # Step 1: Quality Assessment
        quality_res = await self.quality_agent.execute(context)
        context.update(quality_res)

        # Step 2: Language Detection & Document Extraction
        lang_res, extract_res = await asyncio.gather(
            self.language_agent.execute(context),
            self.extraction_agent.execute(context),
        )
        context["language_data"] = lang_res
        context["extraction_data"] = extract_res
        context["ocr_data"] = extract_res # Backward compatibility

        # Step 3: Rule Validation
        rule_res = await self.rule_validation_agent.execute(context)
        context["validation_data"] = rule_res

        # Step 4: Parallel Deep Verification
        hist_res, gis_res, legal_res, const_res = await asyncio.gather(
            self.historical_agent.execute(context),
            self.gis_agent.execute(context),
            self.legal_agent.execute(context),
            self.consistency_agent.execute(context),
        )
        context["historical_data"] = hist_res
        context["gis_data"] = gis_res
        context["legal_data"] = legal_res
        context["consistency_data"] = const_res

        context.update(gis_res)
        context.update(legal_res)
        context.update(const_res)

        # Step 5: Review Priority & Routing
        priority_res = await self.review_priority_agent.execute(context)

        # Consolidate evidence findings with first-class evidence schema
        all_evidence: List[Dict[str, Any]] = []

        # 1. OCR Extraction Evidence
        for field in extract_res.get("fields", []):
            evidence_details = field.get("evidence", {}) or {}
            bbox = evidence_details.get("bounding_box") if isinstance(evidence_details, dict) else None
            page = evidence_details.get("page", 1) if isinstance(evidence_details, dict) else 1
            all_evidence.append({
                "evidence_id": str(uuid.uuid4()),
                "application_id": app_no,
                "document_id": doc_id,
                "source_type": "OCR",
                "source_reference": context.get("file_name", "document.pdf"),
                "page": page,
                "region_bbox": bbox,
                "extracted_value": field.get("value"),
                "expected_value": None,
                "confidence": field.get("confidence", 0.95),
                "finding_type": f"EXTRACTED_{field.get('field', '').upper()}",
                "severity": "INFO",
                "source_mode": source_mode,
                "is_simulated": is_simulated,
            })

        # 2. GIS Spatial Validation Evidence
        for f in gis_res.get("findings", []):
            all_evidence.append({
                "evidence_id": str(uuid.uuid4()),
                "application_id": app_no,
                "document_id": doc_id,
                "source_type": "GIS",
                "source_reference": f.get("source", "State Cadastral Shapefile Repository"),
                "page": None,
                "region_bbox": None,
                "extracted_value": f.get("overlap_percentage") or f.get("claimed_extent"),
                "expected_value": f.get("cadastral_extent"),
                "confidence": f.get("confidence", 0.98),
                "finding_type": f.get("finding_type", "GIS_SPATIAL_ANALYSIS"),
                "severity": f.get("severity", "MEDIUM"),
                "source_mode": source_mode,
                "is_simulated": is_simulated,
                "details": f,
            })

        # 3. Legal & Court Reference Evidence
        for f in legal_res.get("evidence_findings", []):
            all_evidence.append({
                "evidence_id": str(uuid.uuid4()),
                "application_id": app_no,
                "document_id": doc_id,
                "source_type": "COURT_REFERENCE" if f.get("finding_type") == "COURT_RECORD_REFERENCE" else "LEGAL_REVIEW",
                "source_reference": f.get("case_number") or f.get("source", "Court Record Reference Provider"),
                "page": None,
                "region_bbox": None,
                "extracted_value": f.get("case_number") or f.get("message"),
                "expected_value": None,
                "confidence": 0.90,
                "finding_type": f.get("finding_type", "LEGAL_EVIDENCE"),
                "severity": f.get("severity", "HIGH"),
                "source_mode": source_mode,
                "is_simulated": is_simulated,
                "details": f,
            })

        # 4. Government Cross-Record Evidence
        for f in hist_res.get("evidence_items", []):
            all_evidence.append({
                "evidence_id": str(uuid.uuid4()),
                "application_id": app_no,
                "document_id": doc_id,
                "source_type": "GOVERNMENT_RECORD",
                "source_reference": f.get("request_ref") or f.get("source", "State Land Record Portal"),
                "page": None,
                "region_bbox": None,
                "extracted_value": f.get("claimed"),
                "expected_value": f.get("official"),
                "confidence": 0.95,
                "finding_type": f.get("finding_type", "GOVERNMENT_RECORD_EVIDENCE"),
                "severity": f.get("severity", "MEDIUM"),
                "source_mode": source_mode,
                "is_simulated": is_simulated,
                "details": f,
            })

        return {
            "status": "PROCESSED",
            "agents_count": 9,
            "quality": quality_res,
            "language": lang_res,
            "extraction": extract_res,
            "ocr": extract_res, # Backward compatibility
            "rule_validation": rule_res,
            "historical_cross_record": hist_res,
            "gis": gis_res,
            "legal": legal_res,
            "consistency": const_res,
            "review_priority": priority_res,
            "risk_evaluation": priority_res, # Backward compatibility
            "all_evidence": all_evidence,
        }

    async def run_old_document_pipeline(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the extended archival verification pipeline for old handwritten documents:
        1. Preprocessing (deskew, Sauvola binarization, CLAHE)
        2. Quality Assessment
        3. Multilingual HTR (Handwritten Text Recognition)
        4. Cross-Verification & Issue Detection (Old vs Modern Record)
        5. Owner Notification (if high severity discrepancies found)
        """
        image_path = context.get("file_path") or context.get("image_path") or "sample_register.jpg"
        script_hint = context.get("script_hint") or context.get("language", "kannada")

        # 1. Preprocess
        preproc_res = self.old_doc_preprocessor.run(image_path)
        prep_path = preproc_res.get("preprocessed_path", image_path)

        # 2. Quality
        quality_res = await self.quality_agent.execute(context)

        # 3. Multilingual HTR
        htr_res = self.htr_agent.run(prep_path, script_hint=script_hint)

        # Build old_data representation from extracted fields
        old_data = {f['field']: f['value'] for f in htr_res.get('fields', [])}
        modern_data = context.get("modern_record") or {
            "owner_name": "Suresh Reddy",
            "survey_number": "123/456",
            "extent_area": "2.48 Acres",
            "registration_date": "2018-05-20",
            "ulpin": context.get("linked_ulpin") or "KA-1234-5678-9012"
        }

        # 4. Issue Detection & Risk Scoring
        issue_res = self.issue_detector.run(old_data, modern_data)

        # 5. Owner Notification check
        notif_res = None
        if issue_res.get("high_severity_count", 0) > 0 and context.get("auto_notify_owner", False):
            notif_res = await self.owner_notifier.run(
                document_id=context.get("document_id", "OLD-000123"),
                issues=issue_res.get("issues", []),
                ulpin=modern_data.get("ulpin", "KA-1234-5678-9012"),
                owner_name=modern_data.get("owner_name", "Suresh Reddy")
            )

        return {
            "status": "PROCESSED",
            "document_type": "OLD_HANDWRITTEN_DOCUMENT",
            "preprocessing": preproc_res,
            "quality": quality_res,
            "htr": htr_res,
            "extracted_data": old_data,
            "modern_data": modern_data,
            "issues": issue_res.get("issues", []),
            "risk_score": issue_res.get("risk_score", 68),
            "risk_category": issue_res.get("risk_category", "MEDIUM"),
            "recommended_routing": issue_res.get("recommended_routing", "verifier"),
            "owner_notification": notif_res,
        }


class BhoorakshaCrew(VerificationCrew):
    """Unified Bhooraksha AI Multi-Agent Orchestrator."""
    def process_document(self, document_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process document through either modern 9-agent pipeline or extended archival HTR pipeline."""
        loop = asyncio.new_event_loop()
        try:
            asyncio.set_event_loop(loop)
            is_old = document_data.get("is_old_document", False) or document_data.get("document_category") == "OLD_ARCHIVE"
            if is_old:
                result = loop.run_until_complete(self.run_old_document_pipeline(document_data))
            else:
                result = loop.run_until_complete(self.run_pipeline(document_data))

            return {
                "status": "COMPLETED",
                "result": result
            }
        finally:
            loop.close()

crew = BhoorakshaCrew()
verification_crew = crew
