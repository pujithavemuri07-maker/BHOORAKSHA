from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from src.core.rate_limit import check_rate_limit

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        # 60 requests per minute
        if not check_rate_limit(client_ip, limit=60, window_seconds=60):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Maximum 60 requests per minute."
            )
        return await call_next(request)
