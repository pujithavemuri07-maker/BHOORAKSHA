import { DocumentDossierItem } from '../api/types';

export interface DossierDocumentContent {
  id: string;
  name: string;
  type: string;
  source: string;
  sourceType: 'citizen_upload' | 'govt_api' | 'physical_record' | 'identity_vault';
  pagesCount: number;
  ocrEngine: string;
  ocrConfidence: number;
  pages: {
    pageNumber: number;
    title: string;
    headerStamp?: string;
    sections: {
      title?: string;
      content: string | React.ReactNode;
      isHighlighted?: boolean;
      highlightFieldKey?: string;
    }[];
    footerNote?: string;
  }[];
}

export const DOSSIER_DOCUMENTS: Record<string, DossierDocumentContent> = {
  'Registered Sale Deed': {
    id: 'DOC-SALE-DEED',
    name: 'Registered_Sale_Deed_SD_2025_045.pdf',
    type: 'Registered Sale Deed',
    source: 'Citizen Upload (Primary Title Instrument)',
    sourceType: 'citizen_upload',
    pagesCount: 4,
    ocrEngine: 'ChitraPathak Indic OCR + MuRIL-v2.1',
    ocrConfidence: 98,
    pages: [
      {
        pageNumber: 1,
        title: 'GOVERNMENT OF TELANGANA — REGISTRATION & STAMPS DEPARTMENT',
        headerStamp: 'SUB-REGISTRAR OFFICE SERILINGAMPALLY (0411) • SEAL: 2025/REG/045',
        sections: [
          {
            title: 'DEED OF ABSOLUTE SALE (KRAYA PATRAM)',
            content:
              'This Deed of Absolute Sale is made and executed on this 20th day of December, 2025 (20-12-2025) at Serilingampally, Ranga Reddy District.',
          },
          {
            title: 'PARTIES TO THE INSTRUMENT',
            content:
              'VENDOR: Sri Suresh V. Rao, S/o Late K. V. Rao, aged about 52 years, residing at Plot 18, Gachibowli, Serilingampally Mandal, Ranga Reddy District.\n\nPURCHASER: Sri Ramesh Kumar (Full Legal Name: Ramesh Kumar Patel), S/o Late Shankar Patel, aged about 44 years, holding Masked Aadhaar No: XXXX XXXX 8821, residing at Hyderabad.',
            highlightFieldKey: 'ownerName',
          },
          {
            title: 'VALUATION & CONSIDERATION',
            content:
              'Total Sale Consideration agreed and paid: Rs. 45,00,000/- (Rupees Forty-Five Lakhs Only). Stamp Duty of Rs. 50,000/- paid under Challan No. TS-SRO-2025-8819.',
            highlightFieldKey: 'registrationDate',
          },
        ],
        footerNote: 'Page 1 of 4 • Document Ref: SD-2025-045 • SRO Serilingampally',
      },
      {
        pageNumber: 2,
        title: 'RECITALS & TITLE FLOW (ROOT OF TITLE)',
        headerStamp: 'CERTIFIED TITLE VOUCHER • SRO REGISTER BOOK-1',
        sections: [
          {
            title: 'HISTORY OF OWNERSHIP',
            content:
              'WHEREAS the Vendor herein is the absolute and lawful owner and possessor of agricultural land bearing Survey No. 123/456, having acquired the same through registered Title Deed No. 1102/2022 and regularized via Mutation Proceeding MUT-2022-8110.',
          },
          {
            title: 'TITLE COVENANTS & ENCUMBRANCE NIL DECLARATION',
            content:
              'The Vendor hereby covenants that the said scheduled property is free from all encumbrances, charges, court attachments, minor claims, mortgages, or government acquisition proceedings.',
          },
        ],
        footerNote: 'Page 2 of 4 • Document Ref: SD-2025-045 • Non-Encumbrance Verified',
      },
      {
        pageNumber: 3,
        title: 'SCHEDULE OF PROPERTY (STATUTORY BOUNDARIES & EXTENT)',
        headerStamp: 'STATUTORY SCHEDULE BOUNDARIES • DEMARCATED PARCEL',
        sections: [
          {
            title: 'SCHEDULE A — PROPERTY PARTICULARS',
            content:
              'All that piece and parcel of agricultural land situated at Gachibowli Village, Serilingampally Mandal, Ranga Reddy District, Telangana State:\n\n• Survey / Hissa Number: 123/456 (Sub-Division P-1)\n• ULPIN Code: ULPIN-36-RR-SER-123-01\n• Total Extent: 2.50 Acres (10,117.14 Sq. Meters / 2 Acres 20 Guntas)\n• Classification: Agricultural (Wet / Tari) • Usage: Farming & Horticulture',
            highlightFieldKey: 'surveyNumber',
          },
          {
            title: 'SCHEDULE BOUNDARIES (N / S / E / W)',
            content:
              '• NORTH: Survey 122 Panchayat Cart Track (30 ft width)\n• SOUTH: Survey 124 Minor Irrigation Canal Reserve\n• EAST: Minor Irrigation Nala Buffer\n• WEST: Survey 121 Private Agricultural Farm of K. Narayana',
            highlightFieldKey: 'boundaries',
          },
        ],
        footerNote: 'Page 3 of 4 • Document Ref: SD-2025-045 • Schedule of Land',
      },
      {
        pageNumber: 4,
        title: 'SIGNATURES, BIOMETRIC ATTESTATION & REGISTRATION ENDORSEMENT',
        headerStamp: 'REGISTRATION CERTIFICATE • BOOK-1 / REG-2025-789',
        sections: [
          {
            title: 'EXECUTION & BIOMETRICS',
            content:
              'Signed, Sealed and Delivered by the Vendor: [Sri Suresh V. Rao - Biometric Verified]\nSigned and Received by the Purchaser: [Sri Ramesh Kumar Patel - Aadhaar e-KYC Verified]\nWitness 1: M. Venkat Reddy, Serilingampally\nWitness 2: K. Anand Kumar, Gachibowli',
          },
          {
            title: 'SUB-REGISTRAR STATUTORY ENDORSEMENT',
            content:
              'Registered at the Office of the Sub-Registrar, Serilingampally, and entered in Book 1, Volume 412, Pages 88 to 94 as Document Number REG-2025-789 on this 20th day of December, 2025.\n\nSigned by: J. Satyanarayana, Sub-Registrar (Seal & Digital Signature)',
            highlightFieldKey: 'registrationNumber',
          },
        ],
        footerNote: 'Page 4 of 4 • Final Registration Endorsement • 300 DPI Certified',
      },
    ],
  },

  'RoR / Pattadar Record (1-B)': {
    id: 'DOC-ROR-1B',
    name: 'Pattadar_Passbook_1B_Extract.pdf',
    type: 'RoR / Pattadar Record (1-B)',
    source: 'Citizen Upload & State Land Records Master Record',
    sourceType: 'govt_api',
    pagesCount: 2,
    ocrEngine: 'ChitraPathak Indic OCR + State RoR Parser',
    ocrConfidence: 96,
    pages: [
      {
        pageNumber: 1,
        title: 'GOVERNMENT OF TELANGANA — REVENUE DEPARTMENT',
        headerStamp: 'INTEGRATED LAND RECORDS PORTAL • FORM 1-B (RoR EXTRACT)',
        sections: [
          {
            title: 'PATTADAR & KHATA PARTICULARS',
            content:
              '• Khata Number: KH-88214\n• Pattadar / Owner Name: Sri Ramesh Kumar\n• Father / Spouse Name: Late Shankar Patel\n• Aadhaar Token: XXXX-XXXX-8821 (E-KYC Linked)\n• Total Holding Extent in Village: 2.50 Acres\n• Village: Gachibowli | Mandal: Serilingampally | District: Ranga Reddy',
            highlightFieldKey: 'ownerName',
          },
          {
            title: 'PARCEL-WISE CADASTRAL DETAILS',
            content:
              '• Survey Number: 123/456\n• Sub-Division: P-1\n• Extent: 2.50 Acres (2 Acres 20 Guntas)\n• Land Nature: Agricultural Dry / Wet (Tari)\n• Land Revenue / Water Tax Assessment: Rs. 124.50 per annum\n• Encumbrance / Court Dispute Status: NIL (Dispute Free)',
            highlightFieldKey: 'surveyNumber',
          },
        ],
        footerNote: 'Page 1 of 2 • Form 1-B Statutory RoR Extract • Digitally Verified',
      },
      {
        pageNumber: 2,
        title: 'MUTATION ENDORSEMENT & REVENUE INSPECTOR ATTESTATION',
        headerStamp: 'OFFICE OF THE TAHSILDAR • MUTATION ENTRY CERTIFICATE',
        sections: [
          {
            title: 'PREVIOUS MUTATION PROCEEDINGS',
            content:
              '• Mutation Proceeding No: MUT-2022-8110\n• Mutation Order Date: 14-Aug-2022\n• Mode of Acquisition: Registered Sale Deed\n• Transferor: Suresh V. Rao -> Transferee: Ramesh Kumar\n• Field Inspection Verified by: Village Revenue Officer & Girdawar',
            highlightFieldKey: 'mutationNumber',
          },
          {
            title: 'OFFICER DIGITAL SIGNATURE & QR AUTHENTICATION',
            content:
              'Digitally Signed by: Tahsildar & Executive Magistrate, Serilingampally Mandal.\nVerification Hash: sha256:d891e4f5a892b109c091823abce180918a812e9b\nStatus: Active Record in State Master Spatial Cadastre',
          },
        ],
        footerNote: 'Page 2 of 2 • Revenue Master Record • QR Code Embedded',
      },
    ],
  },

  'Identity Proof (Masked)': {
    id: 'DOC-IDENTITY-PROOF',
    name: 'Aadhaar_Masked_EKYC.pdf',
    type: 'Identity Proof (Masked)',
    source: 'Citizen Upload (UIDAI Masked E-KYC Token)',
    sourceType: 'identity_vault',
    pagesCount: 1,
    ocrEngine: 'UIDAI QR Parser + Masked OCR',
    ocrConfidence: 99,
    pages: [
      {
        pageNumber: 1,
        title: 'UNIQUE IDENTIFICATION AUTHORITY OF INDIA (GOVERNMENT OF INDIA)',
        headerStamp: 'UIDAI E-KYC SECURE VAULT • MASKED AADHAAR CARD',
        sections: [
          {
            title: 'CITIZEN IDENTITY PARTICULARS',
            content:
              '• Full Legal Name: RAMESH KUMAR PATEL\n• Father / Guardian Name: Late Shankar Patel\n• Date of Birth: 14/08/1982\n• Gender: Male\n• Masked Aadhaar Number: XXXX XXXX 8821\n• Virtual ID (VID): 9182-0091-8819-4412',
            highlightFieldKey: 'ownerName',
          },
          {
            title: 'VERIFIED RESIDENTIAL ADDRESS',
            content:
              'Flat No. 402, Sri Sai Nilayam, Street No. 4, Telecom Nagar, Gachibowli, Serilingampally Mandal, Hyderabad, Ranga Reddy District, Telangana - 500032.',
          },
          {
            title: 'E-KYC VERIFICATION AUDIT',
            content:
              '• E-KYC Response: AUTH_SUCCESS\n• UIDAI Auth Timestamp: 2026-09-06T11:17:00Z\n• Biometric / OTP Factor: Face-Auth & OTP 2-Factor Passed\n• Data Security: Compliant with Aadhaar Act (Section 29) Masking Guidelines',
          },
        ],
        footerNote: 'Page 1 of 1 • UIDAI E-KYC Verified Document • Masked for Privacy',
      },
    ],
  },

  'Cadastral Map (FMB)': {
    id: 'DOC-FMB-MAP',
    name: 'Cadastral_FMB_Tippan_123.pdf',
    type: 'Cadastral Map (FMB)',
    source: 'Directorate of Survey Settlement & Land Records',
    sourceType: 'govt_api',
    pagesCount: 1,
    ocrEngine: 'Vector Geospatial Cadastral Parser',
    ocrConfidence: 94,
    pages: [
      {
        pageNumber: 1,
        title: 'DIRECTORATE OF SURVEY SETTLEMENT & LAND RECORDS',
        headerStamp: 'FIELD MEASUREMENT BOOK (FMB) TIPPAN • SCALE 1:1000',
        sections: [
          {
            title: 'PARCEL DEMARCATION: SURVEY NO. 123/456',
            content:
              '• Parcel Sub-division: P-1 (2.50 Acres / 10,117.14 Sq. Mtrs)\n• Village: Gachibowli | Village Map Grid Ref: GRID-TS-RR-04\n• Base Line Length: 142.5 meters\n• Offsets: A1 to A6 verified on ground with DGPS Survey',
            highlightFieldKey: 'surveyNumber',
          },
          {
            title: 'SURROUNDING BOUNDARY SCHEDULE',
            content:
              '• North Boundary (Offset 0-142m): Survey 122 Panchayat Cart Track (Width: 9.14m)\n• South Boundary (Offset 0-140m): Survey 124 Canal Reserve Buffer (Width: 15.0m)\n• East Boundary: Minor Irrigation Nala Buffer Line (No construction zone)\n• West Boundary: Survey 121 Agricultural Boundary Bund',
            highlightFieldKey: 'boundaries',
          },
        ],
        footerNote: 'Page 1 of 1 • DGPS Demarcated Cadastral Map • Geo-Tagged Vector',
      },
    ],
  },

  'Prior Mutation Order': {
    id: 'DOC-MUTATION-ORDER',
    name: 'Prior_Mutation_Order_2022.pdf',
    type: 'Mutation Record',
    source: 'Tahsildar Revenue Registry Record',
    sourceType: 'physical_record',
    pagesCount: 2,
    ocrEngine: 'State Revenue Proceedings OCR',
    ocrConfidence: 92,
    pages: [
      {
        pageNumber: 1,
        title: 'PROCEEDINGS OF THE TAHSILDAR, SERILINGAMPALLY MANDAL',
        headerStamp: 'OFFICE OF THE TAHSILDAR • PROCEEDING NO. MUT-2022-8110',
        sections: [
          {
            title: 'MUTATION PROCEEDING ORDER',
            content:
              'SUBJECT: Land Revenue — Mutation of Agricultural Lands in favor of Sri Suresh V. Rao for land in Sy. No. 123/456 extent 2.50 Acres at Gachibowli Village — Orders Issued.\n\nREF: Application No. MUT/2022/771 dated 02-07-2022 along with Registered Sale Deed No. 1102/2022.',
            highlightFieldKey: 'mutationNumber',
          },
          {
            title: 'ORDER SUMMARY',
            content:
              'In exercise of the powers conferred under Section 5(3) of the RoR Act, the title of the scheduled agricultural land extent 2.50 Acres in Sy. No. 123/456 of Gachibowli village is hereby transferred from Sri K. Balakrishnaiah to Sri Suresh V. Rao.',
          },
        ],
        footerNote: 'Page 1 of 2 • Tahsildar Proceedings • Official Revenue Order',
      },
      {
        pageNumber: 2,
        title: 'REVENUE REGISTER UPDATE & ENTRY VERIFICATION',
        headerStamp: 'REVENUE RECORD AMENDMENT • 1B REGISTER UPDATE',
        sections: [
          {
            title: 'AMENDMENT IN 1-B RECORD',
            content:
              'Khata Number 7701 assigned to Sri Suresh V. Rao. Necessary entries made in Pahani and 1-B Village Register on 14-Aug-2022.',
          },
        ],
        footerNote: 'Page 2 of 2 • Official Seal & Signature of Tahsildar',
      },
    ],
  },
};

export function getDocumentContent(docType: string): DossierDocumentContent {
  // Normalize and match
  if (docType.toLowerCase().includes('sale') || docType.toLowerCase().includes('deed')) {
    return DOSSIER_DOCUMENTS['Registered Sale Deed'];
  }
  if (docType.toLowerCase().includes('ror') || docType.toLowerCase().includes('passbook') || docType.toLowerCase().includes('1-b') || docType.toLowerCase().includes('1b')) {
    return DOSSIER_DOCUMENTS['RoR / Pattadar Record (1-B)'];
  }
  if (docType.toLowerCase().includes('identity') || docType.toLowerCase().includes('aadhaar') || docType.toLowerCase().includes('proof')) {
    return DOSSIER_DOCUMENTS['Identity Proof (Masked)'];
  }
  if (docType.toLowerCase().includes('map') || docType.toLowerCase().includes('fmb') || docType.toLowerCase().includes('cadastral') || docType.toLowerCase().includes('tippan')) {
    return DOSSIER_DOCUMENTS['Cadastral Map (FMB)'];
  }
  if (docType.toLowerCase().includes('mutation')) {
    return DOSSIER_DOCUMENTS['Prior Mutation Order'];
  }
  return DOSSIER_DOCUMENTS['Registered Sale Deed'];
}
