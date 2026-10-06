import { create } from 'zustand';
import { Application, NotificationItem } from '../api/types';

interface ApplicationState {
  applications: Application[];
  notifications: NotificationItem[];
  addApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: Application['status'], riskScore?: number) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'REQ-2026-000123',
    documentType: 'Registered Sale Deed',
    submissionDate: '2026-09-02T10:30:00Z',
    status: 'APPROVED',
    riskScore: 92,
    confidenceCategory: 'HIGH',
    fileName: 'Deed_Doc_4402_2026.pdf',
    fileSize: 3450200,
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Gachibowli',
        surveyNumber: '118/A',
        subDivision: '2',
        ulpin: 'ULPIN-36-RR-SER-118-02',
      },
      ownerDetails: {
        name: 'Ramesh Kumar Patel',
        fatherOrSpouse: 'Gopal Patel',
        share: '100% Sole Ownership',
        previousOwner: 'Venkat Rao Deshmukh',
        panOrAadhaarLast4: '8821',
      },
      landDetails: {
        area: 2.45,
        unit: 'Acres',
        landType: 'Agricultural',
        boundaries: {
          north: 'Gram Panchayat Road 30ft',
          south: 'Survey No. 119 Paddy Land',
          east: 'Canal Buffer Zone',
          west: 'Survey No. 117 Private Farm',
        },
      },
      documentDetails: {
        type: 'Registered Sale Deed (Kraya Patram)',
        number: 'DOC-2026-4402',
        registrationNumber: 'SRO/SRL/4402/2026',
        date: '2026-08-20',
        issuingAuthority: 'Sub-Registrar Office, Serilingampally',
        sroOffice: 'Serilingampally SRO 0411',
      },
    },
    riskFactors: [
      'Chain of title verified across 30-year Dharani index (Clear)',
      'No pending suits in Junior Civil Court or High Court',
      'No encroachment detected against Survey of India master grid',
    ],
    legalFlags: [],
    gisData: {
      documentBoundary: [
        [17.4401, 78.3489],
        [17.4435, 78.3492],
        [17.4431, 78.3530],
        [17.4398, 78.3526],
      ],
      governmentBoundary: [
        [17.4401, 78.3489],
        [17.4435, 78.3492],
        [17.4431, 78.3530],
        [17.4398, 78.3526],
      ],
      overlapPercentage: 99.8,
      encroachmentAlert: false,
    },
    auditLog: [
      {
        id: 'aud-1',
        actor: 'ChitraPathak AI Engine',
        role: 'AI_AGENT',
        action: 'Indic OCR & Quality Verification Pass (Score 98%)',
        timestamp: '2026-09-02T10:31:10Z',
      },
      {
        id: 'aud-2',
        actor: 'S. Ramakrishna (Patwari)',
        role: 'DEO',
        action: 'Field record matched with Pahani/Adangal',
        timestamp: '2026-09-03T11:15:00Z',
        remarks: 'Physical boundaries and seller identity verified.',
      },
      {
        id: 'aud-3',
        actor: 'K. V. Rao (Girdawar)',
        role: 'VERIFIER',
        action: 'Endorsed checker clearance',
        timestamp: '2026-09-04T14:40:00Z',
      },
      {
        id: 'aud-4',
        actor: 'M. Anitha IAS (Tehsildar)',
        role: 'REVENUE_ADMIN',
        action: 'Final Mutation Sanction & Digital Certificate Affixed',
        timestamp: '2026-09-05T16:00:00Z',
        remarks: 'Mutation approved under RoR Act Sec 5.',
      },
    ],
  },
  {
    id: 'REQ-2026-000124',
    documentType: 'Pattadar Passbook',
    submissionDate: '2026-09-04T15:20:00Z',
    status: 'AI_PROCESSING',
    riskScore: 78,
    confidenceCategory: 'MEDIUM',
    fileName: 'Passbook_Scan_T7890.pdf',
    fileSize: 4120800,
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
        name: 'Ramesh Kumar Patel',
        fatherOrSpouse: 'Gopal Patel',
        share: '50% Co-ownership',
        previousOwner: 'B. Narayan Swamy',
      },
      landDetails: {
        area: 1.15,
        unit: 'Acres',
        landType: 'Residential Conversion',
        boundaries: {
          north: 'Plot 45 layout road',
          south: 'Buffer zone Survey 85',
          east: 'Vaikunta Dhamam Road',
          west: 'Internal 40ft layout avenue',
        },
      },
      documentDetails: {
        type: 'Rythu Seva e-Pattadar Passbook',
        number: 'PPB-TS-2023-99812',
        registrationNumber: 'KSR/2023/PP-09',
        date: '2023-11-14',
        issuingAuthority: 'Tahsildar Office Keesara',
      },
    },
    riskFactors: [
      'Minor boundary deviation (0.4m) along eastern buffer boundary',
      'Pending verification of co-parcener consent deed',
    ],
    legalFlags: ['Check for unpartitioned Hindu Undivided Family caveat'],
    gisData: {
      documentBoundary: [
        [17.5120, 78.5810],
        [17.5145, 78.5812],
        [17.5142, 78.5840],
        [17.5118, 78.5838],
      ],
      governmentBoundary: [
        [17.5120, 78.5810],
        [17.5148, 78.5815],
        [17.5142, 78.5840],
        [17.5118, 78.5838],
      ],
      overlapPercentage: 94.2,
      encroachmentAlert: false,
    },
    auditLog: [
      {
        id: 'aud-21',
        actor: 'System AI Worker',
        role: 'AI_AGENT',
        action: 'Document Ingested & MuRIL NER Extracted',
        timestamp: '2026-09-04T15:21:00Z',
      },
    ],
  },
  {
    id: 'REQ-2026-000125',
    documentType: 'Registered Gift Settlement Deed',
    submissionDate: '2026-09-05T09:10:00Z',
    status: 'CORRECTION_REQUIRED',
    riskScore: 42,
    confidenceCategory: 'LOW',
    fileName: 'Gift_Deed_Scan_5501.pdf',
    fileSize: 1890400,
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Sangareddy',
        taluk: 'Patancheru',
        village: 'Muthangi',
        surveyNumber: '210/B',
        type: 'Family Settlement & Partition Deed',
        number: 'REG-1998-PART-88',
        registrationNumber: 'SRO/SAN/1998/88',
        date: '1998-04-12',
        issuingAuthority: 'Sub-Registrar Sangareddy',
      },
    },
    riskFactors: [
      'Page 3 stamp paper illegible due to ink degradation (Failed OCR threshold 70%)',
      'Schedule of properties missing specific metes and bounds table',
      'Boundary description discrepancy against latest Village Cadastral Map 2024',
    ],
    legalFlags: ['Requires high-resolution colored re-scan of Schedule B'],
    gisData: {
      documentBoundary: [
        [17.5280, 78.2560],
        [17.5310, 78.2565],
        [17.5305, 78.2610],
        [17.5275, 78.2605],
      ],
      governmentBoundary: [
        [17.5280, 78.2560],
        [17.5320, 78.2570],
        [17.5315, 78.2620],
        [17.5275, 78.2605],
      ],
      overlapPercentage: 78.4,
      encroachmentAlert: true,
      encroachmentAreaSqM: 142.5,
    },
    auditLog: [
      {
        id: 'aud-31',
        actor: 'ChitraPathak Indic OCR',
        role: 'AI_AGENT',
        action: 'Flagged Low Contrast & Illegible Text on Schedule Page 3',
        timestamp: '2026-09-05T09:12:00Z',
      },
      {
        id: 'aud-32',
        actor: 'P. Nageshwar Rao',
        role: 'DEO',
        action: 'Returned for Citizen Correction',
        timestamp: '2026-09-05T14:30:00Z',
        remarks: 'Please re-upload a clear 300 DPI flatbed scan of Schedule B (Pages 3-5).',
      },
    ],
  },
  {
    id: 'REQ-2026-000126',
    documentType: 'Gift Deed',
    submissionDate: '2026-09-06T11:45:00Z',
    status: 'HUMAN_REVIEW',
    riskScore: 84,
    confidenceCategory: 'HIGH',
    fileName: 'Gift_Settlement_2024.pdf',
    fileSize: 1980000,
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Rajendranagar',
        village: 'Puppalguda',
        surveyNumber: '42/A',
        ulpin: 'ULPIN-36-RR-RAJ-042-01',
      },
      ownerDetails: {
        name: 'Ramesh Kumar Patel',
        fatherOrSpouse: 'Gopal Patel',
        share: 'Sole Beneficiary',
        previousOwner: 'Smt. Saraswathi Patel (Mother)',
      },
      landDetails: {
        area: 500,
        unit: 'Sq. Yards',
        landType: 'Residential',
        boundaries: {
          north: 'Plot 12',
          south: 'Plot 14',
          east: '40 Feet Municipal Road',
          west: 'Open Park Reserve',
        },
      },
      documentDetails: {
        type: 'Registered Gift Settlement Deed',
        number: 'GIFT-2024-551',
        registrationNumber: 'SRO/RAJ/551/2024',
        date: '2024-03-10',
        issuingAuthority: 'SRO Rajendranagar',
      },
    },
    riskFactors: ['Minor name spelling variance between Aadhaar (Ramesh Kumar) and Deed (Ramesh K. Patel)'],
    legalFlags: [],
    gisData: {
      documentBoundary: [
        [17.3910, 78.3750],
        [17.3925, 78.3751],
        [17.3924, 78.3770],
        [17.3909, 78.3769],
      ],
      governmentBoundary: [
        [17.3910, 78.3750],
        [17.3925, 78.3751],
        [17.3924, 78.3770],
        [17.3909, 78.3769],
      ],
      overlapPercentage: 99.1,
      encroachmentAlert: false,
    },
    auditLog: [
      {
        id: 'aud-41',
        actor: 'AI Verification Crew',
        role: 'AI_AGENT',
        action: 'Title chain verified (Score 84/100)',
        timestamp: '2026-09-06T11:46:00Z',
      },
      {
        id: 'aud-42',
        actor: 'A. Subrahmanyam (Girdawar)',
        role: 'VERIFIER',
        action: 'Initiated field inspection',
        timestamp: '2026-09-07T10:00:00Z',
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Mutation Approved!',
    message: 'Application REQ-2026-000123 has been officially approved by the Tehsildar. Digital certificate is ready to download.',
    timestamp: '2026-09-05T16:05:00Z',
    read: false,
    type: 'success',
    applicationId: 'REQ-2026-000123',
  },
  {
    id: 'notif-2',
    title: 'Action Required: Re-upload Document',
    message: 'Application REQ-2026-000125 requires a clearer scan of Schedule B pages due to low OCR readability.',
    timestamp: '2026-09-05T14:35:00Z',
    read: false,
    type: 'warning',
    applicationId: 'REQ-2026-000125',
  },
  {
    id: 'notif-3',
    title: 'AI Verification in Progress',
    message: 'Application REQ-2026-000124 is currently undergoing MuRIL NER and PostGIS Cadastral boundary validation.',
    timestamp: '2026-09-04T15:25:00Z',
    read: true,
    type: 'info',
    applicationId: 'REQ-2026-000124',
  },
];

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: INITIAL_APPLICATIONS,
  notifications: INITIAL_NOTIFICATIONS,
  addApplication: (app) =>
    set((state) => ({
      applications: [app, ...state.applications],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'New Application Submitted',
          message: `Application ${app.id} uploaded successfully and dispatched to AI verification engine.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'info',
          applicationId: app.id,
        },
        ...state.notifications,
      ],
    })),
  updateApplicationStatus: (id, status, riskScore) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
              ...(riskScore !== undefined ? { riskScore } : {}),
            }
          : app
      ),
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearNotifications: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}));
