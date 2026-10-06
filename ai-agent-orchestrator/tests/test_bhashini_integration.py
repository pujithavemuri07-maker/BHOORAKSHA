import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from shared.bhashini.config import BhashiniConfig
from shared.bhashini.client import BhashiniClient
from shared.bhashini.service import BhashiniService
from src.agents.language import LanguageDetectionAgent

@pytest.mark.asyncio
async def test_bhashini_disabled_by_default():
    """Verify that by default, Bhashini is disabled and returns None without network calls."""
    config = BhashiniConfig(use_bhashini=False, api_key="")
    assert not config.is_configured
    
    client = BhashiniClient(config)
    res = await client.translate("ನೋಂದಾಯಿತ ಮಾರಾಟ ಪತ್ರ", source_lang="kn", target_lang="en")
    assert res is None

@pytest.mark.asyncio
async def test_language_agent_default_behavior():
    """Verify that LanguageDetectionAgent works 100% identically with default settings."""
    agent = LanguageDetectionAgent()
    context = {"state": "Karnataka"}
    result = await agent.process(context)
    
    assert result["primary_language"] == "kn"
    assert result["language_name"] == "Kannada"
    assert result["translated_title"] == "Registered Sale Deed for Land Parcel"

@pytest.mark.asyncio
async def test_bhashini_enabled_with_mock_success():
    """Verify that when Bhashini is enabled, translation correctly uses API output."""
    config = BhashiniConfig(
        use_bhashini=True,
        api_key="mock-test-key",
        user_id="mock-user-id"
    )
    assert config.is_configured

    mock_response = {
        "pipelineResponse": [
            {
                "taskType": "translation",
                "output": [{"target": "Registered Sale Deed of Agricultural Land"}]
            }
        ]
    }

    client = BhashiniClient(config)
    with patch.object(client, "_send_request", new_callable=AsyncMock) as mock_send:
        mock_send.return_value = mock_response
        service = BhashiniService(config)
        service.client = client

        translated = await service.translate_indic_to_english("ಖರೀದಿ ಪತ್ರ", source_lang="kn")
        assert translated == "Registered Sale Deed of Agricultural Land"

@pytest.mark.asyncio
async def test_bhashini_graceful_fallback_on_network_failure():
    """Verify that when Bhashini encounters an error/timeout, it seamlessly falls back to None."""
    config = BhashiniConfig(
        use_bhashini=True,
        api_key="mock-key",
        user_id="mock-user"
    )
    client = BhashiniClient(config)
    with patch.object(client, "_send_request", new_callable=AsyncMock) as mock_send:
        mock_send.side_effect = Exception("Simulated network timeout / 503")
        service = BhashiniService(config)
        service.client = client

        # Service should catch exception and return None
        res = await service.translate_indic_to_english("ಖರೀದಿ ಪತ್ರ", source_lang="kn")
        assert res is None

@pytest.mark.asyncio
async def test_language_agent_with_bhashini_fallback():
    """Verify that LanguageDetectionAgent falls back to default title if Bhashini call fails."""
    agent = LanguageDetectionAgent()
    context = {
        "state": "Karnataka",
        "document_title": "ಖರೀದಿ ಪತ್ರ"
    }

    with patch("shared.bhashini.bhashini_service.translate_indic_to_english", new_callable=AsyncMock) as mock_trans:
        mock_trans.side_effect = Exception("Connection refused")
        result = await agent.process(context)
        assert result["translated_title"] == "Registered Sale Deed for Land Parcel"
