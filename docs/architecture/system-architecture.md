# 🏛️ Bhooraksha (भूरक्षा) – System Architecture

## 1. Overview

Bhooraksha is an enterprise-grade, multi-service AI-powered land record verification platform engineered to eradicate property disputes, detect land boundary encroachment, and fast-track mutation approvals across India.

```
                                 [ Citizen / Department Users ]
                                                │
                                                ▼
                                    [ Nginx API Gateway :80 ]
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
           [ Role Micro-Frontends ]                                [ Core Backend API ]
           ├─ Citizen (:3000)                                      ├─ Auth Gateway (:8000)
           ├─ DEO (:3001)                                          │   (JWT, RBAC, OTP, Rate Limiter)
           ├─ Verifier (:3002)                                     └─ AI Orchestrator (:8001)
           ├─ Legal Review (:3003)                                     (Multi-Agent CrewAI/LangGraph)
           ├─ GIS Specialist (:3004)
           ├─ Revenue Admin (:3005)
           ├─ System Admin (:3006)
           └─ Landing Page (:8080)
                                                                           │
                                      ┌────────────────────────────────────┴──────────────────────────┐
                                      ▼                                                               ▼
                             [ Asynchronous Pipeline ]                                     [ Persistent Stores ]
                             ├─ RabbitMQ (Message Broker)                                  ├─ PostgreSQL + PostGIS (:5432)
                             ├─ Celery Workers (AI Pipeline)                               ├─ Redis Distributed Cache (:6379)
                             │   ├─ Doc Quality & OCR (ChitraPathak)                       ├─ MinIO Object Store (:9000)
                             │   ├─ Indic NER & Translation (MuRIL)                        └─ Prometheus & Grafana (:9090, :3007)
                             │   ├─ Cadastral PostGIS GIS Check
                             │   ├─ Legal & Caveat Analysis
                             │   └─ Multi-Factor Risk Scoring
```

---

## 2. Seven Role Portals & RBAC Matrix

| Role | Micro-Frontend | Port | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen-service` | 3000 | Application filing, document upload, status tracking, certificate download |
| **Data Entry Operator** | `deo-service` | 3001 | Patwari queue, OCR transcription fallback, metadata extraction QA |
| **Verification Officer** | `verifier-service` | 3002 | Girdawar inspection, side-by-side deed vs Dharani/Bhoomi cross-verification |
| **Legal Reviewer** | `legal-service` | 3003 | Caveat search, court order validation, encumbrance verification |
| **GIS Specialist** | `gis-service` | 3004 | Cadastral parcel validation, overlap calculation, geometry buffer analysis |
| **Revenue Admin** | `revenue-admin-service` | 3005 | Tehsildar approvals, digital signing, mutation triggers, revenue analytics |
| **System Admin** | `system-admin-service` | 3006 | Platform observability, AI model drift, audit trails, user management |

---

## 3. Asynchronous AI Verification Engine

The AI verification engine coordinates 10 specialized agents sequentially and in parallel:

1. **Document Quality Agent**: Validates resolution, DPI, blur, skew, and tamper detection.
2. **Indic OCR Agent (ChitraPathak-1)**: Multilingual optical character recognition across 13 Indian scripts.
3. **Indic NER Agent (MuRIL)**: Extracts survey numbers, boundaries, sub-district codes, and names.
4. **Language Translation Agent**: Normalizes local vernacular land terms into standard schema.
5. **Internal Validation Agent**: Cross-references internal database consistency.
6. **Government API Agent**: Queries state portals (Dharani, Bhoomi, Banglarbhumi, Jharbhoomi).
7. **Cross-Verification Agent**: Correlates seller chain-of-title and prior deed registrations.
8. **GIS Boundary Agent**: Executes PostGIS ST_Intersects, ST_Overlaps, ST_Area calculations.
9. **Legal Analysis Agent**: Screens district court caveats, dispute logs, and statutory encumbrances.
10. **Risk Scoring Agent**: Synthesizes all signals into an explainable 0–100 Risk Score.

---

## 4. Security & Compliance

- **Authentication**: Asymmetric/HMAC JWT with short expiry, rolling refresh tokens, and rate-limited OTP.
- **Role-Based Access Control**: Strict least-privilege permission matrix enforced at API Gateway and database levels.
- **Audit Logging**: Immutable, tamper-evident PostgreSQL audit trail logging all mutation events, IP addresses, and actors.
- **Spatial Precision**: WGS84 (EPSG:4326) / UTM projection compliance with sub-meter parcel accuracy.
