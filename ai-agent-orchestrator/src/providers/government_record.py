from datetime import datetime, timezone
from typing import Dict, Any, Optional
import os
import logging
import httpx

logger = logging.getLogger("bhooraksha.providers.government")

class GovernmentRecordProvider:
    """
    Government Land Records Adapter (Bhoomi / Dharani / MeeBhoomi / AnyRoR).
    Supports modes: DEMO, SANDBOX, LIVE.
    Explicitly tracks availability, timeouts, errors, and distinguishes UNAVAILABLE from NOT_FOUND.
    """

    def __init__(self, mode: Optional[str] = None):
        self.mode = (mode or os.getenv("GOVT_API_MODE") or ("DEMO" if os.getenv("DEMO_MODE", "true").lower() == "true" else "LIVE")).upper()
        self.base_url = os.getenv("GOVT_API_BASE_URL", "http://localhost:8000/api/v1/mock-govt")
        self.timeout = float(os.getenv("GOVT_API_TIMEOUT", "10.0"))

    async def fetch_record(
        self,
        state: str,
        district: str,
        taluk: str,
        village: str,
        survey_number: str,
        subdivision_number: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetches official land record or sandbox/demo equivalent.
        Returns:
            source, retrieved_at, response_status, request_reference, data, error_code, recommended_action
        """
        request_reference = f"GOV-REQ-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{survey_number}"
        retrieved_at = datetime.now(timezone.utc).isoformat()

        if self.mode == "DEMO":
            return self._demo_response(
                state=state,
                district=district,
                taluk=taluk,
                village=village,
                survey_number=survey_number,
                subdivision_number=subdivision_number,
                request_reference=request_reference,
                retrieved_at=retrieved_at
            )

        elif self.mode == "SANDBOX":
            return await self._sandbox_query(
                state=state,
                survey_number=survey_number,
                request_reference=request_reference,
                retrieved_at=retrieved_at
            )

        elif self.mode == "LIVE":
            return await self._live_query(
                state=state,
                survey_number=survey_number,
                request_reference=request_reference,
                retrieved_at=retrieved_at
            )

        else:
            return {
                "source": f"UNKNOWN_MODE_{self.mode}",
                "source_mode": self.mode,
                "retrieved_at": retrieved_at,
                "response_status": "UNAVAILABLE",
                "request_reference": request_reference,
                "data": None,
                "error_code": "INVALID_PROVIDER_MODE",
                "recommended_action": "MANUAL_VERIFICATION"
            }

    def _demo_response(
        self,
        state: str,
        district: str,
        taluk: str,
        village: str,
        survey_number: str,
        subdivision_number: Optional[str],
        request_reference: str,
        retrieved_at: str
    ) -> Dict[str, Any]:
        """Provides clearly labelled demo government record data."""
        full_survey = f"{survey_number}/{subdivision_number}" if subdivision_number else str(survey_number)
        portal_name = "Bhoomi (Revenue Dept, Karnataka)" if state.lower() == "karnataka" else "Dharani (Telangana)"

        return {
            "source": portal_name,
            "source_mode": "DEMO",
            "is_simulated": True,
            "retrieved_at": retrieved_at,
            "response_status": "AVAILABLE",
            "request_reference": request_reference,
            "data": {
                "khata_number": "KT-4891",
                "registered_owner": "Devendra Sharma",
                "co_owners": [],
                "survey_number": full_survey,
                "extent_acres": 2.45,
                "land_classification": "Wet Agricultural (Bagayat)",
                "tax_dues": 0.00,
                "dispute_pending": False,
                "mutation_status": "REGISTERED",
                "last_mutation_date": "2021-06-15"
            },
            "error_code": None,
            "recommended_action": "PROCEED"
        }

    async def _sandbox_query(
        self, state: str, survey_number: str, request_reference: str, retrieved_at: str
    ) -> Dict[str, Any]:
        """Simulates sandbox network call with possible latency or simulated errors."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(
                    f"{self.base_url}/record",
                    params={"state": state, "survey_number": survey_number}
                )
                if res.status_code == 200:
                    return {
                        "source": f"Sandbox Portal ({state})",
                        "source_mode": "SANDBOX",
                        "is_simulated": True,
                        "retrieved_at": retrieved_at,
                        "response_status": "AVAILABLE",
                        "request_reference": request_reference,
                        "data": res.json(),
                        "error_code": None,
                        "recommended_action": "PROCEED"
                    }
                elif res.status_code == 404:
                    return {
                        "source": f"Sandbox Portal ({state})",
                        "source_mode": "SANDBOX",
                        "is_simulated": True,
                        "retrieved_at": retrieved_at,
                        "response_status": "NOT_FOUND",
                        "request_reference": request_reference,
                        "data": None,
                        "error_code": "RECORD_NOT_FOUND_IN_SANDBOX",
                        "recommended_action": "MANUAL_VERIFICATION"
                    }
                else:
                    return {
                        "source": f"Sandbox Portal ({state})",
                        "source_mode": "SANDBOX",
                        "is_simulated": True,
                        "retrieved_at": retrieved_at,
                        "response_status": "UNAVAILABLE",
                        "request_reference": request_reference,
                        "data": None,
                        "error_code": f"HTTP_{res.status_code}",
                        "recommended_action": "RETRY"
                    }
        except httpx.TimeoutException:
            logger.warning(f"Sandbox government portal timeout for {survey_number}")
            return {
                "source": f"Sandbox Portal ({state})",
                "source_mode": "SANDBOX",
                "is_simulated": True,
                "retrieved_at": retrieved_at,
                "response_status": "TIMEOUT",
                "request_reference": request_reference,
                "data": None,
                "error_code": "API_TIMEOUT",
                "recommended_action": "RETRY"
            }
        except Exception as e:
            logger.warning(f"Sandbox government portal connection error: {e}")
            return {
                "source": f"Sandbox Portal ({state})",
                "source_mode": "SANDBOX",
                "is_simulated": True,
                "retrieved_at": retrieved_at,
                "response_status": "UNAVAILABLE",
                "request_reference": request_reference,
                "data": None,
                "error_code": "API_UNAVAILABLE",
                "recommended_action": "MANUAL_VERIFICATION"
            }

    async def _live_query(
        self, state: str, survey_number: str, request_reference: str, retrieved_at: str
    ) -> Dict[str, Any]:
        """Live government portal query with authenticated gateway."""
        # Never silently pretend DEMO is LIVE
        logger.info("Initiating LIVE government portal integration request.")
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(
                    f"{self.base_url}/live/record",
                    params={"state": state, "survey_number": survey_number}
                )
                if res.status_code == 200:
                    return {
                        "source": f"Live State Cadastre ({state})",
                        "source_mode": "LIVE",
                        "is_simulated": False,
                        "retrieved_at": retrieved_at,
                        "response_status": "AVAILABLE",
                        "request_reference": request_reference,
                        "data": res.json(),
                        "error_code": None,
                        "recommended_action": "PROCEED"
                    }
                elif res.status_code == 404:
                    return {
                        "source": f"Live State Cadastre ({state})",
                        "source_mode": "LIVE",
                        "is_simulated": False,
                        "retrieved_at": retrieved_at,
                        "response_status": "NOT_FOUND",
                        "request_reference": request_reference,
                        "data": None,
                        "error_code": "OFFICIAL_RECORD_NOT_FOUND",
                        "recommended_action": "MANUAL_VERIFICATION"
                    }
                else:
                    return {
                        "source": f"Live State Cadastre ({state})",
                        "source_mode": "LIVE",
                        "is_simulated": False,
                        "retrieved_at": retrieved_at,
                        "response_status": "UNAVAILABLE",
                        "request_reference": request_reference,
                        "data": None,
                        "error_code": f"HTTP_{res.status_code}",
                        "recommended_action": "RETRY"
                    }
        except httpx.TimeoutException:
            return {
                "source": f"Live State Cadastre ({state})",
                "source_mode": "LIVE",
                "is_simulated": False,
                "retrieved_at": retrieved_at,
                "response_status": "TIMEOUT",
                "request_reference": request_reference,
                "data": None,
                "error_code": "LIVE_API_TIMEOUT",
                "recommended_action": "RETRY"
            }
        except Exception as e:
            return {
                "source": f"Live State Cadastre ({state})",
                "source_mode": "LIVE",
                "is_simulated": False,
                "retrieved_at": retrieved_at,
                "response_status": "UNAVAILABLE",
                "request_reference": request_reference,
                "data": None,
                "error_code": "LIVE_API_UNAVAILABLE",
                "recommended_action": "MANUAL_VERIFICATION"
            }
