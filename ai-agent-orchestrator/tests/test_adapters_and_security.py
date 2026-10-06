import pytest
from unittest.mock import patch, AsyncMock
import httpx
from src.providers.government_record import GovernmentRecordProvider
from src.providers.court_record import CourtRecordProvider
from src.agents.cross_verify import HistoricalCrossRecordValidationAgent

@pytest.mark.asyncio
async def test_government_provider_demo_mode():
    """Verify demo mode returns simulated response clearly identifying source_mode=DEMO."""
    provider = GovernmentRecordProvider(mode="DEMO")
    res = await provider.fetch_record(
        state="Karnataka",
        district="Bengaluru Urban",
        taluk="Anekal",
        village="Sarjapura",
        survey_number="142"
    )
    assert res["source_mode"] == "DEMO"
    assert res["is_simulated"] is True
    assert res["response_status"] == "AVAILABLE"
    assert res["data"] is not None
    assert res["data"]["extent_acres"] == 2.45


@pytest.mark.asyncio
async def test_government_provider_sandbox_not_found():
    """Verify 404 from government API returns response_status=NOT_FOUND (not treated as unavailable)."""
    provider = GovernmentRecordProvider(mode="SANDBOX")
    
    mock_response = AsyncMock()
    mock_response.status_code = 404
    mock_response.json.return_value = {}

    with patch("httpx.AsyncClient.get", return_value=mock_response):
        res = await provider.fetch_record(
            state="Karnataka",
            district="Bengaluru Urban",
            taluk="Anekal",
            village="Sarjapura",
            survey_number="999"
        )
        assert res["response_status"] == "NOT_FOUND"
        assert res["error_code"] == "RECORD_NOT_FOUND_IN_SANDBOX"
        assert res["data"] is None


@pytest.mark.asyncio
async def test_government_provider_sandbox_unavailable():
    """Verify connection error returns response_status=UNAVAILABLE (distinct from NOT_FOUND)."""
    provider = GovernmentRecordProvider(mode="SANDBOX")
    
    with patch("httpx.AsyncClient.get", side_effect=httpx.ConnectError("Connection refused")):
        res = await provider.fetch_record(
            state="Karnataka",
            district="Bengaluru Urban",
            taluk="Anekal",
            village="Sarjapura",
            survey_number="142"
        )
        assert res["response_status"] == "UNAVAILABLE"
        assert res["error_code"] == "API_UNAVAILABLE"
        assert res["recommended_action"] == "MANUAL_VERIFICATION"


@pytest.mark.asyncio
async def test_government_provider_sandbox_timeout():
    """Verify timeout returns response_status=TIMEOUT (distinct from NOT_FOUND and UNAVAILABLE)."""
    provider = GovernmentRecordProvider(mode="SANDBOX")
    
    with patch("httpx.AsyncClient.get", side_effect=httpx.TimeoutException("Read timed out")):
        res = await provider.fetch_record(
            state="Karnataka",
            district="Bengaluru Urban",
            taluk="Anekal",
            village="Sarjapura",
            survey_number="142"
        )
        assert res["response_status"] == "TIMEOUT"
        assert res["error_code"] == "API_TIMEOUT"
        assert res["recommended_action"] == "RETRY"


@pytest.mark.asyncio
async def test_court_record_provider_modes():
    """Verify Court Record Reference Provider modes and wording."""
    # DEMO mode
    demo_provider = CourtRecordProvider(mode="DEMO")
    demo_res = await demo_provider.search_references("Karnataka", "Bengaluru Urban", "88")
    assert demo_res["source_mode"] == "DEMO"
    assert demo_res["is_simulated"] is True
    assert demo_res["has_court_references"] is True
    assert "Court record reference" in demo_res["court_references"][0]["reference_type"]

    # SANDBOX mode
    sandbox_provider = CourtRecordProvider(mode="SANDBOX")
    sandbox_res = await sandbox_provider.search_references("Karnataka", "Bengaluru Urban", "88")
    assert sandbox_res["source_mode"] == "SANDBOX"
    assert sandbox_res["is_simulated"] is True
    assert sandbox_res["has_court_references"] is False

    # AUTHORIZED_LIVE mode
    live_provider = CourtRecordProvider(mode="AUTHORIZED_LIVE")
    live_res = await live_provider.search_references("Karnataka", "Bengaluru Urban", "88")
    assert live_res["source_mode"] == "AUTHORIZED_LIVE"
    assert live_res["is_simulated"] is False


@pytest.mark.asyncio
async def test_agent_cross_verify_handles_adapter_responses():
    """Verify HistoricalCrossRecordValidationAgent handles NOT_FOUND and TIMEOUT appropriately."""
    agent = HistoricalCrossRecordValidationAgent()

    # 1. NOT_FOUND scenario
    not_found_result = {
        "source": "State Cadastre",
        "source_mode": "SANDBOX",
        "response_status": "NOT_FOUND",
        "request_reference": "REF-001",
        "data": None,
    }
    with patch.object(agent.govt_provider, "fetch_record", return_value=not_found_result):
        res = await agent.process({"survey_number": "999", "extent_acres": 2.45})
        assert "OFFICIAL_RECORD_NOT_FOUND" in res["discrepancies"]
        assert res["is_verified"] is False

    # 2. TIMEOUT scenario
    timeout_result = {
        "source": "State Cadastre",
        "source_mode": "SANDBOX",
        "response_status": "TIMEOUT",
        "request_reference": "REF-002",
        "data": None,
    }
    with patch.object(agent.govt_provider, "fetch_record", return_value=timeout_result):
        res = await agent.process({"survey_number": "999", "extent_acres": 2.45})
        assert "GOVERNMENT_API_TIMEOUT" in res["discrepancies"]
        assert res["is_verified"] is False
