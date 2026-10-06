# 🛡️ Administrator Guide (Revenue & System Admins)

This guide covers operational responsibilities for Tehsildars (Revenue Admins) and Technical Platform Administrators (System Admins).

---

## 1. Revenue Admin (Tehsildar) Workflow

- **URL:** `http://localhost:3005` (`/revenue`)
- **Key Actions:**
  - **District Verification Stats:** Real-time pulse of pending, in-review, flagged, and cleared parcels.
  - **Mutation Clearance Panel:** Review comprehensive dossier containing GIS overlap maps, legal encumbrance reports, and the composite 0–100 AI Risk Score.
  - **Digital Signing:** Affix tamper-evident cryptographic digital signatures to approved mutation orders and trigger revenue ledger synchronization.

---

## 2. System Admin Workflow

- **URL:** `http://localhost:3006` (`/admin`)
- **Key Actions:**
  - **Cluster Telemetry:** Monitor latency, error rates, and CPU/Memory usage across all 19 microservices.
  - **AI Model Performance:** Track Indic OCR character error rate (CER), MuRIL NER F1 scores, and pipeline throughput.
  - **Immutable Audit Trail:** Query cryptographically verifiable audit logs with timestamp, actor ID, action type, client IP, and state diff.
  - **RBAC Management:** Provision departmental credentials, assign role privileges, and enforce session invalidation.
