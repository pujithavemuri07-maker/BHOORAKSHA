import pytest
import asyncio
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
)
from src.providers.quality_assessment import DemoQualityAssessmentProvider, RealQualityAssessmentProvider
from src.providers.document_extraction import DemoDocumentExtractionProvider
from src.providers.government_record import GovernmentRecordProvider
from src.providers.court_record import CourtRecordProvider
from src.crew import crew

@pytest.mark.asyncio
async def test_agent_1_quality_assessment_provider():
    """
    Agent 1: Quality Assessment Agent
    - Do NOT infer DPI or quality from file size.
    - Uses provider architecture.
    - Clearly marks simulated score as simulated.
    """
    agent = QualityAssessmentAgent()
    res = await agent.execute({"file_name": "sale_deed.pdf"})
    assert res["quality_status"] in ["PASSED", "WARNING"]
    assert res["is_acceptable"] is True
    assert "quality_score" in res
    assert "blur_metric" in res
    assert "resolution" in res
    assert res["is_simulated"] is True # When no real file is passed

    # Test Real provider doesn't infer DPI from size
    real_prov = RealQualityAssessmentProvider()
    unmeasured_res = await real_prov.assess(file_path=None, context={})
    assert unmeasured_res["measured"] is False
    assert unmeasured_res["status"] == "UNMEASURED"


@pytest.mark.asyncio
async def test_agent_2_language_detection():
    """Agent 2: Language Detection Agent."""
    agent = LanguageDetectionAgent()
    res = await agent.execute({"state": "Karnataka"})
    assert res["primary_language"] == "kn"
    assert res["language_name"] == "Kannada"
    assert res["is_multilingual"] is True


@pytest.mark.asyncio
async def test_agent_3_document_extraction_with_evidence():
    """
    Agent 3: Document Extraction Agent
    - Every extracted field includes field-level evidence (bbox, page, text, confidence, source).
    - Uses DocumentExtractionProvider.
    - Never claims pretrained model when demo provider is used.
    """
    agent = DocumentExtractionAgent(provider_type="DEMO")
    res = await agent.execute({"survey_number": "142", "extent_acres": 2.45})
    assert res["is_simulated"] is True
    assert res["source_mode"] == "DEMO"

    fields = res["fields"]
    assert len(fields) > 0

    # Verify field-level evidence structure
    survey_field = next(f for f in fields if f["field"] == "survey_number")
    assert survey_field["value"] == "142/2A"
    assert survey_field["source"] == "DEMO_OCR"
    assert "evidence" in survey_field
    assert "bbox" in survey_field["evidence"]
    assert "page" in survey_field["evidence"]
    assert "text" in survey_field["evidence"]
    assert survey_field["confidence"] > 0.9


@pytest.mark.asyncio
async def test_agent_4_rule_validation():
    """Agent 4: Rule Validation Agent."""
    agent = RuleValidationAgent()
    res = await agent.execute({"extent_acres": 2.45, "survey_number": "142"})
    assert res["is_mathematically_consistent"] is True
    assert res["extent_sqm"] > 0
    assert len(res["validation_flags"]) == 0

    # Negative test: invalid extent
    bad_res = await agent.execute({"extent_acres": -5.0, "survey_number": "142"})
    assert bad_res["is_mathematically_consistent"] is False
    assert "INVALID_EXTENT_RANGE" in bad_res["validation_flags"]


@pytest.mark.asyncio
async def test_agent_5_historical_and_government_provider():
    """
    Agent 5: Historical & Cross-Record Validation Agent
    - Uses GovernmentRecordProvider.
    - Differentiates UNAVAILABLE from NOT_FOUND.
    """
    agent = HistoricalCrossRecordValidationAgent()
    res = await agent.execute({
        "state": "Karnataka",
        "survey_number": "142",
        "extent_acres": 2.45
    })
    assert res["lineage_verified"] is True
    assert res["extent_verified"] is True
    assert "government_adapter_result" in res

    # Test GovernmentRecordProvider statuses
    gov_provider = GovernmentRecordProvider(mode="DEMO")
    demo_rec = await gov_provider.fetch_record(
        state="Karnataka", district="Bengaluru", taluk="Anekal", village="Sarjapura", survey_number="142"
    )
    assert demo_rec["response_status"] == "AVAILABLE"
    assert demo_rec["source_mode"] == "DEMO"


@pytest.mark.asyncio
async def test_government_provider_unavailable_vs_not_found():
    """
    Acceptance Criteria 4 & 5:
    - API failure is DIFFERENT from record not found.
    - UNAVAILABLE routes to RETRY -> MANUAL_VERIFICATION.
    """
    gov_provider = GovernmentRecordProvider(mode="SANDBOX")
    # Query with invalid base URL to trigger UNAVAILABLE
    gov_provider.base_url = "http://127.0.0.1:59999/nonexistent"
    gov_provider.timeout = 0.5
    res = await gov_provider.fetch_record(
        state="Karnataka", district="Bengaluru", taluk="Anekal", village="Sarjapura", survey_number="9999"
    )
    assert res["response_status"] in ["UNAVAILABLE", "TIMEOUT"]
    assert res["response_status"] != "NOT_FOUND"
    assert res["recommended_action"] in ["RETRY", "MANUAL_VERIFICATION"]


@pytest.mark.asyncio
async def test_agent_6_gis_spatial_validation():
    """
    Agent 6: GIS / Spatial Validation Agent
    - Uses Shapely when available.
    - Wording: 'Potential Spatial Overlap' / 'Spatial Review Required'.
    - Does NOT label overlap as illegal or encroachment.
    - Centroid is NOT labelled ULPIN.
    """
    agent = GISSpatialValidationAgent()
    res = await agent.execute({"survey_number": "88", "extent_acres": 1.8})
    assert res["has_overlap"] is True
    assert res["spatial_review_required"] is True

    # Check non-judgmental wording in findings
    for finding in res["findings"]:
        assert "illegal" not in finding.get("message", "").lower()
        assert "encroachment" not in finding.get("message", "").lower()

    # Check centroid is not ULPIN
    assert res["centroid_purpose"] == "SPATIAL_INDEXING_ONLY_NOT_ULPIN"


@pytest.mark.asyncio
async def test_agent_7_legal_party_evidence_review():
    """
    Agent 7: Legal & Party Evidence Review Agent
    - Must NOT produce 'is_title_marketable = true' or 'ownership legally valid'.
    - Uses CourtRecordProvider with 'Court record reference' wording.
    """
    agent = LegalPartyEvidenceReviewAgent()
    res = await agent.execute({"survey_number": "88", "has_poa": True})
    assert res["legal_review_required"] is True
    assert len(res["evidence_findings"]) > 0

    # Critical requirement: No ownership or marketable title claims
    assert "is_title_marketable" not in res
    assert "ownership_valid" not in res

    # Verify CourtRecordProvider wording
    court_prov = CourtRecordProvider(mode="DEMO")
    court_res = await court_prov.search_references(
        state="Karnataka", district="Bengaluru", survey_number="88"
    )
    assert court_res["has_court_references"] is True
    ref = court_res["court_references"][0]
    assert ref["reference_type"] == "Court record reference"
    assert "disclaimer" in ref


@pytest.mark.asyncio
async def test_agent_8_duplicate_consistency():
    """Agent 8: Duplicate & Consistency Agent."""
    agent = DuplicateConsistencyAgent()
    clean_res = await agent.execute({
        "survey_number": "142",
        "applicant_name": "Rajesh Sharma",
        "claimed_owner": "Rajesh Sharma",
        "is_duplicate_submission": False
    })
    assert clean_res["is_consistent"] is True
    assert clean_res["has_duplicate_alert"] is False

    dup_res = await agent.execute({
        "survey_number": "142",
        "applicant_name": "Rajesh Sharma",
        "claimed_owner": "Rajesh Sharma",
        "is_duplicate_submission": True
    })
    assert dup_res["has_duplicate_alert"] is True
    assert dup_res["recommended_action"] == "OFFICER_REVIEW"


@pytest.mark.asyncio
async def test_agent_9_review_priority_routing():
    """
    Agent 9: Review Priority & Routing Agent
    - 0-100 score: Low (0-29), Medium (30-69), High (70-100).
    - AI NEVER auto-approves (auto_approvable removed).
    """
    agent = ReviewPriorityRoutingAgent()

    # Low priority
    low_res = await agent.execute({
        "has_legal_flags": False,
        "has_overlap": False,
        "quality_score": 95.0
    })
    assert low_res["review_priority_level"] == "LOW"
    assert 0 <= low_res["review_priority_score"] <= 29
    assert "auto_approvable" not in low_res # Explicitly removed!

    # High priority
    high_res = await agent.execute({
        "has_legal_flags": True,
        "has_overlap": True,
        "quality_status": "WARNING",
        "quality_score": 60.0
    })
    assert high_res["review_priority_level"] in ["MEDIUM", "HIGH"]
    assert high_res["review_priority_score"] >= 70 or high_res["review_priority_score"] >= 50
    assert "auto_approvable" not in high_res


@pytest.mark.asyncio
async def test_full_9_agent_crew_pipeline():
    """Test full 9-agent verification pipeline execution."""
    context = {
        "application_no": "REQ-2026-TEST01",
        "village": "Sarjapura",
        "survey_number": "142",
        "subdivision_number": "2A",
        "extent_acres": 2.45,
    }
    result = await crew.run_pipeline(context)
    assert result["status"] == "PROCESSED"
    assert result["agents_count"] == 9
    assert "quality" in result
    assert "language" in result
    assert "extraction" in result
    assert "rule_validation" in result
    assert "historical_cross_record" in result
    assert "gis" in result
    assert "legal" in result
    assert "consistency" in result
    assert "review_priority" in result
    assert "all_evidence" in result
