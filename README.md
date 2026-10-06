<div align="center">

# 🏛️ BHOORAKSHA (भूरक्षा) – Next-Gen Land Protection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_+_PostGIS_3.4-336791.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.2-DC382D.svg?logo=redis&logoColor=white)](https://redis.io/)
[![MinIO](https://img.shields.io/badge/MinIO-S3_Storage-C72C48.svg?logo=minio&logoColor=white)](https://min.io/)

**Enterprise AI-Powered Land Record Verification & Mutation Directorate**  
*Statewide End-to-End Land Governance Platform Engineered for Citizens, Patwaris, Girdawars, Legal Advisors, GIS Surveyors, Tehsildars, and District Collectors (CCLA).*

![Landing Hero](docs/screenshots/landing_page_3000.png)

[Features](#-executive-summary) • [Architecture](#-system-architecture) • [AI Pipeline](#-ai-agent-verification-pipeline) • [Visual Walkthrough](#-visual-walkthrough--portal-screenshots) • [Quick Start](#-quick-start)

</div>

---

## 📌 Executive Summary

**Bhooraksha (भूरक्षा)** modernizes the government land administration lifecycle by eliminating document forgery, fraudulent dual-registrations, cadastral boundary overlap, and multi-year mutation delays. 

Integrating **10 specialized AI models** (including Chitrapathak Multimodal OCR, MuRIL Indic Named-Entity Recognition, LexBhoomi Statutory Rule Engine, and BhooNaksha Cadastral Georeferencing) with **8 role-specific micro-frontends**, Bhooraksha enables **tamper-proof, cryptographically verifiable, and auditable land deed verification in minutes instead of months**.

### 🌟 Core Innovations
- **🏛️ 8 Role-Specific Micro-Frontends**: Designed strictly around statutory revenue hierarchy (*Landing -> Citizen -> DEO/Patwari -> Verifier/Girdawar -> Legal Advisor -> GIS Surveyor -> Revenue Admin/Tehsildar -> CCLA System Administrator*).
- **🌐 18 Official Indic Languages**: Native localized user interfaces across 18 Indian languages (including Konkani, Kashmiri, Maithili, Nepali, and Sanskrit) with dynamic real-time switching powered by `@shared/i18n`.
- **⚡ Multi-Agent Neural Pipeline**: Asynchronous AI workers verifying document quality, extracting bilingual entity fields, validating 30-year title deeds against court caveats, and matching spatial polygon geometries.
- **🔒 Cryptographic Section-40 Audit Trail**: Immutable append-only ledger with SHA-256 block digests recording all officer transitions, remarks, and mutation dispatches.
- **🗺️ Interactive Cadastral GIS Engine**: Real-time vector parcel boundary mapping, ULPIN centroid calculation, and millimeter-level polygon overlap detection.

---

## 📸 Visual Walkthrough & Portal Screenshots

Explore the fully localized and responsive UI/UX built for each role within the land administration hierarchy.

### 1. 🌍 Public Landing Page (`:8080`)
*Interactive 3D Cadastral terrain canvas, live statistics counter, platform roadmap, and role launchpad.*

| 3D Cadastral Hero View | Features & Architecture Grid |
| :---: | :---: |
| ![Landing Hero](docs/screenshots/landing_page_3000.png) | ![Landing Features](docs/screenshots/landing_page_features.png) |

---

### 2. 👥 Citizen Self-Service Portal (`:3000`)
*Public land record portal for document submission, quality feedback, 7-step verification tracking, GIS parcel viewer, and bank title sharing.*

| Citizen Dashboard & Timeline | Deed Upload & AI Quality Analyzer |
| :---: | :---: |
| ![Citizen Dashboard](docs/screenshots/citizen_apps_screenshot.png) | ![Citizen Upload](docs/screenshots/citizen_upload_screenshot.png) |
| **Interactive Cadastral Parcel Map** | **Official Verified Title Passbook** |
| ![Citizen GIS Map](docs/screenshots/citizen_portal_screenshot.png) | ![Citizen Passbook](docs/screenshots/citizen_detail_screenshot.png) |
| **Profile & Settings** | **Help & Grievances (Telugu)** |
| ![Citizen Profile](docs/screenshots/citizen_profile_screenshot.png) | ![Citizen Help (TE)](docs/screenshots/citizen_help_te_verified.png) |

---

### 3. 📝 Data Entry Operator (DEO) / Patwari Portal (`:3001`)
*Patwari maker interface with split-view comparison between deed scan and AI OCR extraction, transcription correction, and KYC validation.*

| DEO Dashboard Analytics | Application Review Queue |
| :---: | :---: |
| ![DEO Dashboard](docs/screenshots/deo_dashboard.png) | ![DEO Queue](docs/screenshots/deo_queue.png) |
| **Split-Screen AI OCR Validation** | **Manual Entry / Correction Override** |
| ![DEO Split Screen](docs/screenshots/deo_split_screen.png) | ![DEO Manual Entry](docs/screenshots/deo_manual_entry.png) |
| **Mutation History** | **Role Specific Help** |
| ![DEO History](docs/screenshots/deo_history.png) | ![DEO Help](docs/screenshots/deo_help.png) |

---

### 4. ✔️ Verifier / Girdawar Portal (`:3002`)
*Girdawar / Naib-Tehsildar checker interface with side-by-side revenue ledger cross-verification (Pahani vs. 1-B Record) and field inspection upload.*

| Verifier Dashboard | Cross-Verification Review Queue |
| :---: | :---: |
| ![Verifier Dashboard](docs/screenshots/verifier_dashboard.png) | ![Verifier Queue](docs/screenshots/verifier_queue.png) |
| **Dual-Column Revenue Cross-Audit** | **Application Review Details** |
| ![Verifier Cross Verification](docs/screenshots/verifier_cross_verification.png) | ![Verifier Review](docs/screenshots/verifier_application_review.png) |
| **History & Audit Trail** | **Verifier Profile** |
| ![Verifier History](docs/screenshots/verifier_history.png) | ![Verifier Profile](docs/screenshots/verifier_profile.png) |

---

### 5. ⚖️ Legal Review Portal (`:3003`)
*Specialist legal scrutiny suite with automated 30-year non-encumbrance validation, litigation caveat searches, and statutory opinion recording.*

| Legal Officer Dashboard | Scrutiny & Encumbrance Queue |
| :---: | :---: |
| ![Legal Dashboard](docs/screenshots/legal_dashboard.png) | ![Legal Queue](docs/screenshots/legal_queue.png) |
| **Encumbrance & Civil Caveat Analysis** | **Legal Precedent Review** |
| ![Legal Scrutiny](docs/screenshots/legal_scrutiny.png) | ![Legal App Review](docs/screenshots/legal_application_review.png) |
| **Legal Review History** | **Officer Profile** |
| ![Legal History](docs/screenshots/legal_history.png) | ![Legal Profile](docs/screenshots/legal_profile.png) |

---

### 6. 🗺️ GIS Specialist Portal (`:3004`)
*BhooNaksha cadastral map verification interface with SVG geometry renderer, overlap detection, and ULPIN coordinate generator.*

| GIS Dashboard Metrics | Cadastral Geometry Queue |
| :---: | :---: |
| ![GIS Dashboard](docs/screenshots/gis_dashboard.png) | ![GIS Queue](docs/screenshots/gis_queue.png) |
| **Polygon Vertex Inspection** | **Cadastral Boundary AI Overlap View** |
| ![GIS Boundary Details](docs/screenshots/gis_boundary_review_details.png) | ![GIS Boundary Review](docs/screenshots/gis_boundary_inspection.png) |
| **GIS History Tracking** | **GIS Operations Profile** |
| ![GIS History](docs/screenshots/gis_history.png) | ![GIS Profile](docs/screenshots/gis_profile.png) |

---

### 7. 🏛️ Revenue Admin / Tehsildar Portal (`:3005`)
*Executive magistrate portal for final ratification, automated mutation dispatch into the State Land Registry, and tamper-proof certificate generation.*

| Tehsildar Ratification Dashboard | Final Approval & Mutation Queue |
| :---: | :---: |
| ![Revenue Dashboard](docs/screenshots/revenue_dashboard.png) | ![Revenue Queue](docs/screenshots/revenue_review_queue.png) |
| **Executive Approval Detail View** | **Mandal / Tehsil Performance Benchmarks** |
| ![Revenue Approval](docs/screenshots/revenue_application_review.png) | ![Revenue Tehsils](docs/screenshots/revenue_tehsils.png) |
| **Revenue Analytics & Reports** | **Section 40 Statutory Audit Ledger** |
| ![Revenue Reports](docs/screenshots/revenue_reports.png) | ![Revenue History](docs/screenshots/revenue_history.png) |

---

### 8. 🛠️ System Admin & CCLA Portal (`:3006`)
*Statewide observability and control plane for the Chief Commissioner of Land Administration. Fleet health, AI drift monitoring, and RBAC governance.*

| State Admin Telemetry Dashboard | 11 Core Microservices Fleet Monitor |
| :---: | :---: |
| ![Admin Dashboard](docs/screenshots/admin_dashboard.png) | ![Admin System Monitor](docs/screenshots/admin_system_monitor.png) |
| **AI Model Governance & Latency** | **Multi-Tenant User & RBAC Directory** |
| ![Admin AI Performance](docs/screenshots/admin_ai_performance.png) | ![Admin User Management](docs/screenshots/admin_user_management.png) |
| **Cryptographic Section-40 Audit Trail** | **Cryptographic Block Detail Modal** |
| ![Admin Audit Log](docs/screenshots/admin_audit_log.png) | ![Admin Audit Modal](docs/screenshots/admin_audit_detail_modal.png) |

---

## 🏗️ System Architecture & Services

<details>
<summary><strong>Expand to view API Gateway & Architecture Diagram</strong></summary>

### Portals & Routing Matrix
| Service / Subsystem | Host Port | Target Role / Primary Function | Tech Stack |
| :--- | :---: | :--- | :--- |
| **Public Landing Page** | `8080` | Citizen Discovery, 3D Cadastral Canvas, Features | React 18, Vite, Three.js, Tailwind |
| **Citizen Portal** | `3000` | Deed Upload, Real-Time Status Tracker, Grievances | React 18, Zustand, TanStack Query |
| **DEO Portal** | `3001` | Patwari Maker Verification, OCR vs Deed Proofing | React 18, Split-View Comparison |
| **Verifier Portal** | `3002` | Girdawar / RI Checker Scrutiny, Field Pahani Sync | React 18, Audit Scoring Ledger |
| **Legal Portal** | `3003` | Encumbrance, 30-Yr Title Scrutiny, Court Caveats | React 18, Legal Precedent Analysis |
| **GIS Portal** | `3004` | Cadastral Boundary, BhooNaksha Polygon Overlaps | React 18, SVG Cadastral Map, PostGIS |
| **Revenue Admin Portal** | `3005` | Tehsildar Final Approval, Mutation, Certificates | React 18, Digital DSC Signature |
| **System Admin Portal** | `3006` | CCLA Control Plane, Cluster Telemetry, AI Drift | React 18, Metrics & Audit Explorer |
| **Auth Service Gateway** | `8000` | OAuth2, JWT Tokens, Phone OTP, RBAC Engine | FastAPI, Pydantic v2, bcrypt |
| **AI Agent Orchestrator** | `8001` | 10 Verification Agents, LangGraph, Celery Workers | FastAPI, PyTorch, Transformers |

### Infrastructure Diagram
```text
                                  [ INTERNET / INGRESS ]
                                             │
                                    ┌────────┴────────┐
                                    │  Nginx Gateway  │ (Port 80)
                                    └────────┬────────┘
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      │                                      │                                      │
┌─────▼──────────────┐             ┌─────────▼──────────┐                ┌──────────▼─────────┐
│   Landing Page     │             │   Role Frontends   │                │   Backend APIs     │
│   (Port 8080)      │             │  (Ports 3000-3006) │                │  (Ports 8000-8001) │
│ - 3D Terrain Vis   │             │ - Citizen (3000)   │                │ - FastAPI Auth     │
│ - Indic Switcher   │             │ - DEO / Patwari    │                │ - AI Orchestrator  │
│ - Portal Launcher  │             │ - Verifier Checker │                │ - Celery Pipelines │
└────────────────────┘             │ - Legal Scrutiny   │                └──────────┬─────────┘
                                   │ - GIS Specialist   │                           │
                                   │ - Revenue Admin    │                           │
                                   │ - CCLA System Admin│                           │
                                   └────────────────────┘                           │
                                             │                                      │
                                             └──────────────────┬───────────────────┘
                                                                │
                                            ┌───────────────────┴───────────────────┐
                                            │     Data & Storage Infrastructure     │
                                            ├───────────────────────────────────────┤
                                            │ • PostgreSQL 16 + PostGIS 3.4 (5432)  │
                                            │ • Redis Cluster (6379)                │
                                            │ • MinIO S3 Document Storage (9000)    │
                                            │ • RabbitMQ Event Broker (5672)        │
                                            └───────────────────────────────────────┘
```
</details>

---

## 🧠 AI Agent Verification Pipeline

The **AI Agent Orchestrator** executes an asynchronous multi-stage evaluation pipeline for every uploaded land deed:

```text
[Uploaded Deed PDF/Scan] 
         │
         ▼
[1. Quality Assessor Agent] ─── (Resolution > 300 DPI, Skew Correction, Blur Filter)
         │
         ▼
[2. Chitrapathak Multimodal OCR] ─── (Extracts Raw Indic & English Text across 18 Scripts)
         │
         ▼
[3. MuRIL Indic Named-Entity Recognizer] ─── (Extracts Survey No, Extent, Khatiyan, Parties)
         │
         ▼
    ┌────┴──────────────────────────────┬──────────────────────────────┐
    │                                   │                              │
    ▼                                   ▼                              ▼
[4. Land Record Matcher]     [5. Cadastral Boundary AI]     [6. LexBhoomi Legal Engine]
- Pahani / 1-B Khata Match   - PostGIS Polygon Intersect    - 30-Year Encumbrance Check
- Owner Name Discrepancy     - Overlap Tolerance (< 0.5m)   - High Court Caveat Screening
- Area Extent Verification   - ULPIN Centroid Generation    - Ceiling Act Compliance
    │                                   │                              │
    └───────────────────────────────────┼──────────────────────────────┘
                                        │
                                        ▼
                           [7. Explainable Risk Scorer]
                           - Composite Risk Score: 0 – 100
                           - Auto-Routing to Verification Queues
```

---

## 🚀 Quick Start

Bhooraksha is configured as a monolithic multi-workspace repository.

### 1. Clone Repository
```bash
git clone https://github.com/bhoomi-netra/BHOORAKSHA.git
cd BHOORAKSHA
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Launch with Docker Compose (Production / Full Stack)
```bash
# Spin up all 19 microservices & storage containers
docker-compose up -d

# Verify all services are healthy
docker-compose ps
```

### 4. Running Locally (Bare Metal / Dev Mode)
If you prefer running services directly on bare metal without Docker:

**Step A: Install & Build NPM Workspaces**
```bash
# Install dependencies for all 8 frontends and shared libraries
npm install

# Build all micro-frontends
npm run build
```

**Step B: Install Backend Python Dependencies**
```bash
pip install -r auth-service/requirements.txt
pip install -r ai-agent-orchestrator/requirements.txt
```

**Step C: Launch Unified Web Server**
Instead of running 8 different Vite servers manually, use our automated launcher which cleans ports and starts all Python APIs and compiled frontends automatically:
```bash
python run_web.py
```
*Your application will now be live on `http://localhost:8080`!*

---

## 🔒 Security & Statutory Compliance

- **Asymmetric JWT / AES-256-GCM Encryption**: All documents and session tokens are encrypted at rest and in transit.
- **Section 40 Land Revenue Code Compliance**: Immutable audit trails store SHA-256 block hashes of previous and committed states.
- **Biometric WebAuthn & Aadhaar OTP**: Multi-factor authentication enforced for all revenue officers and magistrates.
- **OWASP API Security Top 10**: Built-in sliding rate limiters, strict CORS origins, and Pydantic input sanitization.

---

## 👥 Development & Contribution

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for development workflows, coding standards, and pre-commit hooks.

```bash
# Format & Lint (NPM Workspaces)
npm run lint

# Python formatting
black . && flake8 .
```

---

<div align="center">
  <sub>Built with ❤️ for digital land governance across India. Empowering citizens with transparent, dispute-free land ownership.</sub>
</div>
