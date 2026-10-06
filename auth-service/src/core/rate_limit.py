import time
from typing import Dict, Tuple

# In-memory token bucket fallback when Redis is offline or in test mode
_rate_limits: Dict[str, Tuple[int, float]] = {}

def check_rate_limit(key: str, limit: int = 60, window_seconds: int = 60) -> bool:
    """
    Checks if a key (IP or user ID) has exceeded the allowable requests within window_seconds.
    Returns True if permitted, False if rate limited.
    """
    now = time.time()
    if key not in _rate_limits:
        _rate_limits[key] = (1, now)
        return True

    count, start_time = _rate_limits[key]
    if now - start_time > window_seconds:
        _rate_limits[key] = (1, now)
        return True

    if count >= limit:
        return False

    _rate_limits[key] = (count + 1, start_time)
    return True
