import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEOApplication,
  Verifier,
  HistoryRecord,
  DEOStats,
  ManualEntryPayload,
  FieldCorrectionRecord,
  DocumentDossierItem,
  CompletenessItem,
} from '../api/types';

import { classifyRisk, sanitizeApplication } from '../utils/riskClassification';

// Simple SHA-256 hash simulation for tamper-evident correction logs
function pseudoSha256(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256:e9a2f7${hex}89b1c7f99d81745aa6212e0912e71a4f89c02d73be14b1a4328d22`.slice(0, 64);
}

interface DEOState {
  applications: DEOApplication[];
  verifiers: Verifier[];
  history: HistoryRecord[];
  reviewedTodayCount: number;
  sentToVerifierCount: number;
  
  // Actions
  saveCorrections: (applicationId: string, remarks?: string) => void;
  forwardApplication: (id: string, verifierId: string, remarks?: string) => void;
  flagCorrection: (id: string, reason: string, remarks?: string) => void;
  correctField: (
    applicationId: string,
    section: 'propertyDetails' | 'ownerDetails' | 'landDetails' | 'documentDetails',
    fieldKey: string,
    newValue: any,
    reason: string,
    sourceDoc?: string
  ) => void;
  requestMissingDocument: (applicationId: string, docType: string, remarks?: string) => void;
  saveManualEntry: (id: string, data: ManualEntryPayload) => void;
  requestLegalReview: (id: string, remarks?: string) => void;
  requestGisReview: (id: string, remarks?: string) => void;
  bulkIngestApplications: (apps: DEOApplication[]) => void;
  batchApprove: (ids: string[], remarks?: string) => void;
  batchCorrection: (ids: string[], reason: string, remarks?: string) => void;
  batchAssign: (ids: string[], verifierId: string) => void;
  getStats: () => DEOStats;
}

const INITIAL_APPLICATIONS: DEOApplication[] = [
  {
    id: 'REQ-2026-000123',
    citizenName: 'Ramesh Kumar Patel',
    citizenPhone: '+91 98765 43210',
    citizenEmail: 'ramesh.patel@example.gov.in',
    documentType: 'Registered Sale Deed',
    submissionDate: '2026-09-06T11:20:00Z',
    status: 'NEEDS_ATTENTION',
    priority: 'MEDIUM',
    riskScore: 68,
    confidenceCategory: 'MEDIUM',
    fileName: 'Sale_Deed_SD_2025_045.pdf',
    fileSize: 4210400,
    documentUrl: 'https://bhooraksha.gov.in/docs/sample_deed.pdf',
    govtApiStatus: 'available',
    documentsDossier: [
      {
        id: 'DOC-401-1',
        name: 'Registered_Sale_Deed_SD_2025_045.pdf',
        type: 'Registered Sale Deed',
        status: 'PROCESSED',
        pagesCount: 4,
        size: '4.2 MB',
        confidence: 98,
        uploadTimestamp: '2026-09-06T11:15:00Z',
      },
      {
        id: 'DOC-401-2',
        name: 'Pattadar_Passbook_1B_Extract.pdf',
        type: 'RoR / Pattadar Record (1-B)',
        status: 'PROCESSED',
        pagesCount: 2,
        size: '1.8 MB',
        confidence: 96,
        uploadTimestamp: '2026-09-06T11:16:00Z',
      },
      {
        id: 'DOC-401-3',
        name: 'Aadhaar_Masked_E-KYC.pdf',
        type: 'Identity Proof (Masked)',
        status: 'PROCESSED',
        pagesCount: 1,
        size: '620 KB',
        confidence: 99,
        uploadTimestamp: '2026-09-06T11:17:00Z',
      },
      {
        id: 'DOC-401-4',
        name: 'Cadastral_FMB_Tippan_123.pdf',
        type: 'Cadastral Map (FMB)',
        status: 'PROCESSED',
        pagesCount: 1,
        size: '2.4 MB',
        confidence: 94,
        uploadTimestamp: '2026-09-06T11:18:00Z',
      },
      {
        id: 'DOC-401-5',
        name: 'Prior_Mutation_Order_2022.pdf',
        type: 'Mutation Record',
        status: 'PROCESSED',
        pagesCount: 2,
        size: '1.2 MB',
        confidence: 92,
        uploadTimestamp: '2026-09-06T11:19:00Z',
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Registered Sale Deed', status: 'COMPLETE', docType: 'Sale Deed (SD-2025-045)' },
      { key: 'ror', label: 'RoR / 1-B Record Extract', status: 'COMPLETE', docType: 'Pattadar Master (KH-88214)' },
      { key: 'mutation', label: 'Prior Mutation Proceeding', status: 'COMPLETE', docType: 'MUT-2022-8110' },
      { key: 'cadastral', label: 'Cadastral Map (FMB Tippan)', status: 'COMPLETE', docType: 'Sy. 123/456 Vector' },
      { key: 'identity', label: 'Identity Proof (Masked Aadhaar)', status: 'COMPLETE', docType: 'UIDAI Masked E-KYC' },
      { key: 'ec', label: 'Encumbrance Certificate (15-Yr)', status: 'COMPLETE', docType: 'Nil Encumbrance EC-2026-90' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Gachibowli',
        surveyNumber: '123/456',
        subDivision: 'P-1',
        ulpin: 'ULPIN-36-RR-SER-123-01',
        meta: {
          surveyNumber: {
            value: '123/456',
            confidence: 99,
            sourceDoc: 'Sale Deed #SD-2025-045',
            page: 3,
            line: 'Line 14',
            rawOcrSnippet: 'SURVEY NO. 123/456 (SUB-DIVISION P-1)',
            isAutoVerified: true,
          },
          ulpin: {
            value: 'ULPIN-36-RR-SER-123-01',
            confidence: 98,
            sourceDoc: 'Sale Deed & Dharani Link',
            page: 1,
            isAutoVerified: true,
          },
          village: {
            value: 'Gachibowli',
            confidence: 99,
            sourceDoc: 'Sale Deed #SD-2025-045',
            page: 1,
            isAutoVerified: true,
          },
          taluk: {
            value: 'Serilingampally',
            confidence: 99,
            sourceDoc: 'Sale Deed #SD-2025-045',
            page: 1,
            isAutoVerified: true,
          },
        },
      },
      ownerDetails: {
        name: 'Ramesh Kumar',
        fatherOrSpouse: 'Late Shankar Patel',
        share: '100% Sole Ownership',
        previousOwner: 'Suresh V. Rao',
        panOrAadhaarLast4: '8821',
        maskedAadhaar: 'XXXX XXXX 8821',
        meta: {
          name: {
            value: 'Ramesh Kumar',
            confidence: 88,
            sourceDoc: 'Sale Deed #SD-2025-045',
            page: 1,
            line: 'Paragraph 2',
            rawOcrSnippet: 'SRI RAMESH KUMAR, S/O LATE SHANKAR PATEL',
            isAutoVerified: false,
          },
          fatherOrSpouse: {
            value: 'Late Shankar Patel',
            confidence: 96,
            sourceDoc: 'Sale Deed #SD-2025-045',
            page: 1,
            isAutoVerified: true,
          },
          share: {
            value: '100% Sole Ownership',
            confidence: 97,
            sourceDoc: 'Sale Deed Schedule',
            page: 3,
            isAutoVerified: true,
          },
          previousOwner: {
            value: 'Suresh V. Rao',
            confidence: 95,
            sourceDoc: 'Sale Deed Vendor Clause',
            page: 1,
            isAutoVerified: true,
          },
        },
      },
      landDetails: {
        area: 2.5,
        unit: 'Acres',
        landType: 'Agricultural (Wet / Tari)',
        usage: 'Farming & Horticulture',
        boundaries: {
          north: 'Survey 122 Panchayat Cart Track',
          south: 'Survey 124 Canal Reserve',
          east: 'Minor Irrigation Nala',
          west: 'Survey 121 Private Farm',
        },
        meta: {
          area: {
            value: 2.5,
            confidence: 98,
            sourceDoc: 'Sale Deed Schedule',
            page: 3,
            line: 'Line 22',
            rawOcrSnippet: 'TOTAL EXTENT OF LAND MEASURING 2.50 ACRES',
            isAutoVerified: true,
          },
          landType: {
            value: 'Agricultural (Wet / Tari)',
            confidence: 95,
            sourceDoc: 'Sale Deed Schedule',
            page: 3,
            isAutoVerified: true,
          },
          boundaries: {
            value: 'N: Cart Track, S: Canal, E: Nala, W: Private',
            confidence: 91,
            sourceDoc: 'Sale Deed Schedule',
            page: 3,
            isAutoVerified: true,
          },
        },
      },
      documentDetails: {
        type: 'Registered Sale Deed',
        number: 'SD-2025-045',
        registrationNumber: 'REG-2025-789',
        registrationDate: '2025-12-20',
        issuingAuthority: 'Sub-Registrar Office, Serilingampally',
        mutationNumber: 'MUT-2026-0091',
        sroOffice: 'SRO Serilingampally 0411',
        meta: {
          number: {
            value: 'SD-2025-045',
            confidence: 99,
            sourceDoc: 'Sale Deed Header Stamp',
            page: 1,
            isAutoVerified: true,
          },
          registrationDate: {
            value: '2025-12-20',
            confidence: 68,
            sourceDoc: 'Sale Deed Header',
            page: 1,
            line: 'Header Date Stamp',
            rawOcrSnippet: 'EXECUTED THIS 20TH DAY OF DECEMBER 2025',
            isAutoVerified: false,
          },
          issuingAuthority: {
            value: 'Sub-Registrar Office, Serilingampally',
            confidence: 96,
            sourceDoc: 'SRO Rubber Stamp',
            page: 1,
            isAutoVerified: true,
          },
        },
      },
    },
    govtRecord: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Gachibowli',
        surveyNumber: '123/456',
        subDivision: 'P-1',
        ulpin: 'ULPIN-36-RR-SER-123-01',
      },
      ownerDetails: {
        name: 'Ramesh Kumaran',
        fatherOrSpouse: 'Late Shankar Patel',
        share: '100% Sole Ownership',
        previousOwner: 'Suresh V. Rao',
        panOrAadhaarLast4: '8821',
        maskedAadhaar: 'XXXX XXXX 8821',
      },
      landDetails: {
        area: 2.5,
        unit: 'Acres',
        landType: 'Agricultural (Wet / Tari)',
        usage: 'Farming & Horticulture',
        boundaries: {
          north: 'Survey 122 Panchayat Cart Track',
          south: 'Survey 124 Canal Reserve',
          east: 'Minor Irrigation Nala',
          west: 'Survey 121 Private Farm',
        },
      },
      documentDetails: {
        type: 'Registered Sale Deed',
        number: 'SD-2025-045',
        registrationNumber: 'REG-2025-789',
        registrationDate: '2026-01-15',
        issuingAuthority: 'Sub-Registrar Office, Serilingampally',
        mutationNumber: 'MUT-2026-0091',
      },
      khataNumber: 'KH-88214',
      lastUpdated: '2026-08-10',
      disputeFlag: false,
    },
    validationResults: [
      {
        field: 'Survey Number & Sub-Division',
        documentValue: '123/456 (SubDiv: P-1)',
        govtValue: '123/456 (SubDiv: P-1)',
        status: 'MATCH',
        category: 'SURVEY',
        explanation: 'Survey and subdivision perfectly match state master spatial parcel register.',
      },
      {
        field: 'Total Land Extent Area',
        documentValue: '2.50 Acres',
        govtValue: '2.50 Acres',
        status: 'MATCH',
        category: 'AREA',
        explanation: 'Spatial cadastre polygon matches deed extent within 0.01 acre tolerance.',
      },
      {
        field: 'Owner Legal Name',
        documentValue: 'Ramesh Kumar',
        govtValue: 'Ramesh Kumaran',
        status: 'PARTIAL',
        category: 'OWNER',
        explanation: 'Surname/Title variation detected (Kumar vs Kumaran). DEO verification or name correction required.',
      },
      {
        field: 'Registration Stamp Date',
        documentValue: '20 Dec 2025',
        govtValue: '15 Jan 2026',
        status: 'MISMATCH',
        category: 'REGISTRATION',
        explanation: 'Deed execution date (20 Dec 2025) differs from central registry stamp date (15 Jan 2026) by 26 days.',
      },
    ],
  },
  {
    id: 'DEO-2026-402',
    citizenName: 'Anitha Rajendran',
    citizenPhone: '+91 94412 33456',
    citizenEmail: 'anitha.raj@gmail.com',
    documentType: 'Pattadar Passbook',
    submissionDate: '2026-09-06T14:10:00Z',
    status: 'READY_TO_FORWARD',
    priority: 'LOW',
    riskScore: 82,
    confidenceCategory: 'HIGH',
    fileName: 'Passbook_Dharani_Scan_84.pdf',
    fileSize: 3120000,
    documentUrl: 'https://bhooraksha.gov.in/docs/sample_passbook.pdf',
    govtApiStatus: 'available',
    documentsDossier: [
      {
        id: 'DOC-402-1',
        name: 'Passbook_Dharani_Scan_84.pdf',
        type: 'RoR / Pattadar Record (1-B)',
        status: 'PROCESSED',
        pagesCount: 3,
        size: '3.1 MB',
        confidence: 99,
        uploadTimestamp: '2026-09-06T14:05:00Z',
      },
      {
        id: 'DOC-402-2',
        name: 'Aadhaar_Masked_Anitha.pdf',
        type: 'Identity Proof (Masked)',
        status: 'PROCESSED',
        pagesCount: 1,
        size: '540 KB',
        confidence: 99,
        uploadTimestamp: '2026-09-06T14:06:00Z',
      },
      {
        id: 'DOC-402-3',
        name: 'Cadastral_Tippan_84_3.pdf',
        type: 'Cadastral Map (FMB)',
        status: 'PROCESSED',
        pagesCount: 1,
        size: '1.9 MB',
        confidence: 98,
        uploadTimestamp: '2026-09-06T14:07:00Z',
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Title Instrument / Passbook', status: 'COMPLETE', docType: 'Pattadar Passbook PPB-2024-99182' },
      { key: 'ror', label: 'RoR / 1-B Record Extract', status: 'COMPLETE', docType: 'Pattadar Master (KH-44102)' },
      { key: 'cadastral', label: 'Cadastral Map (FMB Tippan)', status: 'COMPLETE', docType: 'Sy. 84/3 Vector' },
      { key: 'identity', label: 'Identity Proof (Masked Aadhaar)', status: 'COMPLETE', docType: 'UIDAI Masked E-KYC' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Medchal-Malkajgiri',
        taluk: 'Keesara',
        village: 'Nagaram',
        surveyNumber: '84/3',
        ulpin: 'ULPIN-36-MM-KEE-084-03',
        meta: {
          surveyNumber: { value: '84/3', confidence: 99, sourceDoc: 'Passbook Scan', isAutoVerified: true },
          village: { value: 'Nagaram', confidence: 99, sourceDoc: 'Passbook Scan', isAutoVerified: true },
        },
      },
      ownerDetails: {
        name: 'Anitha Rajendran',
        fatherOrSpouse: 'Rajendran Murthy',
        share: '100% Individual Title',
        panOrAadhaarLast4: '3341',
        maskedAadhaar: 'XXXX XXXX 3341',
        meta: {
          name: { value: 'Anitha Rajendran', confidence: 99, sourceDoc: 'Passbook Scan', isAutoVerified: true },
        },
      },
      landDetails: {
        area: 1.8,
        unit: 'Acres',
        landType: 'Agricultural Dry (Metta)',
        boundaries: {
          north: 'Survey 83 Cart Track',
          south: 'Survey 85 PWD Channel',
          east: 'Survey 84/2 Land',
          west: 'Village Border Road',
        },
        meta: {
          area: { value: 1.8, confidence: 99, sourceDoc: 'Passbook Scan', isAutoVerified: true },
        },
      },
      documentDetails: {
        type: 'Pattadar Passbook',
        number: 'PPB-2024-99182',
        registrationNumber: 'KEE/PPB/99182',
        registrationDate: '2024-06-18',
        issuingAuthority: 'Tahsildar Keesara',
        meta: {
          number: { value: 'PPB-2024-99182', confidence: 99, sourceDoc: 'Passbook Scan', isAutoVerified: true },
        },
      },
    },
    govtRecord: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Medchal-Malkajgiri',
        taluk: 'Keesara',
        village: 'Nagaram',
        surveyNumber: '84/3',
        ulpin: 'ULPIN-36-MM-KEE-084-03',
      },
      ownerDetails: {
        name: 'Anitha Rajendran',
        fatherOrSpouse: 'Rajendran Murthy',
        share: '100% Individual Title',
        panOrAadhaarLast4: '3341',
        maskedAadhaar: 'XXXX XXXX 3341',
      },
      landDetails: {
        area: 1.8,
        unit: 'Acres',
        landType: 'Agricultural Dry (Metta)',
        boundaries: {
          north: 'Survey 83 Cart Track',
          south: 'Survey 85 PWD Channel',
          east: 'Survey 84/2 Land',
          west: 'Village Border Road',
        },
      },
      documentDetails: {
        type: 'Pattadar Passbook',
        number: 'PPB-2024-99182',
        registrationNumber: 'KEE/PPB/99182',
        registrationDate: '2024-06-18',
        issuingAuthority: 'Tahsildar Keesara',
      },
      khataNumber: 'KH-44102',
    },
    validationResults: [
      {
        field: 'Survey Number',
        documentValue: '84/3',
        govtValue: '84/3',
        status: 'MATCH',
        category: 'SURVEY',
        explanation: 'All fields verified automatically with 99% AI confidence against master registry.',
      },
      {
        field: 'Owner Name & Extent',
        documentValue: 'Anitha Rajendran (1.80 Ac)',
        govtValue: 'Anitha Rajendran (1.80 Ac)',
        status: 'MATCH',
        category: 'OWNER',
        explanation: 'Perfect 100% match with zero exceptions.',
      },
    ],
  },
  {
    id: 'DEO-2026-403',
    citizenName: 'B. Venkatswamy Goud',
    citizenPhone: '+91 97001 92834',
    documentType: 'Partition Deed (Bhaaga Parishkaram)',
    submissionDate: '2026-09-07T08:30:00Z',
    status: 'NEEDS_ATTENTION',
    priority: 'MEDIUM',
    riskScore: 74,
    confidenceCategory: 'MEDIUM',
    fileName: 'Partition_Deed_Muthangi.pdf',
    fileSize: 5120000,
    govtApiStatus: 'available',
    documentsDossier: [
      {
        id: 'DOC-403-1',
        name: 'Partition_Deed_Muthangi.pdf',
        type: 'Partition Deed',
        status: 'PROCESSED',
        pagesCount: 6,
        size: '5.1 MB',
        confidence: 94,
        uploadTimestamp: '2026-09-07T08:20:00Z',
      },
      {
        id: 'DOC-403-2',
        name: 'RoR_Pahani_Extract_210B.pdf',
        type: 'RoR / Pattadar Record (1-B)',
        status: 'PROCESSED',
        pagesCount: 2,
        size: '1.4 MB',
        confidence: 95,
        uploadTimestamp: '2026-09-07T08:22:00Z',
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Partition Deed Instrument', status: 'COMPLETE', docType: 'PART-2025-1102' },
      { key: 'ror', label: 'RoR / 1-B Record Extract', status: 'COMPLETE', docType: 'KH-5521' },
      { key: 'identity', label: 'Identity Proof (Aadhaar)', status: 'MISSING', docType: 'Identity Voucher Required' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Sangareddy',
        taluk: 'Patancheru',
        village: 'Muthangi',
        surveyNumber: '210/B',
        ulpin: 'ULPIN-36-SAN-PAT-210-02',
        meta: {
          surveyNumber: { value: '210/B', confidence: 99, sourceDoc: 'Partition Deed', isAutoVerified: true },
        },
      },
      ownerDetails: {
        name: 'B. Venkatswamy Goud',
        fatherOrSpouse: 'Narsimha Goud',
        share: 'Co-Sharer 50%',
        previousOwner: 'Joint Ancestral Family',
        meta: {
          name: { value: 'B. Venkatswamy Goud', confidence: 97, sourceDoc: 'Partition Deed', isAutoVerified: true },
        },
      },
      landDetails: {
        area: 2.45,
        unit: 'Acres',
        landType: 'Agricultural',
        boundaries: {
          north: 'Survey 209 Farm',
          south: 'Highway Approach Rd',
          east: 'Share of Brother B. Mallesh',
          west: 'Survey 211 Tank Bund',
        },
        meta: {
          area: { value: 2.45, confidence: 95, sourceDoc: 'Partition Deed', isAutoVerified: false },
        },
      },
      documentDetails: {
        type: 'Partition Deed',
        number: 'PART-2025-1102',
        registrationNumber: 'SRO/PAT/1102/2025',
        registrationDate: '2025-11-12',
        issuingAuthority: 'SRO Patancheru',
        meta: {
          number: { value: 'PART-2025-1102', confidence: 98, sourceDoc: 'Partition Deed', isAutoVerified: true },
        },
      },
    },
    govtRecord: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Sangareddy',
        taluk: 'Patancheru',
        village: 'Muthangi',
        surveyNumber: '210/B',
        ulpin: 'ULPIN-36-SAN-PAT-210-02',
      },
      ownerDetails: {
        name: 'B. Venkatswamy Goud',
        fatherOrSpouse: 'Narsimha Goud',
        share: 'Co-Sharer 50%',
        previousOwner: 'Joint Ancestral Family',
      },
      landDetails: {
        area: 2.1,
        unit: 'Acres',
        landType: 'Agricultural',
        boundaries: {
          north: 'Survey 209 Farm',
          south: 'Highway Approach Rd',
          east: 'Share of Brother B. Mallesh',
          west: 'Survey 211 Tank Bund',
        },
      },
      documentDetails: {
        type: 'Partition Deed',
        number: 'PART-2025-1102',
        registrationNumber: 'SRO/PAT/1102/2025',
        registrationDate: '2025-11-12',
        issuingAuthority: 'SRO Patancheru',
      },
      khataNumber: 'KH-5521',
      lastUpdated: '2026-05-19',
    },
    validationResults: [
      {
        field: 'Land Extent Area',
        documentValue: '2.45 Acres',
        govtValue: '2.10 Acres',
        status: 'MISMATCH',
        category: 'AREA',
        explanation: 'Deed claims 2.45 acres but Pahani record confirms only 2.10 acres in Survey 210/B. Discrepancy of 0.35 Acres (14 Guntas).',
      },
    ],
  },
  {
    id: 'DEO-2026-404',
    citizenName: 'M. Padma Reddy',
    citizenPhone: '+91 98850 11223',
    documentType: 'Gift Deed (Daanam)',
    submissionDate: '2026-09-07T09:15:00Z',
    status: 'MISSING_DOCUMENTS',
    priority: 'HIGH',
    riskScore: 45,
    confidenceCategory: 'LOW',
    fileName: 'Gift_Deed_Puppalguda.pdf',
    fileSize: 2890000,
    govtApiStatus: 'available',
    documentsDossier: [
      {
        id: 'DOC-404-1',
        name: 'Gift_Deed_Puppalguda.pdf',
        type: 'Gift Deed (Daanam)',
        status: 'PROCESSED',
        pagesCount: 3,
        size: '2.8 MB',
        confidence: 96,
        uploadTimestamp: '2026-09-07T09:10:00Z',
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Gift Deed Instrument', status: 'COMPLETE', docType: 'GIFT-2026-0442' },
      { key: 'ror', label: 'Pattadar Passbook', status: 'COMPLETE', docType: 'KH-8120' },
      { key: 'heir_noc', label: 'Donor Legal Heir NOC', status: 'MISSING', details: 'Unprobated succession NOC missing' },
      { key: 'identity', label: 'Identity Proof (Aadhaar)', status: 'COMPLETE', docType: 'Masked UIDAI' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Gandipet',
        village: 'Puppalguda',
        surveyNumber: '42/A',
        ulpin: 'ULPIN-36-RR-RAJ-042-01',
      },
      ownerDetails: {
        name: 'M. Padma Reddy',
        fatherOrSpouse: 'M. Pratap Reddy',
        share: '100%',
        previousOwner: 'Late Y. Chinna Reddy',
      },
      landDetails: {
        area: 0.75,
        unit: 'Acres',
        landType: 'Residential Conversion Zone',
        boundaries: {
          north: 'Plot No. 12',
          south: '40ft Road',
          east: 'Survey 43',
          west: 'Plot No. 10',
        },
      },
      documentDetails: {
        type: 'Gift Deed',
        number: 'GIFT-2026-0442',
        registrationNumber: 'SRO/GND/0442/2026',
        registrationDate: '2026-02-14',
        issuingAuthority: 'SRO Gandipet',
      },
    },
    validationResults: [
      {
        field: 'Donor Legal Heir NOC',
        documentValue: 'Missing in Attachment',
        govtValue: 'Encumbered in Sub-Court Case 2024/88',
        status: 'MISMATCH',
        category: 'LEGAL',
        explanation: 'Donor death certificate and unprobated succession requires legal clarification or missing NOC upload.',
      },
    ],
  },
  {
    id: 'DEO-2026-405',
    citizenName: 'K. Satyanarayana',
    citizenPhone: '+91 99491 55678',
    documentType: 'Registered Sale Deed',
    submissionDate: '2026-09-07T10:00:00Z',
    status: 'MISSING_DOCUMENTS',
    priority: 'HIGH',
    riskScore: 18,
    confidenceCategory: 'LOW',
    fileName: 'Sale_Deed_Nanakramguda_302.pdf',
    fileSize: 6200000,
    govtApiStatus: 'available',
    documentsDossier: [
      {
        id: 'DOC-405-1',
        name: 'Sale_Deed_Nanakramguda_302.pdf',
        type: 'Registered Sale Deed',
        status: 'PROCESSED',
        pagesCount: 5,
        size: '6.2 MB',
        confidence: 99,
        uploadTimestamp: '2026-09-07T09:50:00Z',
      },
      {
        id: 'DOC-405-2',
        name: 'ROR_Passbook_Nanakramguda.pdf',
        type: 'RoR / Pattadar Record (1-B)',
        status: 'PROCESSED',
        pagesCount: 2,
        size: '1.6 MB',
        confidence: 98,
        uploadTimestamp: '2026-09-07T09:52:00Z',
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Registered Deed', status: 'COMPLETE', docType: 'SD-2026-3021' },
      { key: 'ror', label: 'Pattadar Record', status: 'COMPLETE', docType: 'KH-3021' },
      { key: 'cadastral', label: 'Cadastral Map', status: 'COMPLETE', docType: 'Vector Demarcated' },
      { key: 'identity', label: 'Masked Identity E-KYC', status: 'COMPLETE', docType: 'UIDAI Verified' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Nanakramguda',
        surveyNumber: '302/1',
        ulpin: 'ULPIN-36-RR-SER-302-01',
      },
      ownerDetails: {
        name: 'K. Satyanarayana',
        fatherOrSpouse: 'K. Ramalingam',
        share: '100%',
        panOrAadhaarLast4: '5567',
        maskedAadhaar: 'XXXX XXXX 5567',
      },
      landDetails: {
        area: 1.25,
        unit: 'Acres',
        landType: 'Commercial IT Corridor',
        boundaries: {
          north: 'ORR Service Road',
          south: 'Survey 303 Layout',
          east: 'Financial District Canal',
          west: 'Survey 301',
        },
      },
      documentDetails: {
        type: 'Registered Sale Deed',
        number: 'SD-2026-3021',
        registrationNumber: 'REG-2026-3021',
        registrationDate: '2026-07-10',
        issuingAuthority: 'SRO Serilingampally',
      },
    },
    validationResults: [
      {
        field: 'Cadastral & Title Cross-Check',
        documentValue: 'Survey 302/1 (1.25 Ac)',
        govtValue: 'Survey 302/1 (1.25 Ac)',
        status: 'MATCH',
        category: 'SURVEY',
        explanation: 'All records match with 99% AI confidence.',
      },
    ],
  },
  {
    id: 'DEO-2026-407',
    citizenName: 'Devender Rao Kulkarni',
    citizenPhone: '+91 98480 77123',
    citizenEmail: 'devender.kulkarni@example.com',
    documentType: 'Registered Sale Deed',
    submissionDate: '2026-09-07T11:45:00Z',
    status: 'API_FAILURE_MANUAL_ENTRY',
    priority: 'MEDIUM',
    riskScore: 55,
    confidenceCategory: 'MEDIUM',
    fileName: 'Sale_Deed_Shamirpet_512.pdf',
    fileSize: 4890000,
    documentUrl: 'https://bhooraksha.gov.in/docs/sample_deed.pdf',
    govtApiStatus: 'failed',
    documentsDossier: [
      {
        id: 'DOC-407-1',
        name: 'Sale_Deed_Shamirpet_512.pdf',
        type: 'Registered Sale Deed',
        status: 'PROCESSED',
        pagesCount: 4,
        size: '4.8 MB',
        confidence: 96,
        uploadTimestamp: '2026-09-07T11:30:00Z',
      },
      {
        id: 'DOC-407-2',
        name: 'Aadhaar_Devender_Masked.pdf',
        type: 'Identity Proof (Masked)',
        status: 'PROCESSED',
        pagesCount: 1,
        size: '480 KB',
        confidence: 99,
        uploadTimestamp: '2026-09-07T11:32:00Z',
      },
      {
        id: 'DOC-407-3',
        name: 'Physical_Pattadar_Passbook_Extract.pdf',
        type: 'RoR / Pattadar Record (1-B)',
        status: 'PROCESSED',
        pagesCount: 2,
        size: '1.9 MB',
        confidence: 91,
        uploadTimestamp: '2026-09-07T11:35:00Z',
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Registered Deed', status: 'COMPLETE', docType: 'SD-2025-512' },
      { key: 'identity', label: 'Identity Proof (Aadhaar)', status: 'COMPLETE', docType: 'UIDAI Verified' },
      { key: 'ror', label: 'Physical 1B Extract', status: 'COMPLETE', docType: 'KH-9182' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Medchal-Malkajgiri',
        taluk: 'Shamirpet',
        village: 'Aliabad',
        surveyNumber: '512/2',
        ulpin: 'ULPIN-36-MM-SHA-512-02',
        meta: {
          surveyNumber: { value: '512/2', confidence: 98, sourceDoc: 'Sale Deed #SD-2025-512', isAutoVerified: true },
          village: { value: 'Aliabad', confidence: 99, sourceDoc: 'Sale Deed #SD-2025-512', isAutoVerified: true },
          district: { value: 'Medchal-Malkajgiri', confidence: 99, sourceDoc: 'Sale Deed #SD-2025-512', isAutoVerified: true },
        },
      },
      ownerDetails: {
        name: 'Devender Rao',
        fatherOrSpouse: 'Gopal Rao Kulkarni',
        share: '100% Sole Ownership',
        previousOwner: 'K. Balakrishnaiah',
        panOrAadhaarLast4: '7123',
        maskedAadhaar: 'XXXX XXXX 7123',
        meta: {
          name: { value: 'Devender Rao', confidence: 89, sourceDoc: 'Sale Deed #SD-2025-512', isAutoVerified: false },
          fatherOrSpouse: { value: 'Gopal Rao Kulkarni', confidence: 96, sourceDoc: 'Sale Deed #SD-2025-512', isAutoVerified: true },
        },
      },
      landDetails: {
        area: 3.2,
        unit: 'Acres',
        landType: 'Agricultural Dry (Metta)',
        usage: 'Agriculture / Mango Orchard',
        boundaries: {
          north: 'Survey 511 Grama Panchayat Road',
          south: 'Survey 513 Natural Stream',
          east: 'Survey 512/1 Land of M. Yadaiah',
          west: 'Survey 510 Forest Boundary',
        },
        meta: {
          area: { value: 3.2, confidence: 97, sourceDoc: 'Sale Deed Schedule', isAutoVerified: true },
        },
      },
      documentDetails: {
        type: 'Registered Sale Deed',
        number: 'SD-2025-512',
        registrationNumber: 'REG-2025-9921',
        registrationDate: '2025-11-28',
        issuingAuthority: 'Sub-Registrar Office, Shamirpet',
        mutationNumber: 'MUT-2026-0412',
        meta: {
          number: { value: 'SD-2025-512', confidence: 99, sourceDoc: 'Sale Deed Stamp', isAutoVerified: true },
        },
      },
    },
    validationResults: [
      {
        field: 'State Land Records API Gateway',
        documentValue: 'Extracted from Uploaded Dossier',
        govtValue: 'HTTP 503 Service Unavailable / Master Record Offline',
        status: 'MISMATCH',
        category: 'REGISTRATION',
        explanation: 'State Land Records API unavailable. Manual fallback required to confirm records from physical ROR register.',
      },
    ],
  },
];

const INITIAL_VERIFIERS: Verifier[] = [
  {
    id: 'VER-01',
    name: 'K. S. Narayana Murthy',
    designation: 'Senior Girdawar (Revenue Inspector)',
    district: 'Ranga Reddy',
    mandal: 'Serilingampally',
    activeQueueCount: 8,
  },
  {
    id: 'VER-02',
    name: 'Anand V. Reddy',
    designation: 'Deputy Tahsildar / Designated Verifier',
    district: 'Ranga Reddy',
    mandal: 'Rajendranagar',
    activeQueueCount: 4,
  },
  {
    id: 'VER-03',
    name: 'P. V. Ramana Rao',
    designation: 'Revenue Inspector (Checker)',
    district: 'Ranga Reddy',
    mandal: 'Shamshabad',
    activeQueueCount: 11,
  },
  {
    id: 'VER-04',
    name: 'Smt. Lakshmi Bai',
    designation: 'Senior Revenue Verifier',
    district: 'Ranga Reddy',
    mandal: 'Gandipet',
    activeQueueCount: 6,
  },
];

const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'HIST-101',
    applicationId: 'DEO-2026-398',
    citizenName: 'Mohd. Abdul Qadeer',
    surveyNumber: '55/P, Kondapur',
    action: 'ROUTED_TO_VERIFIER',
    targetOfficer: 'K. S. Narayana Murthy (Girdawar)',
    remarks: 'Cross-checked with SRO registration index. All boundaries tally with village survey map.',
    timestamp: '2026-09-07T07:15:00Z',
    priority: 'MEDIUM',
  },
  {
    id: 'HIST-102',
    applicationId: 'DEO-2026-399',
    citizenName: 'G. Srinivas Rao',
    surveyNumber: '17/2, Hafeezpet',
    action: 'MANUAL_ENTRY_SAVED',
    targetOfficer: 'Anand V. Reddy (Deputy Tahsildar)',
    remarks: 'API gateway failed; manual transcription executed from verified 1B register extract.',
    timestamp: '2026-09-07T08:45:00Z',
    priority: 'HIGH',
  },
  {
    id: 'HIST-103',
    applicationId: 'DEO-2026-400',
    citizenName: 'Sunita Devi Sharma',
    surveyNumber: '190/A, Chandanagar',
    action: 'CORRECTION_REQUIRED',
    remarks: 'Illegible schedule boundary page in scanned deed. Requested 300 DPI rescan.',
    timestamp: '2026-09-07T09:30:00Z',
    priority: 'HIGH',
  },
];

export const useDEOStore = create<DEOState>()(
  persist(
    (set, get) => ({
      applications: INITIAL_APPLICATIONS,
      verifiers: INITIAL_VERIFIERS,
      history: INITIAL_HISTORY,
      reviewedTodayCount: 14,
      sentToVerifierCount: 11,

      saveCorrections: (applicationId, remarks) => {
        set((state) => {
          const app = state.applications.find((a) => a.id === applicationId);
          if (!app) return state;

          const newHistory: HistoryRecord = {
            id: `HIST-${Date.now()}`,
            applicationId,
            citizenName: app.citizenName,
            surveyNumber: app.extractedData.propertyDetails.surveyNumber,
            action: 'CORRECTIONS_SAVED',
            remarks: remarks || 'DEO saved field corrections to database. Application retained in DEO Maker review queue.',
            timestamp: new Date().toISOString(),
            priority: app.priority,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === applicationId
                ? {
                    ...a,
                    remarks: remarks || a.remarks || 'DEO corrections saved.',
                  }
                : a
            ),
            history: [newHistory, ...state.history],
          };
        });
      },

      forwardApplication: (id, verifierId, remarks) => {
        const verifier = get().verifiers.find((v) => v.id === verifierId);
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const newHistory: HistoryRecord = {
            id: `HIST-${Date.now()}`,
            applicationId: id,
            citizenName: app.citizenName,
            surveyNumber: app.extractedData.propertyDetails.surveyNumber,
            action: 'ROUTED_TO_VERIFIER',
            targetOfficer: verifier ? `${verifier.name} (${verifier.designation})` : verifierId,
            remarks: remarks || 'Verified against original revenue records. Approved and forwarded to Revenue Verifier.',
            timestamp: new Date().toISOString(),
            priority: app.priority,
          };

          // Synchronize with Verifier Store in localStorage if available
          try {
            const rawVerifierStore = localStorage.getItem('bhooraksha_verifier_store');
            if (rawVerifierStore) {
              const parsed = JSON.parse(rawVerifierStore);
              if (parsed?.state?.applications) {
                const targetVerifierId = id.startsWith('VRF') ? id : `VRF-${id.slice(4)}`;
                const existingIndex = parsed.state.applications.findIndex(
                  (vApp: any) => vApp.id === id || vApp.id === targetVerifierId || vApp.id === 'VRF-2026-501'
                );

                const forwardActionItem = {
                  id: `ACT-${Date.now()}`,
                  action: 'DEO FORWARDED APPLICATION',
                  actor: 'Suresh G. Patil (DEO / Patwari Maker)',
                  role: 'Village Revenue Officer (DEO / Patwari)',
                  timestamp: new Date().toISOString(),
                  remarks: remarks || 'Deed verified against master records. Forwarded to Revenue Verifier.',
                  previousStatus: 'PENDING_DEO_REVIEW',
                  newStatus: 'pending_verification',
                  nextStage: 'VERIFIER REVIEW',
                  nextAssignedRole: 'REVENUE VERIFIER (GIRDAWAR)',
                  nextAssignedOfficer: verifier?.name || 'K. Venkat Rao (Senior Girdawar)',
                  versionNumber: (app.fieldCorrections?.length || 0) + 1,
                  auditHash: pseudoSha256(`${id}|forwarded|${Date.now()}`),
                  prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
                  reviewCycle: 1,
                };

                const latestExtractedData = {
                  propertyDetails: {
                    state: app.extractedData.propertyDetails.state,
                    district: app.extractedData.propertyDetails.district,
                    taluk: app.extractedData.propertyDetails.taluk,
                    village: app.extractedData.propertyDetails.village,
                    surveyNumber: app.extractedData.propertyDetails.surveyNumber,
                    ulpin: app.extractedData.propertyDetails.ulpin || 'ULPIN-36-RR-SER-123-01',
                  },
                  ownerDetails: {
                    name: app.extractedData.ownerDetails.name,
                    fatherName: app.extractedData.ownerDetails.fatherOrSpouse || 'Late Shankar Patel',
                    share: app.extractedData.ownerDetails.share || '100% Sole Ownership',
                    previousOwner: app.extractedData.ownerDetails.previousOwner || 'Suresh V. Rao',
                  },
                  landDetails: {
                    totalArea: String(app.extractedData.landDetails.area || '2.50'),
                    areaUnit: app.extractedData.landDetails.unit || 'Acres',
                    landType: app.extractedData.landDetails.landType || 'Commercial Plotted',
                    currentUsage: app.extractedData.landDetails.usage || 'Commercial Development',
                    boundaries: {
                      north: app.extractedData.landDetails.boundaries.north || 'Survey 122 Panchayat Cart Track',
                      south: app.extractedData.landDetails.boundaries.south || 'Survey 124 Canal Reserve',
                      east: app.extractedData.landDetails.boundaries.east || 'Minor Irrigation Nala Buffer',
                      west: app.extractedData.landDetails.boundaries.west || 'Survey 121 Private Agricultural Farm',
                    },
                  },
                  documentDetails: {
                    documentType: app.extractedData.documentDetails.type || app.documentType,
                    documentNumber: app.extractedData.documentDetails.number || 'SD-2025-045',
                    registrationNumber: app.extractedData.documentDetails.registrationNumber || 'REG-2025-789',
                    registrationDate: app.extractedData.documentDetails.registrationDate || '2025-12-20',
                    issuingAuthority: app.extractedData.documentDetails.issuingAuthority || 'Sub-Registrar Office, Serilingampally (0411)',
                    mutationNumber: app.extractedData.documentDetails.mutationNumber || 'MUT-2026-0091',
                  },
                };

                if (existingIndex >= 0) {
                  const existingApp = parsed.state.applications[existingIndex];
                  parsed.state.applications[existingIndex] = {
                    ...existingApp,
                    citizenName: app.extractedData.ownerDetails.name || app.citizenName,
                    surveyNumber: app.extractedData.propertyDetails.surveyNumber,
                    status: 'pending_verification',
                    currentStatus: 'pending_verification',
                    extractedData: latestExtractedData,
                    actionHistory: [
                      forwardActionItem,
                      ...(existingApp.actionHistory || [])
                    ],
                  };
                } else {
                  parsed.state.applications.unshift({
                    id: targetVerifierId,
                    citizenName: app.extractedData.ownerDetails.name || app.citizenName,
                    citizenPhone: app.citizenPhone,
                    citizenEmail: app.citizenEmail || 'citizen@applicant.gov.in',
                    surveyNumber: app.extractedData.propertyDetails.surveyNumber,
                    documentType: app.documentType,
                    documentUrl: app.documentUrl || '/documents/sample_deed.pdf',
                    status: 'pending_verification',
                    currentStatus: 'pending_verification',
                    previousStatus: 'under_verifier_review',
                    currentStage: 'VERIFIER REVIEW',
                    assignedOfficer: verifier?.name || 'K. Venkat Rao',
                    assignedRole: verifier?.designation || 'Senior Girdawar (Revenue Inspector)',
                    nextAssignedRole: 'REVENUE ADMIN / TAHSILDAR',
                    nextAssignedOfficer: 'Smt. K. Sujatha (Tahsildar & Executive Magistrate)',
                    versionNumber: 2,
                    auditHash: pseudoSha256(`${id}|${Date.now()}`),
                    reviewCycleNumber: 1,
                    actionHistory: [forwardActionItem],
                    extractedData: latestExtractedData,
                    verificationCompleteness: {
                      documents: true,
                      aiExtraction: true,
                      crossDocumentValidation: true,
                      gisValidation: true,
                      legalEncumbranceCheck: true,
                      govtRecord: true,
                      previousTransactionHistory: true,
                      notesSaved: true,
                    },
                  });
                }
                localStorage.setItem('bhooraksha_verifier_store', JSON.stringify(parsed));
              }
            }
          } catch {
            // Ignore storage cross-sync error if running isolated
          }

          return {
            applications: state.applications.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: 'ROUTED_TO_VERIFIER',
                    assignedVerifierId: verifierId,
                    remarks: remarks || a.remarks,
                  }
                : a
            ),
            history: [newHistory, ...state.history],
            reviewedTodayCount: state.reviewedTodayCount + 1,
            sentToVerifierCount: state.sentToVerifierCount + 1,
          };
        });
      },

      flagCorrection: (id, reason, remarks) => {
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const newHistory: HistoryRecord = {
            id: `HIST-${Date.now()}`,
            applicationId: id,
            citizenName: app.citizenName,
            surveyNumber: app.extractedData.propertyDetails.surveyNumber,
            action: 'CORRECTION_REQUIRED',
            remarks: `Correction Flagged: ${reason}. ${remarks || ''}`,
            timestamp: new Date().toISOString(),
            priority: app.priority,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: 'CORRECTION_REQUIRED',
                    remarks: `[Correction: ${reason}] ${remarks || ''}`,
                  }
                : a
            ),
            history: [newHistory, ...state.history],
            reviewedTodayCount: state.reviewedTodayCount + 1,
          };
        });
      },

      correctField: (applicationId, section, fieldKey, newValue, reason, sourceDoc = 'Registered Sale Deed') => {
        set((state) => {
          const app = state.applications.find((a) => a.id === applicationId);
          if (!app) return state;

          const sectionObj = (app.extractedData as any)[section];
          const oldVal = sectionObj ? sectionObj[fieldKey] : '';
          const metaObj = sectionObj?.meta?.[fieldKey] || {};

          const digest = pseudoSha256(`${applicationId}|${section}.${fieldKey}|${oldVal}|${newValue}|${Date.now()}`);
          const formattedTimestamp = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          const correctionRecord: FieldCorrectionRecord = {
            id: `CORR-${Date.now()}`,
            applicationId,
            field: `${section}.${fieldKey}`,
            fieldLabel: fieldKey.replace(/([A-Z])/g, ' $1').toUpperCase(),
            oldValue: String(oldVal),
            newValue: String(newValue),
            originalAiValue: String(oldVal),
            correctedValue: String(newValue),
            officerId: 'DEO-TG-5501',
            officer: 'Suresh G. Patil (Senior DEO / Patwari)',
            officerName: 'Suresh G. Patil',
            timestamp: formattedTimestamp,
            isoTimestamp: new Date().toISOString(),
            reason: reason || 'Corrected according to registered deed',
            sourceDoc,
            sha256Digest: digest,
          };

          const updatedSection = {
            ...sectionObj,
            [fieldKey]: newValue,
            meta: {
              ...(sectionObj?.meta || {}),
              [fieldKey]: {
                ...metaObj,
                value: newValue,
                isCorrected: true,
                isAutoVerified: false,
                originalAiValue: oldVal,
                correctedBy: 'Suresh G. Patil (Senior DEO / Patwari)',
                correctionReason: reason || 'Corrected according to registered deed',
                correctionTimestamp: new Date().toISOString(),
              },
            },
          };

          // If owner name was corrected, also update citizenName
          const updatedCitizenName =
            section === 'ownerDetails' && fieldKey === 'name' ? String(newValue) : app.citizenName;

          // With exception corrected, calculate upgraded risk score (e.g. 82/100 -> LOW RISK -> READY_TO_FORWARD)
          const newRiskScore = Math.max(82, app.riskScore >= 75 ? app.riskScore : 82);
          const classification = classifyRisk(newRiskScore);

          // Update validation results if owner name is reconciled
          const updatedValidation = (app.validationResults || []).map((vr) => {
            if (section === 'ownerDetails' && fieldKey === 'name' && (vr.field.toLowerCase().includes('owner') || vr.category === 'OWNER')) {
              return {
                ...vr,
                documentValue: String(newValue),
                status: 'MATCH' as const,
                explanation: `Verified and corrected by DEO (${formattedTimestamp}) according to registered deed. Matches state registry.`,
              };
            }
            return vr;
          });

          const newHistory: HistoryRecord = {
            id: `HIST-${Date.now()}`,
            applicationId,
            citizenName: updatedCitizenName,
            surveyNumber: app.extractedData.propertyDetails.surveyNumber,
            action: 'FIELD_CORRECTED',
            remarks: `Field "${fieldKey}" corrected: "${oldVal}" → "${newValue}". Reason: ${reason} (Officer: Suresh G. Patil, ${formattedTimestamp})`,
            timestamp: new Date().toISOString(),
            priority: classification.priority,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === applicationId
                ? {
                    ...a,
                    citizenName: updatedCitizenName,
                    riskScore: newRiskScore,
                    priority: classification.priority,
                    status: classification.status,
                    confidenceCategory: 'HIGH',
                    extractedData: {
                      ...a.extractedData,
                      [section]: updatedSection,
                    },
                    validationResults: updatedValidation,
                    fieldCorrections: [correctionRecord, ...(a.fieldCorrections || [])],
                  }
                : a
            ),
            history: [newHistory, ...state.history],
          };
        });
      },

      requestMissingDocument: (applicationId, docType, remarks) => {
        set((state) => {
          const app = state.applications.find((a) => a.id === applicationId);
          if (!app) return state;

          const classification = classifyRisk(45); // < 50 => HIGH RISK / MISSING_DOCUMENTS

          const newHistory: HistoryRecord = {
            id: `HIST-${Date.now()}`,
            applicationId,
            citizenName: app.citizenName,
            surveyNumber: app.extractedData.propertyDetails.surveyNumber,
            action: 'CORRECTION_REQUIRED',
            remarks: `Missing Document Request: ${docType}. ${remarks || ''}`,
            timestamp: new Date().toISOString(),
            priority: classification.priority,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === applicationId
                ? {
                    ...a,
                    riskScore: Math.min(a.riskScore, 45),
                    priority: classification.priority,
                    status: classification.status,
                    remarks: `Missing document requested: ${docType}. ${remarks || ''}`,
                    completenessCheck: (a.completenessCheck || []).map((c) =>
                      c.label.toLowerCase().includes(docType.toLowerCase())
                        ? { ...c, status: 'MISSING', details: 'Notice sent to citizen' }
                        : c
                    ),
                  }
                : a
            ),
            history: [newHistory, ...state.history],
          };
        });
      },

      bulkIngestApplications: (newApps) => {
        set((state) => {
          const bulkHistory: HistoryRecord = {
            id: `HIST-${Date.now()}`,
            applicationId: `BATCH-${Date.now().toString().slice(-4)}`,
            citizenName: `${newApps.length} Ingested Packets`,
            surveyNumber: 'Multiple Mandals',
            action: 'BULK_INGESTED',
            remarks: `Bulk ingestion completed: ${newApps.length} application dossiers created from AI document OCR stream.`,
            timestamp: new Date().toISOString(),
            priority: 'MEDIUM',
          };

          return {
            applications: [...newApps, ...state.applications],
            history: [bulkHistory, ...state.history],
          };
        });
      },

      saveManualEntry: (id, data) => {
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const formattedTimestamp = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          // Compute field corrections for audit history
          const newCorrections: FieldCorrectionRecord[] = [];
          const checkAndAdd = (fieldKey: string, label: string, oldVal: any, newVal: any, section: string) => {
            if (newVal !== undefined && String(oldVal ?? '').trim() !== String(newVal ?? '').trim()) {
              newCorrections.push({
                id: `CORR-${Date.now()}-${fieldKey}`,
                applicationId: id,
                field: `${section}.${fieldKey}`,
                fieldLabel: label,
                oldValue: String(oldVal ?? ''),
                newValue: String(newVal ?? ''),
                originalAiValue: String(oldVal ?? ''),
                correctedValue: String(newVal ?? ''),
                officerId: 'DEO-TG-5501',
                officer: 'Suresh G. Patil (Senior DEO / Patwari)',
                officerName: 'Suresh G. Patil',
                timestamp: formattedTimestamp,
                isoTimestamp: new Date().toISOString(),
                reason: 'Manual transcription & verification against physical revenue records / API fallback',
                sourceDoc: 'Physical Land Record / Deed',
                sha256Digest: pseudoSha256(`${id}|${fieldKey}|${oldVal}|${newVal}|${Date.now()}`),
              });
            }
          };

          checkAndAdd('state', 'State', app.extractedData.propertyDetails.state, data.state, 'propertyDetails');
          checkAndAdd('district', 'District', app.extractedData.propertyDetails.district, data.district, 'propertyDetails');
          checkAndAdd('taluk', 'Taluk / Mandal', app.extractedData.propertyDetails.taluk, data.taluk, 'propertyDetails');
          checkAndAdd('village', 'Village / Ward', app.extractedData.propertyDetails.village, data.village, 'propertyDetails');
          checkAndAdd('surveyNumber', 'Survey Number', app.extractedData.propertyDetails.surveyNumber, data.surveyNumber, 'propertyDetails');
          checkAndAdd('ulpin', 'ULPIN Code', app.extractedData.propertyDetails.ulpin, data.ulpin, 'propertyDetails');
          checkAndAdd('name', 'Owner / Claimant Full Name', app.extractedData.ownerDetails.name, data.ownerName, 'ownerDetails');
          checkAndAdd('fatherOrSpouse', 'Father / Spouse Name', app.extractedData.ownerDetails.fatherOrSpouse, data.fatherName, 'ownerDetails');
          checkAndAdd('share', 'Ownership Share', app.extractedData.ownerDetails.share, data.share, 'ownerDetails');
          checkAndAdd('previousOwner', 'Previous Title Holder / Vendor', app.extractedData.ownerDetails.previousOwner, data.previousOwner, 'ownerDetails');
          checkAndAdd('area', 'Total Area Extent', app.extractedData.landDetails.area, data.area, 'landDetails');
          checkAndAdd('unit', 'Measurement Unit', app.extractedData.landDetails.unit, data.areaUnit, 'landDetails');
          checkAndAdd('landType', 'Land Classification', app.extractedData.landDetails.landType, data.landType, 'landDetails');
          checkAndAdd('usage', 'Current Usage', app.extractedData.landDetails.usage, data.currentUsage, 'landDetails');
          checkAndAdd('north', 'North Boundary', app.extractedData.landDetails.boundaries.north, data.boundaryNorth, 'landDetails.boundaries');
          checkAndAdd('south', 'South Boundary', app.extractedData.landDetails.boundaries.south, data.boundarySouth, 'landDetails.boundaries');
          checkAndAdd('east', 'East Boundary', app.extractedData.landDetails.boundaries.east, data.boundaryEast, 'landDetails.boundaries');
          checkAndAdd('west', 'West Boundary', app.extractedData.landDetails.boundaries.west, data.boundaryWest, 'landDetails.boundaries');
          checkAndAdd('type', 'Instrument / Deed Type', app.extractedData.documentDetails.type, data.documentType, 'documentDetails');
          checkAndAdd('number', 'Document / Deed Number', app.extractedData.documentDetails.number, data.documentNumber, 'documentDetails');
          checkAndAdd('registrationNumber', 'Book / SRO Registration Number', app.extractedData.documentDetails.registrationNumber, data.registrationNumber, 'documentDetails');
          checkAndAdd('registrationDate', 'Registration Date', app.extractedData.documentDetails.registrationDate, data.registrationDate, 'documentDetails');
          checkAndAdd('issuingAuthority', 'Sub-Registrar Office', app.extractedData.documentDetails.issuingAuthority, data.issuingAuthority, 'documentDetails');
          checkAndAdd('mutationNumber', 'Previous Mutation Proceeding Number', app.extractedData.documentDetails.mutationNumber, data.mutationNumber, 'documentDetails');

          const updatedExtractedData = {
            propertyDetails: {
              ...app.extractedData.propertyDetails,
              state: data.state || app.extractedData.propertyDetails.state,
              district: data.district || app.extractedData.propertyDetails.district,
              taluk: data.taluk || app.extractedData.propertyDetails.taluk,
              village: data.village || app.extractedData.propertyDetails.village,
              surveyNumber: data.surveyNumber || app.extractedData.propertyDetails.surveyNumber,
              ulpin: data.ulpin || app.extractedData.propertyDetails.ulpin,
            },
            ownerDetails: {
              ...app.extractedData.ownerDetails,
              name: data.ownerName || app.extractedData.ownerDetails.name,
              fatherOrSpouse: data.fatherName || app.extractedData.ownerDetails.fatherOrSpouse,
              share: data.share || app.extractedData.ownerDetails.share,
              previousOwner: data.previousOwner || app.extractedData.ownerDetails.previousOwner,
            },
            landDetails: {
              ...app.extractedData.landDetails,
              area: Number(data.area) || app.extractedData.landDetails.area,
              unit: data.areaUnit || app.extractedData.landDetails.unit,
              landType: data.landType || app.extractedData.landDetails.landType,
              usage: data.currentUsage || app.extractedData.landDetails.usage,
              boundaries: {
                north: data.boundaryNorth || app.extractedData.landDetails.boundaries.north,
                south: data.boundarySouth || app.extractedData.landDetails.boundaries.south,
                east: data.boundaryEast || app.extractedData.landDetails.boundaries.east,
                west: data.boundaryWest || app.extractedData.landDetails.boundaries.west,
              },
            },
            documentDetails: {
              ...app.extractedData.documentDetails,
              type: data.documentType || app.extractedData.documentDetails.type,
              number: data.documentNumber || app.extractedData.documentDetails.number,
              registrationNumber: data.registrationNumber || app.extractedData.documentDetails.registrationNumber,
              registrationDate: data.registrationDate || app.extractedData.documentDetails.registrationDate,
              issuingAuthority: data.issuingAuthority || app.extractedData.documentDetails.issuingAuthority,
              mutationNumber: data.mutationNumber || app.extractedData.documentDetails.mutationNumber,
            },
          };

          const updatedGovtRecord = {
            propertyDetails: {
              state: data.state,
              district: data.district,
              taluk: data.taluk,
              village: data.village,
              surveyNumber: data.surveyNumber,
              ulpin: data.ulpin || app.extractedData.propertyDetails.ulpin,
            },
            ownerDetails: {
              name: data.ownerName,
              fatherOrSpouse: data.fatherName,
              share: data.share,
              previousOwner: data.previousOwner,
            },
            landDetails: {
              area: Number(data.area),
              unit: data.areaUnit,
              landType: data.landType,
              usage: data.currentUsage,
              boundaries: {
                north: data.boundaryNorth,
                south: data.boundarySouth,
                east: data.boundaryEast,
                west: data.boundaryWest,
              },
            },
            documentDetails: {
              type: data.documentType,
              number: data.documentNumber,
              registrationNumber: data.registrationNumber,
              registrationDate: data.registrationDate,
              issuingAuthority: data.issuingAuthority,
              mutationNumber: data.mutationNumber,
            },
            khataNumber: 'KH-MANUAL-VERIFIED',
            lastUpdated: new Date().toISOString().split('T')[0],
          };

          const newHistory: HistoryRecord = {
            id: `HIST-${Date.now()}`,
            applicationId: id,
            citizenName: data.ownerName || app.citizenName,
            surveyNumber: data.surveyNumber || app.extractedData.propertyDetails.surveyNumber,
            action: 'MANUAL_ENTRY_SAVED',
            remarks: `Manual record entry confirmed and saved by DEO (Suresh G. Patil). ${newCorrections.length} fields modified/confirmed against physical land record.`,
            timestamp: new Date().toISOString(),
            priority: 'LOW',
          };

          // Synchronize with Verifier Store if present
          try {
            const rawVerifierStore = localStorage.getItem('bhooraksha_verifier_store');
            if (rawVerifierStore) {
              const parsed = JSON.parse(rawVerifierStore);
              if (parsed?.state?.applications) {
                const targetVerifierId = id.startsWith('VRF') ? id : `VRF-${id.slice(4)}`;
                const existingIndex = parsed.state.applications.findIndex(
                  (vApp: any) => vApp.id === id || vApp.id === targetVerifierId
                );
                if (existingIndex >= 0) {
                  parsed.state.applications[existingIndex] = {
                    ...parsed.state.applications[existingIndex],
                    citizenName: data.ownerName,
                    surveyNumber: data.surveyNumber,
                    extractedData: updatedExtractedData,
                  };
                  localStorage.setItem('bhooraksha_verifier_store', JSON.stringify(parsed));
                }
              }
            }
          } catch {
            // Ignore
          }

          return {
            applications: state.applications.map((a) => {
              if (a.id !== id) return a;
              return {
                ...a,
                citizenName: data.ownerName || a.citizenName,
                govtApiStatus: 'available' as const,
                riskScore: 85,
                status: 'READY_TO_FORWARD' as const,
                priority: 'LOW' as const,
                confidenceCategory: 'HIGH' as const,
                extractedData: updatedExtractedData,
                govtRecord: updatedGovtRecord,
                fieldCorrections: [...newCorrections, ...(a.fieldCorrections || [])],
                validationResults: [
                  {
                    field: 'Manual Data Entry Verification',
                    documentValue: `${data.surveyNumber} (${data.area} ${data.areaUnit})`,
                    govtValue: `${data.surveyNumber} (${data.area} ${data.areaUnit})`,
                    status: 'MATCH' as const,
                    category: 'SURVEY' as const,
                    explanation: 'DEO manual verification against physical register extract recorded with full audit trail.',
                  },
                ],
              };
            }),
            history: [newHistory, ...state.history],
            reviewedTodayCount: state.reviewedTodayCount + 1,
          };
        });
      },

      requestLegalReview: (id, remarks) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status: 'LEGAL_REVIEW', remarks: remarks || 'Legal scrutiny requested' } : a
          ),
        }));
      },

      requestGisReview: (id, remarks) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status: 'GIS_REVIEW', remarks: remarks || 'GIS boundary verification requested' } : a
          ),
        }));
      },

      batchApprove: (ids, remarks) => {
        const defaultVerifier = get().verifiers[0];
        ids.forEach((id) => {
          get().forwardApplication(id, defaultVerifier.id, remarks || 'Batch approved by DEO');
        });
      },

      batchCorrection: (ids, reason, remarks) => {
        ids.forEach((id) => {
          get().flagCorrection(id, reason, remarks || 'Batch flagged for correction');
        });
      },

      batchAssign: (ids, verifierId) => {
        ids.forEach((id) => {
          get().forwardApplication(id, verifierId, 'Batch forwarded to verifier');
        });
      },

      getStats: () => {
        const apps = get().applications;
        const readyToForward = apps.filter((a) => a.riskScore >= 75).length;
        const needsAttention = apps.filter((a) => a.riskScore >= 50 && a.riskScore < 75).length;
        const missingDocuments = apps.filter((a) => a.riskScore < 50).length;
        const apiFailures = apps.filter((a) => a.status === 'API_FAILURE_MANUAL_ENTRY' || a.govtApiStatus === 'failed').length;

        return {
          pending: needsAttention + missingDocuments,
          apiFailures,
          reviewedToday: get().reviewedTodayCount,
          sentToVerifier: get().sentToVerifierCount,
          readyToForward,
          needsAttention,
          criticalIssues: missingDocuments,
          missingDocuments,
        };
      },
    }),
    {
      name: 'bhooraksha_deo_store',
      onRehydrateStorage: () => (state) => {
        if (state?.applications) {
          state.applications = state.applications.map(sanitizeApplication);
        }
      },
    }
  )
);
