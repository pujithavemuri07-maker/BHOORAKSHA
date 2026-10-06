# 📝 Data Entry Operator (DEO / Patwari) Guide

This guide describes operational workflows for Data Entry Operators and Village Revenue Officers (Patwaris) handling document ingestion, OCR review, and manual transcriptions.

---

## 1. Accessing the DEO Dashboard

- URL: `http://localhost:3001` (or via API Gateway `/deo`)
- Role: `DATA_ENTRY_OPERATOR`
- Capabilities: View pending review queue, perform manual OCR correction, flag low-confidence documents.

---

## 2. Processing Document Queue

1. Select an item from the **Pending OCR Review** queue.
2. In the **Split-View Review Panel**:
   - The left pane displays the original high-resolution scan of the registered deed.
   - The right pane displays the Indic OCR/NER extracted fields (Survey number, Seller/Buyer names, Land Area, Boundaries).
3. Where confidence is highlighted in yellow or red (< 85%), review the scan and correct typographical or OCR discrepancies.
4. Click **Confirm & Push to Verifier** to pass the parcel to the Verification Officer.
