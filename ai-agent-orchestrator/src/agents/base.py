import time
import logging
from typing import Dict, Any

logger = logging.getLogger("bhooraksha.ai.agent")

class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"[{self.name}] Starting execution for application {context.get('application_no')}")
        try:
            result = await self.process(context)
            duration_ms = (time.time() - start_time) * 1000
            logger.info(f"[{self.name}] Completed successfully in {duration_ms:.2f}ms")
            result["_meta"] = {
                "agent": self.name,
                "role": self.role,
                "duration_ms": duration_ms,
                "status": "SUCCESS",
            }
            return result
        except Exception as e:
            logger.error(f"[{self.name}] Execution failed: {e}", exc_info=True)
            return {
                "_meta": {
                    "agent": self.name,
                    "role": self.role,
                    "status": "FAILED",
                    "error": str(e),
                }
            }

    async def process(self, context: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError("Subclasses must implement process()")
