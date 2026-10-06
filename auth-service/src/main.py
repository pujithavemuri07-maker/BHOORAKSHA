from fastapi import FastAPI
from src.config import settings
from src.api.v1 import api_v1_router
from src.middleware import setup_cors, RequestLoggingMiddleware, RateLimitMiddleware

app = FastAPI(
    title="Bhooraksha Auth Service",
    description="Unified Authentication, OTP, JWT and Role-Based Access Control Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup Middlewares
setup_cors(app)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware)

# Include API Router
app.include_router(api_v1_router)

@app.get("/health", tags=["Health"])
def health_check():
    """Health check probe for container orchestrator and load balancer."""
    return {
        "status": "healthy",
        "service": "auth-service",
        "version": "1.0.0",
    }

@app.get("/metrics", tags=["Metrics"])
def get_metrics():
    """Prometheus metrics endpoint."""
    return "# HELP bhooraksha_auth_requests_total Total auth requests\n# TYPE bhooraksha_auth_requests_total counter\nbhooraksha_auth_requests_total 1\n"
