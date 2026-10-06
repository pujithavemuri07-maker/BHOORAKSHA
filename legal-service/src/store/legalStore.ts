import { create } from 'zustand';
import { LegalApplication, HistoryRecord, StatsResponse } from '../api/types';

interface LegalState {
  applications: LegalApplication[];
  history: HistoryRecord[];
  selectedApplicationIds: string[];
  toggleSelectApplication: (id: string) => void;
  selectAllApplications: (ids: string[]) => void;
  clearSelection: () => void;
  clearApplication: (id: string, opinion: string) => void;
  flagApplication: (id: string, reason: string, opinion: string) => void;
  blockApplication: (id: string, reason: string, opinion: string, legalReferences: string[]) => void;
  escalateApplication: (id: string, remarks: string) => void;
  batchClear: (ids: string[], opinion: string) => void;
  batchFlag: (ids: string[], reason: string, opinion: string) => void;
  batchBlock: (ids: string[], reason: string, opinion: string, legalReferences: string[]) => void;
  getStats: () => StatsResponse;
}

const INITIAL_APPLICATIONS: LegalApplication[] = [
  {
    id: 'REQ-2026-000123',
    citizenName: 'Ramesh Kumar Patel',
    citizenPhone: '+91 98765 43210',
    citizenEmail: 'ramesh.patel@example.gov.in',
    surveyNumber: '123/456',
    documentType: 'Registered Sale Deed',
    documentUrl: '/documents/deed_sale_501.pdf',
    status: 'pending_legal_review',
    legalRiskScore: 78,
    severity: 'high',
    priority: 'urgent',
    legalFlagsCount: 3,
    createdAt: '2026-09-06T10:15:00Z',
    escalated: false,
    legalFlags: [
      {
        id: 'flag-1',
        type: 'ownership_inconsistency',
        title: 'Ownership Inconsistency Across Instrument Pages',
        description: 'Purchaser name on Page 1 is recited as "R. Kumar", whereas Page 3 schedule and execution clause cites "R. Kumaran".',
        severity: 'high',
        recommendation: 'Verify official KYC/Aadhaar identity and call for rectifying endorsement or affidavit of identity.',
        source: 'ai',
        detectedAt: '2026-09-06T10:18:00Z',
      },
      {
        id: 'flag-2',
        type: 'registration_irregularity',
        title: 'Execution vs Stamp Registration Date Discrepancy',
        description: 'Deed execution recital states 20 December 2025, while Sub-Registrar stamp endorsement seal records 15 January 2026.',
        severity: 'medium',
        recommendation: 'Reconcile registration timeline with SRO Serilingampally Book-1 index to verify valid presentation window (Sec 23 Registration Act 1908).',
        source: 'ai',
        detectedAt: '2026-09-06T10:18:00Z',
      },
      {
        id: 'flag-3',
        type: 'missing_legal_documents',
        title: 'Missing Link Document of Prior Title Holder',
        description: 'Recital references 2012 ancestral partition, but original partition deed schedule was not annexed.',
        severity: 'low',
        recommendation: 'Request prior link document or certified extract of 2012 partition deed.',
        source: 'ai',
        detectedAt: '2026-09-06T10:18:00Z',
      },
    ],
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
        name: 'R. Kumar (also referenced as R. Kumaran)',
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
      },
      sourceRegister: 'Dharani Cadastral Database Sync',
      lastUpdated: '2026-09-06T12:00:00Z',
    },
  },
  {
    id: 'LEG-2026-602',
    citizenName: 'B. Venkatswamy Goud',
    citizenPhone: '+91 99890 22341',
    citizenEmail: 'venkatswamy.goud@example.gov.in',
    surveyNumber: '210/B',
    documentType: 'Partition Deed (Bhaaga Parishkaram)',
    documentUrl: '/documents/partition_deed_503.pdf',
    status: 'pending_legal_review',
    legalRiskScore: 92,
    severity: 'high',
    priority: 'urgent',
    legalFlagsCount: 2,
    createdAt: '2026-09-07T09:20:00Z',
    escalated: true,
    legalFlags: [
      {
        id: 'flag-201',
        type: 'under_litigation',
        title: 'Active Judicial Injunction / Court Stay',
        description: 'Caveat screening detected pending suit OS 412/2024 at Senior Civil Court Sangareddy. Interim injunction operating against partition alienation.',
        severity: 'high',
        recommendation: 'Statutory block under Section 52 Transfer of Property Act (Lis Pendens). Mutation must be stayed pending final judicial decree.',
        source: 'ai',
        citation: 'OS 412/2024 (Sangareddy Sr. Civil Court) & Sec 52 T.P. Act',
      },
      {
        id: 'flag-202',
        type: 'invalid_title',
        title: 'Unlawful Coparcenary Alienation Without Co-Heir Assent',
        description: 'Deed executes 50% share, but revenue genealogy records 3 living coparcenary heirs with equal 33.33% undivided interest.',
        severity: 'high',
        recommendation: 'Require Registered Relinquishment Deed (Haq Tyag Patra) from surviving co-heirs before any mutation.',
        source: 'ai',
      },
    ],
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
        share: '50% Claimed Share',
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
        name: 'B. Venkatswamy Goud & 2 Others',
        fatherName: 'B. Ramalingam Goud',
        share: '33.33% Undivided Interest each',
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
      sourceRegister: 'Telangana Maa Bhoomi ROR 1-B Register',
      lastUpdated: '2026-09-07T08:00:00Z',
    },
  },
  {
    id: 'LEG-2026-603',
    citizenName: 'Devi Prasad Rao',
    citizenPhone: '+91 94411 99220',
    citizenEmail: 'devi.prasad@example.gov.in',
    surveyNumber: '77/1',
    documentType: 'Conveyance Agreement',
    documentUrl: '/documents/conveyance_603.pdf',
    status: 'pending_legal_review',
    legalRiskScore: 89,
    severity: 'high',
    priority: 'urgent',
    legalFlagsCount: 2,
    createdAt: '2026-09-07T08:30:00Z',
    escalated: true,
    legalFlags: [
      {
        id: 'flag-301',
        type: 'non_transferable',
        title: 'Section 22-A Prohibited Land Encroachment',
        description: 'Survey 77/1 overlaps with irrigation buffer and canal tank bed poramboke registered under Sec 22-A(1)(b) of Registration Act.',
        severity: 'high',
        recommendation: 'Issue absolute statutory refusal order. Prohibited government land cannot be conveyed or mutated.',
        source: 'ai',
        citation: 'Sec 22-A(1)(b) Registration Act 1908 & G.O. Ms. No. 115',
      },
      {
        id: 'flag-302',
        type: 'document_fraud',
        title: 'Suspicious Stamp Paper Serial Number Sequence',
        description: 'Stamp vendor registry indicates serial e-stamp was cancelled prior to execution.',
        severity: 'high',
        recommendation: 'Refer to District Registrar (Enforcement & Vigilance) for forensic verification.',
        source: 'ai',
      },
    ],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Rajendranagar',
        village: 'Shamshabad',
        surveyNumber: '77/1',
        ulpin: 'ULPIN-36-RR-RAJ-077-01',
      },
      ownerDetails: {
        name: 'Devi Prasad Rao',
        fatherName: 'D. Janardhan Rao',
        share: '100% Sole Ownership',
        previousOwner: 'Unrecorded Third Party',
      },
      landDetails: {
        totalArea: '1.50',
        areaUnit: 'Acres',
        landType: 'Government Poramboke Buffer',
        currentUsage: 'Encroached Open Land',
        boundaries: {
          north: 'Irrigation Tank Bed',
          south: 'Survey 78 Private Land',
          east: 'Airport Approach Road',
          west: 'PWD Feeder Nala',
        },
      },
      documentDetails: {
        documentType: 'Conveyance Agreement',
        documentNumber: 'CA-2026-009',
        registrationNumber: 'BK-4/109/2026',
        registrationDate: '2026-01-08',
        issuingAuthority: 'SRO Shamshabad',
      },
    },
    govtRecord: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Rajendranagar',
        village: 'Shamshabad',
        surveyNumber: '77/1',
        ulpin: 'ULPIN-36-RR-RAJ-077-01',
      },
      ownerDetails: {
        name: 'Government of Telangana (Water Resources Dept)',
        fatherName: 'State Custodian',
        share: '100% Sovereign Title',
        previousOwner: 'State Heritage Poramboke',
      },
      landDetails: {
        totalArea: '1.50',
        areaUnit: 'Acres',
        landType: 'Water Body / Tank Bed Buffer',
        currentUsage: 'Public Water Reservoir Reserve',
        boundaries: {
          north: 'Irrigation Tank Bed',
          south: 'Survey 78 Private Land',
          east: 'Airport Approach Road',
          west: 'PWD Feeder Nala',
        },
      },
      documentDetails: {
        documentType: 'Prohibited Property Register Entry',
        documentNumber: 'SEC-22A-LIST-2022',
        registrationNumber: 'PPR/RR/2022/411',
        registrationDate: '2022-03-15',
        issuingAuthority: 'District Collector, Ranga Reddy',
      },
      sourceRegister: 'Section 22-A Prohibited Land Database',
      lastUpdated: '2026-09-07T08:00:00Z',
    },
  },
  {
    id: 'LEG-2026-604',
    citizenName: 'Anitha Rajendran',
    citizenPhone: '+91 98450 11223',
    citizenEmail: 'anitha.rajendran@example.gov.in',
    surveyNumber: '84/3',
    documentType: 'Pattadar Passbook',
    documentUrl: '/documents/passbook_502.pdf',
    status: 'pending_legal_review',
    legalRiskScore: 54,
    severity: 'medium',
    priority: 'normal',
    legalFlagsCount: 1,
    createdAt: '2026-09-06T11:00:00Z',
    escalated: false,
    legalFlags: [
      {
        id: 'flag-401',
        type: 'succession_issue',
        title: 'Succession Certificate Verification Required',
        description: 'Property acquired through intestate succession following decease of primary pattadar without registered family settlement.',
        severity: 'medium',
        recommendation: 'Obtain Tahsildar Family Members Certificate (FMC) and sworn no-objection affidavits from legal heirs.',
        source: 'ai',
      },
    ],
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
        previousOwner: 'Late Rajendran Murthy',
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
        previousOwner: 'Late Rajendran Murthy',
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
      sourceRegister: 'Manual DEO Entry from ROR Register',
      lastUpdated: '2026-09-06T11:30:00Z',
    },
  },
  {
    id: 'LEG-2026-605',
    citizenName: 'M. Padma Reddy',
    citizenPhone: '+91 97000 44556',
    citizenEmail: 'padma.reddy@example.gov.in',
    surveyNumber: '42/A',
    documentType: 'Gift Deed (Daanam)',
    documentUrl: '/documents/gift_deed_504.pdf',
    status: 'pending_legal_review',
    legalRiskScore: 32,
    severity: 'low',
    priority: 'normal',
    legalFlagsCount: 1,
    createdAt: '2026-09-07T08:00:00Z',
    escalated: false,
    legalFlags: [
      {
        id: 'flag-501',
        type: 'stamp_duty_issue',
        title: 'Minor Concessional Stamp Duty Verification',
        description: 'Instrument claimed concessional 1% stamp duty under Blood Relation Gift schedule (G.O. Ms. No. 58).',
        severity: 'low',
        recommendation: 'Verify relationship certificate establishing donor as father of donee to validate concession.',
        source: 'ai',
      },
    ],
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
      sourceRegister: 'Dharani Online Registry',
      lastUpdated: '2026-09-07T15:00:00Z',
    },
  },
];

const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'HIST-LEG-801',
    applicationId: 'LEG-2026-588',
    citizenName: 'G. Harish Kumar',
    surveyNumber: '92/1',
    action: 'CLEARED',
    opinion: 'All AI legal flags reviewed. The variation in surname spelling is clerical and supported by Gazetted name change certificate. Title is clear, unencumbered, and legally sound for mutation.',
    timestamp: '2026-09-07T11:45:00Z',
    officerName: 'Adv. Rajeshwari Sharma',
  },
  {
    id: 'HIST-LEG-802',
    applicationId: 'LEG-2026-589',
    citizenName: 'M. Srinivasulu',
    surveyNumber: '144/2',
    action: 'FLAGGED',
    reason: 'missing_legal_documents',
    opinion: 'Link document for 2015 prior registered mortgage discharge receipt (No D-1194/2015) is missing from the record bundle. Further review required before clearance.',
    timestamp: '2026-09-07T14:10:00Z',
    officerName: 'Adv. Rajeshwari Sharma',
  },
  {
    id: 'HIST-LEG-803',
    applicationId: 'LEG-2026-590',
    citizenName: 'Prashant K. Rao',
    surveyNumber: '61/3',
    action: 'BLOCKED',
    reason: 'under_litigation',
    opinion: 'Application blocked under Section 52 Transfer of Property Act (Lis Pendens). Title is subject of pending partition suit OS 218/2023 at City Civil Court Hyderabad.',
    legalReferences: ['OS 218/2023 (City Civil Court Hyderabad)', 'Section 52 Transfer of Property Act 1882'],
    timestamp: '2026-09-07T16:20:00Z',
    officerName: 'Adv. Rajeshwari Sharma',
  },
  {
    id: 'HIST-LEG-804',
    applicationId: 'LEG-2026-591',
    citizenName: 'K. Someshwar Rao',
    surveyNumber: '29/A',
    action: 'ESCALATED',
    opinion: 'Complex succession dispute involving testamentary trust and alleged forged Will. Escalated to District Revenue Officer / Tehsildar for formal statutory hearing.',
    timestamp: '2026-09-07T17:35:00Z',
    officerName: 'Adv. Rajeshwari Sharma',
  },
];

export const useLegalStore = create<LegalState>((set, get) => ({
  applications: INITIAL_APPLICATIONS,
  history: INITIAL_HISTORY,
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

  clearApplication: (id, opinion) =>
    set((state) => {
      const app = state.applications.find((a) => a.id === id);
      if (!app) return state;

      const newHistory: HistoryRecord = {
        id: `HIST-LEG-${Date.now()}`,
        applicationId: id,
        citizenName: app.citizenName,
        surveyNumber: app.surveyNumber,
        action: 'CLEARED',
        opinion: opinion || 'All legal flags reviewed. Document is legally sound.',
        timestamp: new Date().toISOString(),
        officerName: 'Adv. Rajeshwari Sharma',
      };

      return {
        applications: state.applications.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'cleared_by_legal',
                legalOpinion: opinion,
                decisionDate: new Date().toISOString(),
                decisionBy: 'Adv. Rajeshwari Sharma',
              }
            : a
        ),
        history: [newHistory, ...state.history],
        selectedApplicationIds: state.selectedApplicationIds.filter((item) => item !== id),
      };
    }),

  flagApplication: (id, reason, opinion) =>
    set((state) => {
      const app = state.applications.find((a) => a.id === id);
      if (!app) return state;

      const newHistory: HistoryRecord = {
        id: `HIST-LEG-${Date.now()}`,
        applicationId: id,
        citizenName: app.citizenName,
        surveyNumber: app.surveyNumber,
        action: 'FLAGGED',
        reason,
        opinion: opinion || `Flagged for further review: ${reason}`,
        timestamp: new Date().toISOString(),
        officerName: 'Adv. Rajeshwari Sharma',
      };

      return {
        applications: state.applications.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'flagged_by_legal',
                legalOpinion: opinion,
                decisionDate: new Date().toISOString(),
                decisionBy: 'Adv. Rajeshwari Sharma',
              }
            : a
        ),
        history: [newHistory, ...state.history],
        selectedApplicationIds: state.selectedApplicationIds.filter((item) => item !== id),
      };
    }),

  blockApplication: (id, reason, opinion, legalReferences) =>
    set((state) => {
      const app = state.applications.find((a) => a.id === id);
      if (!app) return state;

      const newHistory: HistoryRecord = {
        id: `HIST-LEG-${Date.now()}`,
        applicationId: id,
        citizenName: app.citizenName,
        surveyNumber: app.surveyNumber,
        action: 'BLOCKED',
        reason,
        opinion: opinion || `Blocked due to serious legal violation: ${reason}`,
        legalReferences,
        timestamp: new Date().toISOString(),
        officerName: 'Adv. Rajeshwari Sharma',
      };

      return {
        applications: state.applications.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'blocked_by_legal',
                legalOpinion: opinion,
                legalReferences,
                decisionDate: new Date().toISOString(),
                decisionBy: 'Adv. Rajeshwari Sharma',
              }
            : a
        ),
        history: [newHistory, ...state.history],
        selectedApplicationIds: state.selectedApplicationIds.filter((item) => item !== id),
      };
    }),

  escalateApplication: (id, remarks) =>
    set((state) => {
      const app = state.applications.find((a) => a.id === id);
      if (!app) return state;

      const newHistory: HistoryRecord = {
        id: `HIST-LEG-${Date.now()}`,
        applicationId: id,
        citizenName: app.citizenName,
        surveyNumber: app.surveyNumber,
        action: 'ESCALATED',
        opinion: remarks || 'Escalated to District Revenue Admin.',
        timestamp: new Date().toISOString(),
        officerName: 'Adv. Rajeshwari Sharma',
      };

      return {
        applications: state.applications.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'escalated_by_legal',
                escalated: true,
                legalOpinion: remarks,
                decisionDate: new Date().toISOString(),
                decisionBy: 'Adv. Rajeshwari Sharma',
              }
            : a
        ),
        history: [newHistory, ...state.history],
        selectedApplicationIds: state.selectedApplicationIds.filter((item) => item !== id),
      };
    }),

  batchClear: (ids, opinion) =>
    set((state) => {
      const newHistoryItems: HistoryRecord[] = [];
      const updatedApplications = state.applications.map((app) => {
        if (ids.includes(app.id)) {
          newHistoryItems.push({
            id: `HIST-LEG-${Date.now()}-${app.id}`,
            applicationId: app.id,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            action: 'CLEARED',
            opinion: opinion || 'Batch cleared by Legal Officer.',
            timestamp: new Date().toISOString(),
            officerName: 'Adv. Rajeshwari Sharma',
          });
          return {
            ...app,
            status: 'cleared_by_legal' as const,
            legalOpinion: opinion,
            decisionDate: new Date().toISOString(),
            decisionBy: 'Adv. Rajeshwari Sharma',
          };
        }
        return app;
      });

      return {
        applications: updatedApplications,
        history: [...newHistoryItems, ...state.history],
        selectedApplicationIds: [],
      };
    }),

  batchFlag: (ids, reason, opinion) =>
    set((state) => {
      const newHistoryItems: HistoryRecord[] = [];
      const updatedApplications = state.applications.map((app) => {
        if (ids.includes(app.id)) {
          newHistoryItems.push({
            id: `HIST-LEG-${Date.now()}-${app.id}`,
            applicationId: app.id,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            action: 'FLAGGED',
            reason,
            opinion: opinion || `Batch flagged: ${reason}`,
            timestamp: new Date().toISOString(),
            officerName: 'Adv. Rajeshwari Sharma',
          });
          return {
            ...app,
            status: 'flagged_by_legal' as const,
            legalOpinion: opinion,
            decisionDate: new Date().toISOString(),
            decisionBy: 'Adv. Rajeshwari Sharma',
          };
        }
        return app;
      });

      return {
        applications: updatedApplications,
        history: [...newHistoryItems, ...state.history],
        selectedApplicationIds: [],
      };
    }),

  batchBlock: (ids, reason, opinion, legalReferences) =>
    set((state) => {
      const newHistoryItems: HistoryRecord[] = [];
      const updatedApplications = state.applications.map((app) => {
        if (ids.includes(app.id)) {
          newHistoryItems.push({
            id: `HIST-LEG-${Date.now()}-${app.id}`,
            applicationId: app.id,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            action: 'BLOCKED',
            reason,
            opinion: opinion || `Batch blocked: ${reason}`,
            legalReferences,
            timestamp: new Date().toISOString(),
            officerName: 'Adv. Rajeshwari Sharma',
          });
          return {
            ...app,
            status: 'blocked_by_legal' as const,
            legalOpinion: opinion,
            legalReferences,
            decisionDate: new Date().toISOString(),
            decisionBy: 'Adv. Rajeshwari Sharma',
          };
        }
        return app;
      });

      return {
        applications: updatedApplications,
        history: [...newHistoryItems, ...state.history],
        selectedApplicationIds: [],
      };
    }),

  getStats: () => {
    const apps = get().applications;
    const pending = apps.filter((a) => a.status === 'pending_legal_review').length;
    const legalBlocks = apps.filter((a) => a.severity === 'high' || a.status === 'blocked_by_legal').length;
    const history = get().history;
    const reviewedToday = history.length;
    const escalated = apps.filter((a) => a.escalated || a.status === 'escalated_by_legal').length;
    const clearedToday = history.filter((h) => h.action === 'CLEARED').length;
    const flaggedToday = history.filter((h) => h.action === 'FLAGGED').length;
    const blockedToday = history.filter((h) => h.action === 'BLOCKED').length;

    return {
      pending,
      legalBlocks,
      reviewedToday,
      escalated,
      clearedToday,
      flaggedToday,
      blockedToday,
    };
  },
}));
