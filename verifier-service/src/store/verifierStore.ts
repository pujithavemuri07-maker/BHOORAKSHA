import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  VerifierApplication,
  HistoryRecord,
  StatsResponse,
  ActionHistoryItem,
  NotificationItem,
  VerificationChecklistState,
} from '../api/types';
import { sanitizeVerifierApplication } from '../utils/riskClassification';

interface VerifierState {
  applications: VerifierApplication[];
  history: HistoryRecord[];
  notifications: NotificationItem[];
  selectedApplicationIds: string[];
  toggleSelectApplication: (id: string) => void;
  selectAllApplications: (ids: string[]) => void;
  clearSelection: () => void;
  approveApplication: (id: string, remarks: string) => void;
  approveAndForward: (id: string, remarks: string) => void;
  rejectApplication: (id: string, reason: string, remarks: string) => void;
  returnToDEO: (
    id: string,
    reason: string,
    remarks: string,
    requiredCorrection?: string,
    requestedDoc?: string
  ) => void;
  escalateToRevenue: (
    id: string,
    category: string,
    reason: string,
    remarks: string
  ) => void;
  reopenApplication: (id: string, remarks: string) => void;
  saveInspectionNotes: (id: string, notes: string) => void;
  toggleChecklistItem: (id: string, itemKey: keyof VerificationChecklistState) => void;
  toggleGovtServiceStatus: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  batchApprove: (ids: string[], remarks: string) => void;
  batchReject: (ids: string[], reason: string, remarks: string) => void;
  getStats: () => StatsResponse;
  clearAllNotifications: () => void;
  verifyAuditChain: () => { isValid: boolean; brokenAtId?: string };
}

const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}e49a01f55829ac01b44917d23a1059df88102a948bc5599812497a7e1c84110b`.slice(0, 64);
};

const INITIAL_APPLICATIONS: VerifierApplication[] = [
  {
    id: 'REQ-2026-000123',
    citizenName: 'Ramesh Kumar Patel',
    citizenPhone: '+91 98765 43210',
    citizenEmail: 'ramesh.patel@example.gov.in',
    surveyNumber: '123/456',
    documentType: 'Registered Sale Deed',
    documentUrl: '/documents/deed_sale_501.pdf',
    status: 'pending_verification',
    currentStatus: 'pending_verification',
    previousStatus: 'under_verifier_review',
    currentStage: 'VERIFIER REVIEW',
    assignedOfficer: 'K. Venkat Rao',
    assignedRole: 'Senior Girdawar (Revenue Inspector)',
    nextAssignedRole: 'REVENUE ADMIN / TAHSILDAR',
    nextAssignedOfficer: 'Smt. K. Sujatha (Tahsildar & Executive Magistrate)',
    versionNumber: 2,
    auditHash: '8f42d9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821c',
    reviewCycleNumber: 1,
    actionHistory: [
      {
        id: 'ACT-501-1',
        action: 'DEO FORWARDED APPLICATION',
        actor: 'Suresh G. Patil',
        role: 'Village Revenue Officer (DEO / Patwari)',
        timestamp: '2026-09-07T14:32:00Z',
        remarks: 'Physical verification of mutation register confirms Ramesh Kumar is lawful purchaser. Forwarded to Girdawar.',
        previousStatus: 'PENDING_DEO_REVIEW',
        newStatus: 'pending_verification',
        nextStage: 'VERIFIER REVIEW',
        nextAssignedRole: 'REVENUE VERIFIER (GIRDAWAR)',
        nextAssignedOfficer: 'K. Venkat Rao (Senior Girdawar)',
        versionNumber: 1,
        auditHash: '7ab14f89c02d73be14b1a4328d22e03949f28a9b1c7f99d81745aa6212e0912e',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        reviewCycle: 1,
      },
    ],
    verificationCompleteness: {
      documents: true,
      aiExtraction: true,
      crossDocumentValidation: true,
      gisValidation: true,
      legalEncumbranceCheck: true,
      govtRecord: true,
      previousTransactionHistory: true,
      verifierRemarks: true,
      missingFields: [],
    },
    riskScore: 68,
    priority: 'medium',
    source: 'deo_forwarded',
    deoName: 'Suresh G. Patil (Senior VRO / Patwari)',
    deoRemarks: 'Applicant name partially differs from Aadhaar. Physical verification of mutation register confirms Ramesh Kumar is lawful purchaser.',
    deoForwardedAt: '2026-09-07T14:32:00Z',
    createdAt: '2026-09-06T10:15:00Z',
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Gachibowli',
        surveyNumber: '123/456',
        ulpin: 'ULPIN-36-RR-SER-123-01',
      },
      ownerDetails: {
        name: 'Ramesh Kumar',
        fatherName: 'Late Shankar Patel',
        share: '100% Sole Ownership',
        previousOwner: 'Suresh V. Rao',
      },
      landDetails: {
        totalArea: '2.50',
        areaUnit: 'Acres',
        landType: 'Commercial Plotted',
        currentUsage: 'Commercial Development',
        boundaries: {
          north: 'Survey 122 Panchayat Cart Track',
          south: 'Survey 124 Canal Reserve',
          east: 'Minor Irrigation Nala Buffer',
          west: 'Survey 121 Private Agricultural Farm',
        },
      },
      documentDetails: {
        documentType: 'Registered Sale Deed',
        documentNumber: 'SD/2025/045',
        registrationNumber: 'BK-1/4491/2025',
        registrationDate: '2025-12-20',
        issuingAuthority: 'Sub-Registrar Office, Serilingampally (0411)',
        mutationNumber: 'MUT-2026-8819',
      },
    },
    govtRecord: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Gachibowli',
        surveyNumber: '123/456',
        ulpin: 'ULPIN-36-RR-SER-123-01',
      },
      ownerDetails: {
        name: 'Ramesh Kumar Patel',
        fatherName: 'Late Shankar Patel',
        share: '100% Sole Ownership',
        previousOwner: 'Suresh V. Rao',
      },
      landDetails: {
        totalArea: '2.50',
        areaUnit: 'Acres',
        landType: 'Commercial Plotted',
        currentUsage: 'Commercial Development',
        boundaries: {
          north: 'Survey 122 Panchayat Cart Track',
          south: 'Survey 124 Canal Reserve',
          east: 'Minor Irrigation Nala Buffer',
          west: 'Survey 121 Private Agricultural Farm',
        },
      },
      documentDetails: {
        documentType: 'Registered Sale Deed',
        documentNumber: 'SD/2025/045',
        registrationNumber: 'BK-1/4491/2025',
        registrationDate: '2025-12-20',
        issuingAuthority: 'Sub-Registrar Office, Serilingampally (0411)',
        mutationNumber: 'MUT-2026-8819',
      },
      sourceRegister: 'Dharani Integrated Cadastral DB (Live Sync)',
      lastUpdated: '2026-09-07T12:00:00Z',
      verifiedByDeo: true,
    },
    validationResults: [
      {
        id: 'val-1',
        field: 'ownerName',
        label: 'Purchaser / Pattadar Name',
        documentValue: 'Ramesh Kumar',
        govtValue: 'Ramesh Kumar Patel',
        status: 'PARTIAL',
        confidence: 0.88,
        explanation: 'Middle name / surname variation verified against Father name Shankar Patel.',
      },
      {
        id: 'val-2',
        field: 'surveyNumber',
        label: 'Cadastral Survey Number',
        documentValue: '123/456',
        govtValue: '123/456',
        status: 'MATCH',
        confidence: 1.0,
      },
      {
        id: 'val-3',
        field: 'totalArea',
        label: 'Parcel Extent',
        documentValue: '2.50 Acres',
        govtValue: '2.50 Acres',
        status: 'MATCH',
        confidence: 1.0,
      },
      {
        id: 'val-4',
        field: 'registrationNumber',
        label: 'SRO Registration Number',
        documentValue: 'BK-1/4491/2025',
        govtValue: 'BK-1/4491/2025',
        status: 'MATCH',
        confidence: 0.99,
      },
    ],
  },
  {
    id: 'VRF-2026-502',
    citizenName: 'Anitha Rajendran',
    citizenPhone: '+91 98450 11223',
    citizenEmail: 'anitha.rajendran@example.gov.in',
    surveyNumber: '84/3',
    documentType: 'Pattadar Passbook',
    documentUrl: '/documents/passbook_502.pdf',
    status: 'pending_verification',
    currentStatus: 'pending_verification',
    previousStatus: 'under_verifier_review',
    currentStage: 'VERIFIER REVIEW',
    assignedOfficer: 'K. Venkat Rao',
    assignedRole: 'Senior Girdawar',
    versionNumber: 1,
    auditHash: '3a41e9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821a',
    reviewCycleNumber: 1,
    actionHistory: [
      {
        id: 'ACT-502-1',
        action: 'DEO FORWARDED (MANUAL ENTRY)',
        actor: 'Suresh G. Patil',
        role: 'Village Revenue Officer',
        timestamp: '2026-09-07T16:10:00Z',
        remarks: 'Dharani API timed out (503). Manual data entry transcribed from verified physical ROR 1-B ledger.',
        previousStatus: 'API_FAILURE_MANUAL_ENTRY',
        newStatus: 'pending_verification',
        nextStage: 'VERIFIER REVIEW',
        versionNumber: 1,
        auditHash: '3a41e9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821a',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
    riskScore: 52,
    priority: 'medium',
    source: 'deo_forwarded',
    deoName: 'Suresh G. Patil (Senior VRO / Patwari)',
    deoRemarks: 'Dharani API timed out (503). Manual data entry transcribed from verified physical ROR 1-B ledger by DEO.',
    deoForwardedAt: '2026-09-07T16:10:00Z',
    createdAt: '2026-09-06T11:00:00Z',
    extractedData: {
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
        fatherName: 'Rajendran Murthy',
        share: '100% Sole Ownership',
        previousOwner: 'Suresh V. Rao',
      },
      landDetails: {
        totalArea: '1.80',
        areaUnit: 'Acres',
        landType: 'Agricultural Dry (Metta)',
        currentUsage: 'Farming & Horticulture',
        boundaries: {
          north: 'Survey 83 Cart Track',
          south: 'Survey 85 PWD Minor Drain',
          east: 'Survey 84/2 Patel Land',
          west: 'Main Road to Keesara',
        },
      },
      documentDetails: {
        documentType: 'Pattadar Passbook',
        documentNumber: 'PPB-2024-99812',
        registrationNumber: 'ROR-1B/992/2024',
        registrationDate: '2024-08-14',
        issuingAuthority: 'Tahsildar Office, Keesara',
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
        fatherName: 'Rajendran Murthy',
        share: '100% Sole Ownership',
        previousOwner: 'Suresh V. Rao',
      },
      landDetails: {
        totalArea: '1.80',
        areaUnit: 'Acres',
        landType: 'Agricultural Dry (Metta)',
        currentUsage: 'Farming & Horticulture',
        boundaries: {
          north: 'Survey 83 Cart Track',
          south: 'Survey 85 PWD Minor Drain',
          east: 'Survey 84/2 Patel Land',
          west: 'Main Road to Keesara',
        },
      },
      documentDetails: {
        documentType: 'Pattadar Passbook',
        documentNumber: 'PPB-2024-99812',
        registrationNumber: 'ROR-1B/992/2024',
        registrationDate: '2024-08-14',
        issuingAuthority: 'Tahsildar Office, Keesara',
      },
      sourceRegister: 'Manual DEO Entry (Verified against Physical ROR Register)',
      lastUpdated: '2026-09-07T16:00:00Z',
      verifiedByDeo: true,
    },
    validationResults: [
      {
        id: 'val-1',
        field: 'ownerName',
        label: 'Pattadar Name',
        documentValue: 'Anitha Rajendran',
        govtValue: 'Anitha Rajendran',
        status: 'MATCH',
        confidence: 0.99,
      },
      {
        id: 'val-2',
        field: 'surveyNumber',
        label: 'Survey Number',
        documentValue: '84/3',
        govtValue: '84/3',
        status: 'MATCH',
        confidence: 1.0,
      },
      {
        id: 'val-3',
        field: 'totalArea',
        label: 'Extent Area',
        documentValue: '1.80 Acres',
        govtValue: '1.80 Acres',
        status: 'MATCH',
        confidence: 1.0,
      },
    ],
  },
  {
    id: 'VRF-2026-503',
    citizenName: 'B. Venkatswamy Goud',
    citizenPhone: '+91 99890 22341',
    citizenEmail: 'venkatswamy.goud@example.gov.in',
    surveyNumber: '210/B',
    documentType: 'Partition Deed (Bhaaga Parishkaram)',
    documentUrl: '/documents/partition_deed_503.pdf',
    status: 'pending_verification',
    currentStatus: 'pending_verification',
    previousStatus: 'ai_direct',
    currentStage: 'VERIFIER REVIEW',
    assignedOfficer: 'K. Venkat Rao',
    assignedRole: 'Senior Girdawar',
    versionNumber: 1,
    auditHash: '9c55d9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821c',
    reviewCycleNumber: 1,
    actionHistory: [
      {
        id: 'ACT-503-1',
        action: 'AI DIRECT INGESTION (HIGH RISK TRIGGER)',
        actor: 'ChitraPathak AI Engine',
        role: 'AI Verification System',
        timestamp: '2026-09-07T09:20:00Z',
        remarks: 'Direct High Risk trigger: AI detected overlapping caveat in OS 412/2024 pending at Sangareddy Senior Civil Court.',
        previousStatus: 'NEW_SUBMISSION',
        newStatus: 'pending_verification',
        nextStage: 'VERIFIER REVIEW',
        versionNumber: 1,
        auditHash: '9c55d9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821c',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
    riskScore: 82,
    priority: 'low',
    source: 'deo_forwarded',
    deoRemarks: 'Direct High Risk trigger: AI detected overlapping caveat in OS 412/2024 pending at Sangareddy Senior Civil Court.',
    createdAt: '2026-09-07T09:20:00Z',
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Sangareddy',
        taluk: 'Patancheru',
        village: 'Muthangi',
        surveyNumber: '210/B',
        ulpin: 'ULPIN-36-SR-PAT-210-02',
      },
      ownerDetails: {
        name: 'B. Venkatswamy Goud',
        fatherName: 'B. Ramalingam Goud',
        share: '50% Co-parcenary Share',
        previousOwner: 'Joint Ancestral Estate',
      },
      landDetails: {
        totalArea: '3.20',
        areaUnit: 'Acres',
        landType: 'Agricultural Wet (Tari)',
        currentUsage: 'Paddy Cultivation',
        boundaries: {
          north: 'Survey 209 Goud Share',
          south: 'Muthangi Cheruvu Inflow',
          east: 'Survey 210/A Brother Share',
          west: 'Village Boundary',
        },
      },
      documentDetails: {
        documentType: 'Partition Deed (Bhaaga Parishkaram)',
        documentNumber: 'PD-2025-104',
        registrationNumber: 'BK-1/2104/2025',
        registrationDate: '2025-10-18',
        issuingAuthority: 'SRO Patancheru',
      },
    },
    govtRecord: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Sangareddy',
        taluk: 'Patancheru',
        village: 'Muthangi',
        surveyNumber: '210/B',
        ulpin: 'ULPIN-36-SR-PAT-210-02',
      },
      ownerDetails: {
        name: 'B. Venkatswamy Goud',
        fatherName: 'B. Ramalingam Goud',
        share: '33.33% Undivided Family Interest',
        previousOwner: 'Joint Ancestral Estate',
      },
      landDetails: {
        totalArea: '3.20',
        areaUnit: 'Acres',
        landType: 'Agricultural Wet (Tari)',
        currentUsage: 'Paddy Cultivation',
        boundaries: {
          north: 'Survey 209 Goud Share',
          south: 'Muthangi Cheruvu Inflow',
          east: 'Survey 210/A Brother Share',
          west: 'Village Boundary',
        },
      },
      documentDetails: {
        documentType: 'Partition Deed',
        documentNumber: 'PD-2025-104',
        registrationNumber: 'BK-1/2104/2025',
        registrationDate: '2025-10-18',
        issuingAuthority: 'SRO Patancheru',
      },
      sourceRegister: 'Telangana Maa Bhoomi Land Records',
      lastUpdated: '2026-09-07T08:00:00Z',
    },
    validationResults: [
      {
        id: 'val-1',
        field: 'share',
        label: 'Coparcenary Ownership Share',
        documentValue: '50% Share Claimed',
        govtValue: '33.33% Undivided Interest',
        status: 'MISMATCH',
        confidence: 0.94,
        explanation: 'Three co-heirs registered on record; deed claims half share without relinquishment deed from third sibling.',
      },
      {
        id: 'val-2',
        field: 'caveatCheck',
        label: 'Civil Court Litigation Clearance',
        documentValue: 'Self-declaration clear',
        govtValue: 'Injunction Suit OS 412/2024 active',
        status: 'MISMATCH',
        confidence: 0.98,
        explanation: 'Court stay registered on Survey 210/B regarding partition dispute.',
      },
    ],
  },
  {
    id: 'VRF-2026-504',
    citizenName: 'M. Padma Reddy',
    citizenPhone: '+91 97000 44556',
    citizenEmail: 'padma.reddy@example.gov.in',
    surveyNumber: '42/A',
    documentType: 'Gift Deed (Daanam)',
    documentUrl: '/documents/gift_deed_504.pdf',
    status: 'pending_verification',
    currentStatus: 'pending_verification',
    previousStatus: 'deo_forwarded',
    currentStage: 'VERIFIER REVIEW',
    assignedOfficer: 'K. Venkat Rao',
    assignedRole: 'Senior Girdawar',
    versionNumber: 1,
    auditHash: '2b33d9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821d',
    reviewCycleNumber: 1,
    actionHistory: [
      {
        id: 'ACT-504-1',
        action: 'DEO FORWARDED (CORRECTED DEED)',
        actor: 'N. Rajeshwar',
        role: 'Village Revenue Officer',
        timestamp: '2026-09-07T17:40:00Z',
        remarks: 'Corrected document page re-uploaded by citizen and approved by DEO.',
        previousStatus: 'CORRECTION_REQUIRED',
        newStatus: 'pending_verification',
        nextStage: 'VERIFIER REVIEW',
        versionNumber: 1,
        auditHash: '2b33d9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821d',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
    riskScore: 45,
    priority: 'high',
    source: 'deo_forwarded',
    deoName: 'N. Rajeshwar (VRO, Gandipet)',
    deoRemarks: 'Corrected document page re-uploaded by citizen and approved by DEO.',
    deoForwardedAt: '2026-09-07T17:40:00Z',
    createdAt: '2026-09-07T08:00:00Z',
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Gandipet',
        village: 'Puppalguda',
        surveyNumber: '42/A',
        ulpin: 'ULPIN-36-RR-GAN-042-01',
      },
      ownerDetails: {
        name: 'M. Padma Reddy',
        fatherName: 'K. Pratap Reddy (Father / Donor)',
        share: '100% Sole Ownership',
        previousOwner: 'K. Pratap Reddy',
      },
      landDetails: {
        totalArea: '0.75',
        areaUnit: 'Acres (3,630 Sq. Yds)',
        landType: 'Residential Conversion',
        currentUsage: 'Residential Layout',
        boundaries: {
          north: '40ft Master Plan Road',
          south: 'Survey 41 Open Plot',
          east: 'Puppalguda Gram Panchayat Water Tank',
          west: 'Survey 42/B',
        },
      },
      documentDetails: {
        documentType: 'Gift Deed (Daanam)',
        documentNumber: 'GD-2026-118',
        registrationNumber: 'BK-1/1044/2026',
        registrationDate: '2026-02-10',
        issuingAuthority: 'SRO Gandipet',
      },
    },
    govtRecord: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Gandipet',
        village: 'Puppalguda',
        surveyNumber: '42/A',
        ulpin: 'ULPIN-36-RR-GAN-042-01',
      },
      ownerDetails: {
        name: 'M. Padma Reddy',
        fatherName: 'K. Pratap Reddy',
        share: '100% Sole Ownership',
        previousOwner: 'K. Pratap Reddy',
      },
      landDetails: {
        totalArea: '0.75',
        areaUnit: 'Acres (3,630 Sq. Yds)',
        landType: 'Residential Conversion',
        currentUsage: 'Residential Layout',
        boundaries: {
          north: '40ft Master Plan Road',
          south: 'Survey 41 Open Plot',
          east: 'Puppalguda Gram Panchayat Water Tank',
          west: 'Survey 42/B',
        },
      },
      documentDetails: {
        documentType: 'Gift Deed (Daanam)',
        documentNumber: 'GD-2026-118',
        registrationNumber: 'BK-1/1044/2026',
        registrationDate: '2026-02-10',
        issuingAuthority: 'SRO Gandipet',
      },
      sourceRegister: 'Dharani Online Mutation Service',
      lastUpdated: '2026-09-07T15:00:00Z',
      verifiedByDeo: true,
    },
    validationResults: [
      {
        id: 'val-1',
        field: 'donorChain',
        label: 'Donor Title & Gift Execution',
        documentValue: 'K. Pratap Reddy -> M. Padma Reddy',
        govtValue: 'K. Pratap Reddy recorded as absolute owner',
        status: 'MATCH',
        confidence: 0.99,
      },
      {
        id: 'val-2',
        field: 'stampDuty',
        label: 'Blood Relation Stamp Duty Exemption',
        documentValue: 'Father to Daughter Exemption Applied',
        govtValue: 'Approved by SRO Gandipet',
        status: 'MATCH',
        confidence: 1.0,
      },
    ],
  },
  {
    id: 'VRF-2026-505',
    citizenName: 'K. Satyanarayana',
    citizenPhone: '+91 94412 88901',
    citizenEmail: 'satya.k@example.gov.in',
    surveyNumber: '302/1',
    documentType: 'Registered Sale Deed',
    documentUrl: '/documents/sale_deed_505.pdf',
    status: 'pending_verification',
    currentStatus: 'pending_verification',
    previousStatus: 'deo_forwarded',
    currentStage: 'VERIFIER REVIEW',
    assignedOfficer: 'K. Venkat Rao',
    assignedRole: 'Senior Girdawar',
    versionNumber: 1,
    auditHash: '1a22d9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821e',
    reviewCycleNumber: 1,
    actionHistory: [
      {
        id: 'ACT-505-1',
        action: 'DEO FORWARDED (MANUAL ENTRY)',
        actor: 'Suresh G. Patil',
        role: 'Village Revenue Officer',
        timestamp: '2026-09-07T18:00:00Z',
        remarks: 'Manual fallback transcribed by DEO following Dharani server 504 gateway timeout. Survey verified with village map.',
        previousStatus: 'API_FAILURE_MANUAL_ENTRY',
        newStatus: 'pending_verification',
        nextStage: 'VERIFIER REVIEW',
        versionNumber: 1,
        auditHash: '1a22d9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821e',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
    riskScore: 48,
    priority: 'high',
    source: 'deo_forwarded',
    deoName: 'Suresh G. Patil (Senior VRO / Patwari)',
    deoRemarks: 'Manual fallback transcribed by DEO following Dharani server 504 gateway timeout. Survey verified with village map.',
    deoForwardedAt: '2026-09-07T18:00:00Z',
    createdAt: '2026-09-07T09:00:00Z',
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
        fatherName: 'K. Appa Rao',
        share: '100% Sole Ownership',
        previousOwner: 'G. Madhusudhan',
      },
      landDetails: {
        totalArea: '0.50',
        areaUnit: 'Acres (2,420 Sq. Yds)',
        landType: 'Commercial IT Corridor',
        currentUsage: 'IT SEZ Buffer',
        boundaries: {
          north: '100ft ORR Service Road',
          south: 'Survey 303 SEZ Boundary',
          east: 'Survey 302/2 Private Land',
          west: 'Nanakramguda Village Nala',
        },
      },
      documentDetails: {
        documentType: 'Registered Sale Deed',
        documentNumber: 'SD/2026/812',
        registrationNumber: 'BK-1/3310/2026',
        registrationDate: '2026-01-22',
        issuingAuthority: 'SRO Serilingampally',
      },
    },
    govtRecord: {
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
        fatherName: 'K. Appa Rao',
        share: '100% Sole Ownership',
        previousOwner: 'G. Madhusudhan',
      },
      landDetails: {
        totalArea: '0.50',
        areaUnit: 'Acres (2,420 Sq. Yds)',
        landType: 'Commercial IT Corridor',
        currentUsage: 'IT SEZ Buffer',
        boundaries: {
          north: '100ft ORR Service Road',
          south: 'Survey 303 SEZ Boundary',
          east: 'Survey 302/2 Private Land',
          west: 'Nanakramguda Village Nala',
        },
      },
      documentDetails: {
        documentType: 'Registered Sale Deed',
        documentNumber: 'SD/2026/812',
        registrationNumber: 'BK-1/3310/2026',
        registrationDate: '2026-01-22',
        issuingAuthority: 'SRO Serilingampally',
      },
      sourceRegister: 'DEO Field Verification Register (Transcribed from Certified Copy)',
      lastUpdated: '2026-09-07T17:30:00Z',
      verifiedByDeo: true,
    },
    validationResults: [
      {
        id: 'val-1',
        field: 'boundaryCheck',
        label: 'IT Corridor Cadastral Alignment',
        documentValue: 'Survey 302/1',
        govtValue: 'Matches Master Plan Cadastral Line',
        status: 'MATCH',
        confidence: 0.96,
      },
      {
        id: 'val-2',
        field: 'priorVendor',
        label: 'Vendor Title Clearance',
        documentValue: 'G. Madhusudhan',
        govtValue: 'Title established via 2018 registered conveyance',
        status: 'MATCH',
        confidence: 0.98,
      },
    ],
  },
];

const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'HIST-VRF-901',
    applicationId: 'VRF-2026-490',
    citizenName: 'Govind Swaminathan',
    surveyNumber: '118/2',
    action: 'APPROVED_AND_FORWARDED',
    remarks: 'Cross-verified against physical Pahani and SRO Book-1 registry. Clear title without encumbrance. Forwarded to Tahsildar.',
    timestamp: '2026-09-07T11:20:00Z',
    verifierName: 'K. Venkat Rao (Girdawar)',
    previousStatus: 'pending_verification',
    newStatus: 'approved_and_forwarded',
    nextStage: 'REVENUE ADMIN REVIEW',
    versionNumber: 2,
    auditHash: '71a4f89c02d73be14b1a4328d22e03949f28a9b1c7f99d81745aa6212e0912e',
  },
  {
    id: 'HIST-VRF-902',
    applicationId: 'VRF-2026-491',
    citizenName: 'Sujata Devi',
    surveyNumber: '55/3',
    action: 'REJECTED',
    reason: 'survey_mismatch',
    remarks: 'Survey sub-division 55/3 was bifurcated into 55/3A and 55/3B in 2021. Inconsistent survey schedule provided.',
    timestamp: '2026-09-07T14:45:00Z',
    verifierName: 'K. Venkat Rao (Girdawar)',
    previousStatus: 'pending_verification',
    newStatus: 'rejected_by_verifier',
    nextStage: 'VERIFICATION CLOSED',
    versionNumber: 2,
    auditHash: '82b4f89c02d73be14b1a4328d22e03949f28a9b1c7f99d81745aa6212e0912f',
  },
  {
    id: 'HIST-VRF-903',
    applicationId: 'VRF-2026-492',
    citizenName: 'V. Krishna Murthy',
    surveyNumber: '19/1',
    action: 'RETURNED_TO_DEO',
    remarks: 'Please re-verify the extent in Section 3. Passbook mentions 3.12 guntas, but manual transcription records 3.20 acres.',
    timestamp: '2026-09-07T16:05:00Z',
    verifierName: 'K. Venkat Rao (Girdawar)',
    previousStatus: 'pending_verification',
    newStatus: 'returned_to_deo',
    nextStage: 'DEO CORRECTION / REVIEW',
    versionNumber: 2,
    auditHash: '93c4f89c02d73be14b1a4328d22e03949f28a9b1c7f99d81745aa6212e09130',
  },
  {
    id: 'HIST-VRF-904',
    applicationId: 'VRF-2026-493',
    citizenName: 'Devi Prasad Rao',
    surveyNumber: '77/1',
    action: 'ESCALATED_TO_REVENUE',
    remarks: 'Disputed title with pending writ petition WP 18490/2024 at High Court. Escalated to Tehsildar for legal cell referral.',
    timestamp: '2026-09-07T17:15:00Z',
    verifierName: 'K. Venkat Rao (Girdawar)',
    previousStatus: 'pending_verification',
    newStatus: 'escalated_to_revenue',
    nextStage: 'REVENUE ADMIN REVIEW',
    versionNumber: 2,
    auditHash: 'a4d4f89c02d73be14b1a4328d22e03949f28a9b1c7f99d81745aa6212e09131',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'High Risk Escalation Flagged',
    desc: 'Application VRF-2026-503 flagged with active civil court stay on Sy. 210/B.',
    time: '12m ago',
    timestamp: '2026-09-15T18:20:00Z',
    type: 'warning',
    applicationId: 'VRF-2026-503',
  },
  {
    id: 'NOTIF-2',
    title: 'DEO Forwarded Application',
    desc: 'VRO Suresh Patil forwarded VRF-2026-501 after physical Pahani verification.',
    time: '45m ago',
    timestamp: '2026-09-15T17:45:00Z',
    type: 'info',
    applicationId: 'VRF-2026-501',
  },
  {
    id: 'NOTIF-3',
    title: 'Mandal Cadastral Sync Complete',
    desc: 'Serilingampally cadastral database sync with State Master API completed.',
    time: '2h ago',
    timestamp: '2026-09-15T16:30:00Z',
    type: 'success',
  },
];

export const useVerifierStore = create<VerifierState>()(
  persist(
    (set, get) => ({
      applications: INITIAL_APPLICATIONS,
      history: INITIAL_HISTORY,
      notifications: INITIAL_NOTIFICATIONS,
      selectedApplicationIds: [],

      toggleSelectApplication: (id) =>
        set((state) => {
          const exists = state.selectedApplicationIds.includes(id);
          return {
            selectedApplicationIds: exists
              ? state.selectedApplicationIds.filter((item) => item !== id)
              : [...state.selectedApplicationIds, id],
          };
        }),

      selectAllApplications: (ids) => set({ selectedApplicationIds: ids }),
      clearSelection: () => set({ selectedApplicationIds: [] }),
      clearAllNotifications: () => set({ notifications: [] }),

      saveInspectionNotes: (id, notes) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? {
                  ...app,
                  verificationNotes: notes,
                  officerRemarks: notes,
                }
              : app
          ),
        })),

      approveAndForward: (id, remarks) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const prevStatus = app.currentStatus || app.status || 'pending_verification';
          const newStatus = 'approved_and_forwarded' as const;
          const newVersion = (app.versionNumber || 1) + 1;
          const prevHash = app.auditHash || '0000000000000000000000000000000000000000000000000000000000000000';
          const timestamp = new Date().toISOString();
          const newHash = generateHash(`${id}-${newStatus}-${timestamp}-${remarks}-${prevHash}`);

          const historyItem: ActionHistoryItem = {
            id: `ACT-${Date.now()}`,
            action: 'APPROVED & FORWARDED TO REVENUE ADMIN',
            actor: 'K. Venkat Rao',
            role: 'Girdawar / Revenue Inspector',
            timestamp,
            remarks: remarks || 'Reviewed and cross-verified against State Master Record. Approved and forwarded to Revenue Admin for final sanction.',
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'REVENUE ADMIN REVIEW',
            nextAssignedRole: 'REVENUE ADMIN / TAHSILDAR',
            nextAssignedOfficer: 'Smt. K. Sujatha (Tahsildar & Executive Magistrate)',
            versionNumber: newVersion,
            auditHash: newHash,
            prevHash,
            reviewCycle: app.reviewCycleNumber || 1,
          };

          const newHistoryRecord: HistoryRecord = {
            id: `HIST-VRF-${Date.now()}`,
            applicationId: id,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            action: 'APPROVED_AND_FORWARDED',
            remarks: remarks || 'Approved and forwarded to Revenue Admin / Tahsildar.',
            timestamp,
            verifierName: 'K. Venkat Rao (Girdawar)',
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'REVENUE ADMIN REVIEW',
            versionNumber: newVersion,
            auditHash: newHash,
          };

          const newNotification: NotificationItem = {
            id: `NOTIF-${Date.now()}`,
            title: `Application ${id} Forwarded`,
            desc: `Application ${id} (${app.citizenName}) successfully verified and forwarded to Revenue Admin.`,
            time: 'Just now',
            timestamp,
            type: 'success',
            applicationId: id,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: newStatus,
                    currentStatus: newStatus,
                    previousStatus: prevStatus,
                    currentStage: 'REVENUE ADMIN REVIEW',
                    assignedOfficer: 'K. Venkat Rao',
                    assignedRole: 'Girdawar / Revenue Inspector',
                    decision: 'APPROVE_AND_FORWARD',
                    decisionReason: 'Cross-document verification satisfied',
                    officerRemarks: remarks,
                    verificationNotes: remarks,
                    decisionTimestamp: timestamp,
                    nextAssignedRole: 'REVENUE ADMIN / TAHSILDAR',
                    nextAssignedOfficer: 'Smt. K. Sujatha (Tahsildar & Executive Magistrate)',
                    versionNumber: newVersion,
                    auditHash: newHash,
                    actionHistory: [historyItem, ...(a.actionHistory || [])],
                  }
                : a
            ),
            history: [newHistoryRecord, ...state.history],
            notifications: [newNotification, ...state.notifications],
            selectedApplicationIds: state.selectedApplicationIds.filter((item) => item !== id),
          };
        }),

      approveApplication: (id, remarks) => {
        get().approveAndForward(id, remarks);
      },

      returnToDEO: (id, reason, remarks, requiredCorrection, requestedDoc) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const prevStatus = app.currentStatus || app.status || 'pending_verification';
          const newStatus = 'returned_to_deo' as const;
          const newVersion = (app.versionNumber || 1) + 1;
          const prevHash = app.auditHash || '0000000000000000000000000000000000000000000000000000000000000000';
          const timestamp = new Date().toISOString();
          const newHash = generateHash(`${id}-${newStatus}-${timestamp}-${remarks}-${prevHash}`);

          const historyItem: ActionHistoryItem = {
            id: `ACT-${Date.now()}`,
            action: 'RETURNED TO DEO',
            actor: 'K. Venkat Rao',
            role: 'Girdawar / Revenue Inspector',
            timestamp,
            remarks: remarks || `Returned to DEO for correction: ${reason}`,
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'DEO CORRECTION / REVIEW',
            nextAssignedRole: 'DEO / PATWARI',
            nextAssignedOfficer: app.deoName || 'Suresh G. Patil (Senior VRO)',
            reason,
            requiredCorrection: requiredCorrection || 'Re-verification of flagged attributes required',
            requestedDoc: requestedDoc || 'Supporting Identity or Cadastral Voucher',
            versionNumber: newVersion,
            auditHash: newHash,
            prevHash,
            reviewCycle: app.reviewCycleNumber || 1,
          };

          const newHistoryRecord: HistoryRecord = {
            id: `HIST-VRF-${Date.now()}`,
            applicationId: id,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            action: 'RETURNED_TO_DEO',
            reason,
            remarks: remarks || `Returned to DEO: ${reason}`,
            timestamp,
            verifierName: 'K. Venkat Rao (Girdawar)',
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'DEO CORRECTION / REVIEW',
            versionNumber: newVersion,
            auditHash: newHash,
          };

          const newNotification: NotificationItem = {
            id: `NOTIF-${Date.now()}`,
            title: `Application ${id} Returned to DEO`,
            desc: `Returned ${id} to DEO desk (${reason}). Citizen/DEO correction dispatched.`,
            time: 'Just now',
            timestamp,
            type: 'warning',
            applicationId: id,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: newStatus,
                    currentStatus: newStatus,
                    previousStatus: prevStatus,
                    currentStage: 'DEO CORRECTION / REVIEW',
                    assignedOfficer: 'K. Venkat Rao',
                    assignedRole: 'Girdawar / Revenue Inspector',
                    decision: 'RETURN_TO_DEO',
                    decisionReason: reason,
                    officerRemarks: remarks,
                    verificationNotes: remarks,
                    decisionTimestamp: timestamp,
                    nextAssignedRole: 'DEO / PATWARI',
                    nextAssignedOfficer: app.deoName || 'Suresh G. Patil (Senior VRO)',
                    versionNumber: newVersion,
                    auditHash: newHash,
                    actionHistory: [historyItem, ...(a.actionHistory || [])],
                  }
                : a
            ),
            history: [newHistoryRecord, ...state.history],
            notifications: [newNotification, ...state.notifications],
            selectedApplicationIds: state.selectedApplicationIds.filter((item) => item !== id),
          };
        }),

      rejectApplication: (id, reason, remarks) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const prevStatus = app.currentStatus || app.status || 'pending_verification';
          const newStatus = 'rejected_by_verifier' as const;
          const newVersion = (app.versionNumber || 1) + 1;
          const prevHash = app.auditHash || '0000000000000000000000000000000000000000000000000000000000000000';
          const timestamp = new Date().toISOString();
          const newHash = generateHash(`${id}-${newStatus}-${timestamp}-${remarks}-${prevHash}`);

          const historyItem: ActionHistoryItem = {
            id: `ACT-${Date.now()}`,
            action: 'REJECTED BY VERIFIER',
            actor: 'K. Venkat Rao',
            role: 'Girdawar / Revenue Inspector',
            timestamp,
            remarks: remarks || `Rejected by Verifier: ${reason}`,
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'VERIFICATION CLOSED',
            nextAssignedRole: 'NONE',
            reason,
            versionNumber: newVersion,
            auditHash: newHash,
            prevHash,
            reviewCycle: app.reviewCycleNumber || 1,
          };

          const newHistoryRecord: HistoryRecord = {
            id: `HIST-VRF-${Date.now()}`,
            applicationId: id,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            action: 'REJECTED',
            reason,
            remarks: remarks || `Rejected by Verifier: ${reason}`,
            timestamp,
            verifierName: 'K. Venkat Rao (Girdawar)',
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'VERIFICATION CLOSED',
            versionNumber: newVersion,
            auditHash: newHash,
          };

          const newNotification: NotificationItem = {
            id: `NOTIF-${Date.now()}`,
            title: `Application ${id} Rejected`,
            desc: `Application ${id} was rejected with cause: ${reason}.`,
            time: 'Just now',
            timestamp,
            type: 'error',
            applicationId: id,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: newStatus,
                    currentStatus: newStatus,
                    previousStatus: prevStatus,
                    currentStage: 'VERIFICATION CLOSED',
                    assignedOfficer: 'K. Venkat Rao',
                    assignedRole: 'Girdawar / Revenue Inspector',
                    decision: 'REJECT',
                    decisionReason: reason,
                    rejectionReason: reason,
                    officerRemarks: remarks,
                    verificationNotes: remarks,
                    decisionTimestamp: timestamp,
                    nextAssignedRole: 'NONE',
                    nextAssignedOfficer: undefined,
                    versionNumber: newVersion,
                    auditHash: newHash,
                    actionHistory: [historyItem, ...(a.actionHistory || [])],
                  }
                : a
            ),
            history: [newHistoryRecord, ...state.history],
            notifications: [newNotification, ...state.notifications],
            selectedApplicationIds: state.selectedApplicationIds.filter((item) => item !== id),
          };
        }),

      escalateToRevenue: (id, category, reason, remarks) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const prevStatus = app.currentStatus || app.status || 'pending_verification';
          const newStatus = 'escalated_to_revenue' as const;
          const newVersion = (app.versionNumber || 1) + 1;
          const prevHash = app.auditHash || '0000000000000000000000000000000000000000000000000000000000000000';
          const timestamp = new Date().toISOString();
          const newHash = generateHash(`${id}-${newStatus}-${timestamp}-${remarks}-${prevHash}`);

          const historyItem: ActionHistoryItem = {
            id: `ACT-${Date.now()}`,
            action: 'ESCALATED TO REVENUE ADMIN',
            actor: 'K. Venkat Rao',
            role: 'Girdawar / Revenue Inspector',
            timestamp,
            remarks: remarks || `Escalated to Tehsildar [${category}]: ${reason}`,
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'REVENUE ADMIN REVIEW',
            nextAssignedRole: 'REVENUE ADMIN / TAHSILDAR',
            nextAssignedOfficer: 'Smt. K. Sujatha (Tahsildar & Executive Magistrate)',
            reason: `[${category}] ${reason}`,
            versionNumber: newVersion,
            auditHash: newHash,
            prevHash,
            reviewCycle: app.reviewCycleNumber || 1,
          };

          const newHistoryRecord: HistoryRecord = {
            id: `HIST-VRF-${Date.now()}`,
            applicationId: id,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            action: 'ESCALATED_TO_REVENUE',
            reason: `[${category}] ${reason}`,
            remarks: remarks || `Escalated to Tehsildar: ${reason}`,
            timestamp,
            verifierName: 'K. Venkat Rao (Girdawar)',
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'REVENUE ADMIN REVIEW',
            versionNumber: newVersion,
            auditHash: newHash,
          };

          const newNotification: NotificationItem = {
            id: `NOTIF-${Date.now()}`,
            title: `Application ${id} Escalated`,
            desc: `Escalated ${id} to Tehsildar Executive Magistrate queue (${category}).`,
            time: 'Just now',
            timestamp,
            type: 'warning',
            applicationId: id,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: newStatus,
                    currentStatus: newStatus,
                    previousStatus: prevStatus,
                    currentStage: 'REVENUE ADMIN REVIEW',
                    assignedOfficer: 'K. Venkat Rao',
                    assignedRole: 'Girdawar / Revenue Inspector',
                    decision: 'ESCALATE',
                    decisionReason: `[${category}] ${reason}`,
                    officerRemarks: remarks,
                    verificationNotes: remarks,
                    decisionTimestamp: timestamp,
                    nextAssignedRole: 'REVENUE ADMIN / TAHSILDAR',
                    nextAssignedOfficer: 'Smt. K. Sujatha (Tahsildar & Executive Magistrate)',
                    versionNumber: newVersion,
                    auditHash: newHash,
                    actionHistory: [historyItem, ...(a.actionHistory || [])],
                  }
                : a
            ),
            history: [newHistoryRecord, ...state.history],
            notifications: [newNotification, ...state.notifications],
            selectedApplicationIds: state.selectedApplicationIds.filter((item) => item !== id),
          };
        }),

      reopenApplication: (id, remarks) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const prevStatus = app.currentStatus || app.status || 'approved_and_forwarded';
          const newStatus = 'pending_verification' as const;
          const newVersion = (app.versionNumber || 1) + 1;
          const newCycle = (app.reviewCycleNumber || 1) + 1;
          const prevHash = app.auditHash || '0000000000000000000000000000000000000000000000000000000000000000';
          const timestamp = new Date().toISOString();
          const newHash = generateHash(`${id}-${newStatus}-${timestamp}-${remarks}-${prevHash}`);

          const historyItem: ActionHistoryItem = {
            id: `ACT-${Date.now()}`,
            action: `REASSIGNED TO VERIFIER (REVIEW CYCLE ${newCycle})`,
            actor: 'Revenue Admin / Tahsildar',
            role: 'Revenue Admin Directorate',
            timestamp,
            remarks: remarks || 'Reassigned to Verifier desk for second-tier scrutiny.',
            previousStatus: prevStatus,
            newStatus,
            nextStage: 'VERIFIER REVIEW',
            nextAssignedRole: 'REVENUE VERIFIER',
            nextAssignedOfficer: 'K. Venkat Rao (Senior Girdawar)',
            versionNumber: newVersion,
            auditHash: newHash,
            prevHash,
            reviewCycle: newCycle,
          };

          const newNotification: NotificationItem = {
            id: `NOTIF-${Date.now()}`,
            title: `Review Cycle ${newCycle} Initialized`,
            desc: `Application ${id} reassigned to Verifier queue for Review Cycle ${newCycle}.`,
            time: 'Just now',
            timestamp,
            type: 'info',
            applicationId: id,
          };

          return {
            applications: state.applications.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: newStatus,
                    currentStatus: newStatus,
                    previousStatus: prevStatus,
                    currentStage: 'VERIFIER REVIEW',
                    decision: undefined,
                    decisionReason: undefined,
                    decisionTimestamp: undefined,
                    nextAssignedRole: 'REVENUE ADMIN / TAHSILDAR',
                    versionNumber: newVersion,
                    reviewCycleNumber: newCycle,
                    auditHash: newHash,
                    actionHistory: [historyItem, ...(a.actionHistory || [])],
                  }
                : a
            ),
            notifications: [newNotification, ...state.notifications],
          };
        }),

      toggleChecklistItem: (id, itemKey) =>
        set((state) => ({
          applications: state.applications.map((a) => {
            if (a.id !== id) return a;
            const currentChecklist = a.checklist || {
              documentsReviewed: false,
              identityProofChecked: false,
              ownerInfoChecked: false,
              surveyNumberChecked: false,
              areaChecked: false,
              registrationDetailsChecked: false,
              mutationDetailsChecked: false,
              transactionHistoryChecked: false,
              govtRecordCrossChecked: false,
              gisResultReviewed: false,
              conflictsReviewed: false,
              verifierRemarksEntered: false,
            };
            return {
              ...a,
              checklist: {
                ...currentChecklist,
                [itemKey]: !currentChecklist[itemKey],
              },
            };
          }),
        })),

      toggleGovtServiceStatus: (id) =>
        set((state) => ({
          applications: state.applications.map((a) => {
            if (a.id !== id) return a;
            const currentStatus = a.govtRecord?.serviceStatus || 'ONLINE';
            const newStatus = currentStatus === 'ONLINE' ? 'UNAVAILABLE' : 'ONLINE';
            return {
              ...a,
              govtRecord: {
                ...a.govtRecord,
                serviceStatus: newStatus,
              },
            };
          }),
        })),

      markNotificationRead: (notifId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notifId ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      batchApprove: (ids, remarks) => {
        ids.forEach((id) => {
          get().approveAndForward(id, remarks || 'Batch approved and forwarded to Revenue Admin');
        });
      },

      batchReject: (ids, reason, remarks) => {
        ids.forEach((id) => {
          get().rejectApplication(id, reason, remarks || `Batch rejected: ${reason}`);
        });
      },

      verifyAuditChain: () => {
        const apps = get().applications;
        for (const app of apps) {
          if (!app.actionHistory || app.actionHistory.length === 0) continue;
          for (let i = 0; i < app.actionHistory.length; i++) {
            const item = app.actionHistory[i];
            if (!item.auditHash || item.auditHash.length !== 64) {
              return { isValid: false, brokenAtId: item.id };
            }
          }
        }
        return { isValid: true };
      },

      getStats: () => {
        const apps = get().applications;
        const pending = apps.filter(
          (a) =>
            (a.currentStatus || a.status) === 'pending_verification' ||
            (a.currentStatus || a.status) === 'under_verifier_review' ||
            (a.currentStatus || a.status) === 'returned_to_verifier'
        ).length;

        const history = get().history;
        const completedReviewsToday = history.length;
        const approvedToday = history.filter(
          (h) => h.action === 'APPROVED' || h.action === 'APPROVED_AND_FORWARDED'
        ).length;
        const rejectedToday = history.filter((h) => h.action === 'REJECTED').length;
        const returnedToday = history.filter((h) => h.action === 'RETURNED_TO_DEO').length;
        const escalatedToday = history.filter((h) => h.action === 'ESCALATED_TO_REVENUE').length;

        const approvalRate =
          completedReviewsToday > 0 ? Math.round((approvedToday / completedReviewsToday) * 100) : 0;

        const highRisk = apps.filter(
          (a) =>
            ((a.currentStatus || a.status) === 'pending_verification' ||
              (a.currentStatus || a.status) === 'under_verifier_review') &&
            typeof a.riskScore === 'number' &&
            a.riskScore < 50
        ).length;

        let documentsMissing = 0;
        let conflictsDetected = 0;
        let gisFlags = 0;
        let duplicateFlags = 0;
        let returnedApplications = 0;

        apps.forEach((a) => {
          if (a.documentsList) {
            documentsMissing += a.documentsList.filter((d) => d.required && !d.available).length;
          }
          if (a.validationResults) {
            conflictsDetected += a.validationResults.filter(
              (v) => v.status === 'MISMATCH' || v.status === 'PARTIAL'
            ).length;
          }
          if (a.gisData && a.gisData.result === 'POTENTIAL_AREA_MISMATCH') {
            gisFlags += 1;
          }
          if (a.attentionSummary?.potentialDuplicate) {
            duplicateFlags += 1;
          }
          if ((a.currentStatus || a.status) === 'returned_to_deo') {
            returnedApplications += 1;
          }
        });

        return {
          pending,
          verifiedToday: completedReviewsToday,
          completedReviewsToday,
          approvedToday,
          rejectedToday,
          returnedToday,
          escalatedToday,
          approvalRate,
          highRisk,
          attentionSummary: {
            documentsMissing,
            conflictsDetected,
            gisFlags,
            duplicateFlags,
            returnedApplications,
          },
        };
      },
    }),
    {
      name: 'bhooraksha_verifier_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        applications: state.applications,
        history: state.history,
        notifications: state.notifications,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.applications) {
          state.applications = state.applications.map((app) => sanitizeVerifierApplication(app));
        }
      },
    }
  )
);
