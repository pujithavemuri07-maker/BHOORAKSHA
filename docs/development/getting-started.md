# 🚀 Getting Started with Bhooraksha Development

Welcome to the Bhooraksha engineering repository. This guide walks you through local setup, Docker Compose deployment, testing, and service orchestration.

---

## 1. Prerequisites

Ensure you have installed:
- **Docker** (v24.0+) & **Docker Compose** (v2.20+)
- **Python** (3.11+)
- **Node.js** (v20+) & **pnpm** or **npm**
- **Git**

---

## 2. Quickstart with Docker Compose

To launch all 19 microservices, frontends, and backing databases:

```bash
# Clone the repository
git clone https://github.com/gov-india/bhooraksha.git
cd Bhooraksha

# Configure environment variables
cp .env.example .env

# Run automated setup script (checks ports, prepares dirs)
./infrastructure/scripts/setup.sh

# Spin up all containers in detached mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

---

## 3. Seed Sample Records

Populate PostGIS parcels, user accounts across all 7 roles, sample land applications, and audit logs:

```bash
python infrastructure/scripts/seed_data.py
```

---

## 4. Port Reference Map

| Component | Port | Description |
| :--- | :--- | :--- |
| **Nginx Reverse Proxy** | `80` | Unified Gateway routing frontend and APIs |
| **Landing Page** | `8080` | High-impact 3D Cadastral interactive landing experience |
| **Citizen Service** | `3000` | Citizen deed upload, tracking & e-certificate portal |
| **DEO Service** | `3001` | Data entry & Patwari manual fallback transcription |
| **Verifier Service** | `3002` | Field officer deed vs revenue record cross-checking |
| **Legal Service** | `3003` | Caveat, litigation & title chain analysis |
| **GIS Service** | `3004` | Cadastral SVG/PostGIS overlap resolution tool |
| **Revenue Admin Service** | `3005` | Tehsildar approvals & mutation certificate signing |
| **System Admin Service** | `3006` | Observability, model drift & audit trail manager |
| **Auth Service** | `8000` | FastAPI Auth, JWT, OTP, RBAC & user profiles |
| **AI Orchestrator** | `8001` | Multi-Agent CrewAI/LangGraph verification pipeline |
| **PostgreSQL + PostGIS** | `5432` | Spatial cadastral and relational storage |
| **Redis** | `6379` | Token caching and real-time state store |
| **RabbitMQ** | `5672` / `15672` | Message broker & management console |
| **MinIO** | `9000` / `9001` | S3-compatible land deed document store |
| **Prometheus** | `9090` | Metrics collection |
| **Grafana** | `3007` | Visual dashboards and system telemetry |

---

## 5. Running Automated Unit & Integration Tests

```bash
# Auth Service Tests
python -m pytest auth-service/tests -v

# AI Agent Orchestrator Tests
python -m pytest ai-agent-orchestrator/tests -v

# Run Platform Health Check Dry Run
python infrastructure/scripts/health_check.py --dry-run
```
