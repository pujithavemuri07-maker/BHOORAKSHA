# 👤 Citizen User Guide – Bhooraksha

Welcome to Bhooraksha. This guide explains how citizens can verify land titles, upload registered sale deeds, and track automated verification in real-time.

---

## 1. Logging In

1. Open the Bhooraksha portal at `http://localhost:8080` (or `http://localhost:3000`).
2. Select your preferred language from the 18 supported Indian languages (English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Urdu, Sanskrit, Konkani, Maithili, Kashmiri, Nepali).
3. Authenticate using your Mobile Phone Number + OTP, or with your Registered Email & Password.

---

## 2. Submitting a New Land Verification Application

1. Navigate to **New Application** (`/citizen/new`).
2. **Step 1: Application Details**
   - Enter Applicant Name, Mobile Number, and Aadhaar/PAN.
3. **Step 2: Property Identification**
   - Select State, District, Sub-District (Taluk/Tehsil), and Village.
   - Enter Survey Number, Sub-division/Hissa Number, and Parcel Extent (Acres/Cents).
4. **Step 3: Document Upload**
   - Drag and drop your Registered Sale Deed, Pattadar Passbook, or Encumbrance Certificate (PDF, PNG, JPG).
   - The platform will verify file clarity, orientation, and resolution automatically.
5. **Step 4: Review & Submit**
   - Confirm details and click **Submit Application**. An application reference number (e.g., `BR-2026-0042`) will be generated.

---

## 3. Tracking Verification Status

- Visit **My Applications** (`/citizen/applications`) to view your status timeline.
- Real-time progress updates are shown as the AI Pipeline processes:
  - Document Quality & OCR
  - Cadastral Boundary Check
  - Court Caveat Search
  - Risk Assessment
- Once approved by the Tehsildar, download your tamper-proof **Digitally Signed Land Clearance Certificate**.
