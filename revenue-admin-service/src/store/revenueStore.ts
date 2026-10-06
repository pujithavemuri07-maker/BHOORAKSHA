import { create } from 'zustand';
import {
  RevenueApplication,
  RevenueHistoryRecord,
  RevenueStatsResponse,
  TehsilStat,
  StatusStat,
} from '../api/types';

interface RevenueState {
  applications: RevenueApplication[];
  history: RevenueHistoryRecord[];
  selectedApplicationIds: string[];
  toggleSelectApplication: (id: string) => void;
  selectAllApplications: (ids: string[]) => void;
  clearSelection: () => void;
  approveApplication: (id: string, remarks?: string) => Promise<void>;
  rejectApplication: (id: string, reason: string, remarks: string) => Promise<void>;
  generateCertificate: (id: string) => Promise<string>;
  batchApprove: (ids: string[], remarks?: string) => Promise<void>;
  batchReject: (ids: string[], reason: string, remarks: string) => Promise<void>;
  getStats: () => RevenueStatsResponse;
  getTehsilStats: () => TehsilStat[];
  getStatusStats: () => StatusStat[];
}

const INITIAL_APPLICATIONS: RevenueApplication[] = [
  {
    id: 'REQ-2026-000123',
    applicationNo: 'REQ-2026-000123',
    citizenName: 'Ramesh Kumar Patel',
    citizenPhone: '+91 98765 43210',
    surveyNumber: '123/456',
    subdivisionNumber: '1A',
    tehsil: 'Serilingampally',
    district: 'Ranga Reddy',
    village: 'Gachibowli',
    extentAcres: 2.5,
    extentGuntas: 100,
    status: 'pending',
    priority: 'urgent',
    riskScore: 12,
    ulpin: 'ULPIN-36-RR-SER-123-01',
    submittedAt: '2026-09-06T10:15:00Z',
    createdAt: '2026-09-06T10:15:00Z',
    officers: {
      deo: {
        name: 'V. Ramanjaneyulu',
        designation: 'Patwari / Data Entry Officer',
        status: 'completed',
        timestamp: '2026-09-06T12:30:00Z',
        remarks: 'All seller & purchaser particulars cross-verified with Sub-Registrar Book-1 records. Extent matches 2.50 Ac.',
      },
      verifier: {
        name: 'M. Chenna Kesavulu',
        designation: 'Girdawar / Revenue Inspector',
        status: 'completed',
        timestamp: '2026-09-07T09:40:00Z',
        remarks: 'Physical field Pahani matches digital Dharani 1-B Khata. No unrecorded tenancy or encumbrances.',
      },
      legal: {
        name: 'Adv. Rajeshwari Sharma',
        designation: 'Senior Legal Officer',
        status: 'completed',
        timestamp: '2026-09-07T14:15:00Z',
        opinion: 'Clear and marketable title. 30-year non-encumbrance certificate verified. No civil stay or lis pendens caveats.',
      },
      gis: {
        name: 'S. Ramakrishna',
        designation: 'Senior GIS Specialist',
        status: 'completed',
        timestamp: '2026-09-08T07:20:00Z',
        remarks: 'BhooNaksha cadastral boundary verified. 95.2% congruence with official survey sheet. Within 0.3m tolerance.',
      },
    },
    deoRemarks: 'All seller & purchaser particulars cross-verified with Sub-Registrar Book-1 records. Extent matches 2.50 Ac.',
    verifierRemarks: 'Physical field Pahani matches digital Dharani 1-B Khata. No unrecorded tenancy or encumbrances.',
    legalOpinion: 'Clear and marketable title. 30-year non-encumbrance certificate verified. No civil stay or lis pendens caveats.',
    gisRemarks: 'BhooNaksha cadastral boundary verified. 95.2% congruence with official survey sheet. Within 0.3m tolerance.',
    data: {
      property: {
        village: 'Gachibowli',
        tehsil: 'Serilingampally',
        district: 'Ranga Reddy',
        state: 'Telangana',
        surveyNumber: '123/456',
        subdivisionNumber: '1A',
        ulpin: 'ULPIN-36-RR-SER-123-01',
        extentAcres: 2.5,
        extentGuntas: 100,
        landClassification: 'Dry Agricultural (Patta)',
        marketValue: '₹ 1,87,50,000',
      },
      owner: {
        primaryOwner: 'Ramesh Kumar Patel',
        aadhaarMasked: 'XXXX-XXXX-8821',
        phone: '+91 98765 43210',
        relativeName: 'Late Chhaganlal Patel (Father)',
        address: 'Plot 42, Telecom Nagar, Gachibowli, Hyderabad - 500032',
        casteCategory: 'General (OC)',
      },
      document: {
        documentType: 'Registered Sale Deed',
        documentNumber: 'DOC/SRR/4491/2026',
        registrationDate: '2026-08-24',
        subRegistrarOffice: 'SRO Serilingampally',
        stampDutyPaid: '₹ 11,25,000 (Challan #CH-8821-TS)',
      },
    },
  },
  {
    id: 'REV-2026-802',
    applicationNo: 'REV-2026-802',
    citizenName: 'B. Venkatswamy Goud',
    citizenPhone: '+91 99890 22341',
    surveyNumber: '210/B',
    subdivisionNumber: '2',
    tehsil: 'Patancheru',
    district: 'Sangareddy',
    village: 'Muthangi',
    extentAcres: 3.2,
    extentGuntas: 128,
    status: 'pending',
    priority: 'urgent',
    riskScore: 28,
    ulpin: 'ULPIN-36-SR-PAT-210-02',
    submittedAt: '2026-09-07T08:30:00Z',
    createdAt: '2026-09-07T08:30:00Z',
    officers: {
      deo: {
        name: 'K. Sreedhar Rao',
        designation: 'Patwari / Data Entry Officer',
        status: 'completed',
        timestamp: '2026-09-07T10:15:00Z',
        remarks: 'Partition deed entries verified against original registered family settlement patram.',
      },
      verifier: {
        name: 'G. Yadaiah',
        designation: 'Girdawar / Revenue Inspector',
        status: 'completed',
        timestamp: '2026-09-07T13:30:00Z',
        remarks: 'Physical possession confirmed with applicant. Joint boundaries established.',
      },
      legal: {
        name: 'Adv. Rajeshwari Sharma',
        designation: 'Senior Legal Officer',
        status: 'completed',
        timestamp: '2026-09-07T16:00:00Z',
        opinion: 'Partition confirmed under Hindu Succession Act. Legal heirs consent recorded on stamp paper.',
      },
      gis: {
        name: 'S. Ramakrishna',
        designation: 'Senior GIS Specialist',
        status: 'completed',
        timestamp: '2026-09-08T08:15:00Z',
        remarks: 'Minor road buffer deviation resolved with boundary snapping. Adjusted boundary ratified.',
      },
    },
    deoRemarks: 'Partition deed entries verified against original registered family settlement patram.',
    verifierRemarks: 'Physical possession confirmed with applicant. Joint boundaries established.',
    legalOpinion: 'Partition confirmed under Hindu Succession Act. Legal heirs consent recorded on stamp paper.',
    gisRemarks: 'Minor road buffer deviation resolved with boundary snapping. Adjusted boundary ratified.',
    data: {
      property: {
        village: 'Muthangi',
        tehsil: 'Patancheru',
        district: 'Sangareddy',
        state: 'Telangana',
        surveyNumber: '210/B',
        subdivisionNumber: '2',
        ulpin: 'ULPIN-36-SR-PAT-210-02',
        extentAcres: 3.2,
        extentGuntas: 128,
        landClassification: 'Wet Agricultural (Irrigated)',
        marketValue: '₹ 1,44,00,000',
      },
      owner: {
        primaryOwner: 'B. Venkatswamy Goud',
        aadhaarMasked: 'XXXX-XXXX-4412',
        phone: '+91 99890 22341',
        relativeName: 'B. Ramulu Goud (Father)',
        address: 'H.No 3-84, Main Road, Muthangi Village, Patancheru Mandal',
        casteCategory: 'BC-B',
      },
      document: {
        documentType: 'Registered Partition Deed',
        documentNumber: 'DOC/PAT/1902/2026',
        registrationDate: '2026-08-15',
        subRegistrarOffice: 'SRO Patancheru',
        stampDutyPaid: '₹ 2,88,000 (Challan #CH-1902-TS)',
      },
    },
  },
  {
    id: 'REV-2026-803',
    applicationNo: 'REV-2026-803',
    citizenName: 'Mohd. Abdul Qadeer',
    citizenPhone: '+91 94412 88790',
    surveyNumber: '45/3',
    subdivisionNumber: '3',
    tehsil: 'Keesara',
    district: 'Medchal-Malkajgiri',
    village: 'Nagaram',
    extentAcres: 1.75,
    extentGuntas: 70,
    status: 'pending',
    priority: 'normal',
    riskScore: 8,
    ulpin: 'ULPIN-36-MM-KEE-045-04',
    submittedAt: '2026-09-07T16:45:00Z',
    createdAt: '2026-09-07T16:45:00Z',
    officers: {
      deo: {
        name: 'S. Sunitha',
        designation: 'Patwari / Data Entry Officer',
        status: 'completed',
        timestamp: '2026-09-07T17:30:00Z',
        remarks: 'Sale deed particulars fully matched. Link documents from 1994 verified.',
      },
      verifier: {
        name: 'P. Narsing Rao',
        designation: 'Girdawar / Revenue Inspector',
        status: 'completed',
        timestamp: '2026-09-08T08:00:00Z',
        remarks: 'Field boundaries intact. Adjacent pattadars expressed no objections.',
      },
      legal: {
        name: 'Adv. Rajeshwari Sharma',
        designation: 'Senior Legal Officer',
        status: 'completed',
        timestamp: '2026-09-08T08:30:00Z',
        opinion: 'Clean succession chain. No wakf or government ceiling reservations.',
      },
      gis: {
        name: 'S. Ramakrishna',
        designation: 'Senior GIS Specialist',
        status: 'completed',
        timestamp: '2026-09-08T08:50:00Z',
        remarks: 'Cadastral overlap 98.1% congruence. Certified clean polygon.',
      },
    },
    deoRemarks: 'Sale deed particulars fully matched. Link documents from 1994 verified.',
    verifierRemarks: 'Field boundaries intact. Adjacent pattadars expressed no objections.',
    legalOpinion: 'Clean succession chain. No wakf or government ceiling reservations.',
    gisRemarks: 'Cadastral overlap 98.1% congruence. Certified clean polygon.',
    data: {
      property: {
        village: 'Nagaram',
        tehsil: 'Keesara',
        district: 'Medchal-Malkajgiri',
        state: 'Telangana',
        surveyNumber: '45/3',
        subdivisionNumber: '3',
        ulpin: 'ULPIN-36-MM-KEE-045-04',
        extentAcres: 1.75,
        extentGuntas: 70,
        landClassification: 'Dry Agricultural Land',
        marketValue: '₹ 87,50,000',
      },
      owner: {
        primaryOwner: 'Mohd. Abdul Qadeer',
        aadhaarMasked: 'XXXX-XXXX-9912',
        phone: '+91 94412 88790',
        relativeName: 'Mohd. Abdul Rahim (Father)',
        address: 'H.No 12-41, Nagaram Main Road, Keesara',
        casteCategory: 'BC-E',
      },
      document: {
        documentType: 'Sale Deed (Kraya Patram)',
        documentNumber: 'DOC/KEE/7812/2026',
        registrationDate: '2026-08-10',
        subRegistrarOffice: 'SRO Keesara',
        stampDutyPaid: '₹ 5,25,000',
      },
    },
  },
  {
    id: 'REV-2026-804',
    applicationNo: 'REV-2026-804',
    citizenName: 'T. Anand Rao & Smt. Vani',
    citizenPhone: '+91 98660 11234',
    surveyNumber: '312/A',
    subdivisionNumber: 'A',
    tehsil: 'Gandipet',
    district: 'Ranga Reddy',
    village: 'Puppalguda',
    extentAcres: 4.1,
    extentGuntas: 164,
    status: 'pending',
    priority: 'normal',
    riskScore: 34,
    ulpin: 'ULPIN-36-RR-GAN-312-05',
    submittedAt: '2026-09-08T06:00:00Z',
    createdAt: '2026-09-08T06:00:00Z',
    officers: {
      deo: {
        name: 'M. Sridevi',
        designation: 'Patwari / Data Entry Officer',
        status: 'completed',
        timestamp: '2026-09-08T07:15:00Z',
        remarks: 'Development Agreement cum GPA details entered and matched with registered deed.',
      },
      verifier: {
        name: 'K. Balaji Prasad',
        designation: 'Girdawar / Revenue Inspector',
        status: 'completed',
        timestamp: '2026-09-08T08:00:00Z',
        remarks: 'Land inspected. Eastern parcel abuts Puppalguda lake buffer.',
      },
      legal: {
        name: 'Adv. Rajeshwari Sharma',
        designation: 'Senior Legal Officer',
        status: 'completed',
        timestamp: '2026-09-08T08:30:00Z',
        opinion: 'GPA valid. Subject to GIS confirmation on FTL buffer restrictions.',
      },
      gis: {
        name: 'S. Ramakrishna',
        designation: 'Senior GIS Specialist',
        status: 'completed',
        timestamp: '2026-09-08T09:00:00Z',
        remarks: 'Lake FTL buffer 4.5m offset noticed. Adjusted coordinates submitted for Tahsildar clearance.',
      },
    },
    deoRemarks: 'Development Agreement cum GPA details entered and matched with registered deed.',
    verifierRemarks: 'Land inspected. Eastern parcel abuts Puppalguda lake buffer.',
    legalOpinion: 'GPA valid. Subject to GIS confirmation on FTL buffer restrictions.',
    gisRemarks: 'Lake FTL buffer 4.5m offset noticed. Adjusted coordinates submitted for Tahsildar clearance.',
    data: {
      property: {
        village: 'Puppalguda',
        tehsil: 'Gandipet',
        district: 'Ranga Reddy',
        state: 'Telangana',
        surveyNumber: '312/A',
        subdivisionNumber: 'A',
        ulpin: 'ULPIN-36-RR-GAN-312-05',
        extentAcres: 4.1,
        extentGuntas: 164,
        landClassification: 'Dry Agricultural (Buffer Proximity)',
        marketValue: '₹ 4,10,00,000',
      },
      owner: {
        primaryOwner: 'T. Anand Rao & Smt. Vani',
        aadhaarMasked: 'XXXX-XXXX-1123',
        phone: '+91 98660 11234',
        relativeName: 'T. Venkatesh (Father)',
        address: 'Villa 18, Golden Glades, Puppalguda, Gandipet',
        casteCategory: 'General (OC)',
      },
      document: {
        documentType: 'Development Agreement cum GPA',
        documentNumber: 'DOC/GAN/3110/2026',
        registrationDate: '2026-08-30',
        subRegistrarOffice: 'SRO Gandipet',
        stampDutyPaid: '₹ 20,50,000',
      },
    },
  },
  {
    id: 'REV-2026-805',
    applicationNo: 'REV-2026-805',
    citizenName: 'S. Narayana Swamy',
    citizenPhone: '+91 98490 77123',
    surveyNumber: '99/2',
    subdivisionNumber: '2',
    tehsil: 'Rajendranagar',
    district: 'Ranga Reddy',
    village: 'Shamshabad',
    extentAcres: 2.2,
    extentGuntas: 88,
    status: 'pending',
    priority: 'normal',
    riskScore: 18,
    ulpin: 'ULPIN-36-RR-RAJ-099-06',
    submittedAt: '2026-09-08T07:15:00Z',
    createdAt: '2026-09-08T07:15:00Z',
    officers: {
      deo: {
        name: 'Ch. Venkat',
        designation: 'Patwari / Data Entry Officer',
        status: 'completed',
        timestamp: '2026-09-08T08:00:00Z',
        remarks: 'Seller particulars validated.',
      },
      verifier: {
        name: 'M. Chenna Kesavulu',
        designation: 'Girdawar / Revenue Inspector',
        status: 'completed',
        timestamp: '2026-09-08T08:30:00Z',
        remarks: 'Clear of revenue dues and water tax arrears.',
      },
      legal: {
        name: 'Adv. Rajeshwari Sharma',
        designation: 'Senior Legal Officer',
        status: 'completed',
        timestamp: '2026-09-08T09:00:00Z',
        opinion: 'Title marketable.',
      },
      gis: {
        name: 'S. Ramakrishna',
        designation: 'Senior GIS Specialist',
        status: 'completed',
        timestamp: '2026-09-08T09:15:00Z',
        remarks: 'Clean boundary verification.',
      },
    },
    deoRemarks: 'Seller particulars validated.',
    verifierRemarks: 'Clear of revenue dues and water tax arrears.',
    legalOpinion: 'Title marketable.',
    gisRemarks: 'Clean boundary verification.',
    data: {
      property: {
        village: 'Shamshabad',
        tehsil: 'Rajendranagar',
        district: 'Ranga Reddy',
        state: 'Telangana',
        surveyNumber: '99/2',
        subdivisionNumber: '2',
        ulpin: 'ULPIN-36-RR-RAJ-099-06',
        extentAcres: 2.2,
        extentGuntas: 88,
        landClassification: 'Dry Patta Land',
        marketValue: '₹ 1,10,00,000',
      },
      owner: {
        primaryOwner: 'S. Narayana Swamy',
        aadhaarMasked: 'XXXX-XXXX-9901',
        phone: '+91 98490 77123',
        relativeName: 'S. Papaiah (Father)',
        address: 'H.No 4-12, Station Road, Shamshabad',
        casteCategory: 'BC-A',
      },
      document: {
        documentType: 'Registered Sale Deed',
        documentNumber: 'DOC/RAJ/4120/2026',
        registrationDate: '2026-09-01',
        subRegistrarOffice: 'SRO Rajendranagar',
        stampDutyPaid: '₹ 6,60,000',
      },
    },
  },
  {
    id: 'REV-2026-806',
    applicationNo: 'REV-2026-806',
    citizenName: 'K. Srinivasa Rao',
    citizenPhone: '+91 94401 55678',
    surveyNumber: '154/B',
    subdivisionNumber: '1',
    tehsil: 'Serilingampally',
    district: 'Ranga Reddy',
    village: 'Miyapur',
    extentAcres: 1.8,
    extentGuntas: 72,
    status: 'approved',
    priority: 'high',
    riskScore: 6,
    ulpin: 'ULPIN-36-RR-SER-154-08',
    submittedAt: '2026-09-05T09:10:00Z',
    createdAt: '2026-09-05T09:10:00Z',
    officers: {
      deo: { name: 'V. Ramanjaneyulu', status: 'completed' },
      verifier: { name: 'M. Chenna Kesavulu', status: 'completed' },
      legal: { name: 'Adv. Rajeshwari Sharma', status: 'completed' },
      gis: { name: 'S. Ramakrishna', status: 'completed' },
    },
    deoRemarks: 'Title deeds verified.',
    verifierRemarks: 'Field inspection clean.',
    legalOpinion: 'Clean title.',
    gisRemarks: 'Boundaries verified.',
    tehsildarRemarks: 'Approved and mutation order issued.',
    mutationId: 'MUT-TG-2026-9812',
    certificateUrl: '/certificates/CERT-2026-806.pdf',
    data: {
      property: {
        village: 'Miyapur',
        tehsil: 'Serilingampally',
        district: 'Ranga Reddy',
        state: 'Telangana',
        surveyNumber: '154/B',
        extentAcres: 1.8,
        extentGuntas: 72,
        landClassification: 'Patta Land',
        marketValue: '₹ 1,35,00,000',
      },
      owner: {
        primaryOwner: 'K. Srinivasa Rao',
        aadhaarMasked: 'XXXX-XXXX-6612',
        phone: '+91 94401 55678',
        relativeName: 'K. Narayana Rao',
        address: 'Miyapur, Hyderabad',
      },
      document: {
        documentType: 'Sale Deed',
        documentNumber: 'DOC/SER/9812/2026',
        registrationDate: '2026-08-20',
        subRegistrarOffice: 'SRO Serilingampally',
        stampDutyPaid: '₹ 8,10,000',
      },
    },
  },
  {
    id: 'REV-2026-807',
    applicationNo: 'REV-2026-807',
    citizenName: 'P. Vijay Kumar',
    citizenPhone: '+91 98850 33412',
    surveyNumber: '88/1',
    subdivisionNumber: '3',
    tehsil: 'Patancheru',
    district: 'Sangareddy',
    village: 'Ismailkhanpet',
    extentAcres: 3.5,
    extentGuntas: 140,
    status: 'rejected',
    priority: 'normal',
    riskScore: 78,
    ulpin: 'ULPIN-36-SR-PAT-088-09',
    submittedAt: '2026-09-04T11:20:00Z',
    createdAt: '2026-09-04T11:20:00Z',
    officers: {
      deo: { name: 'K. Sreedhar Rao', status: 'completed' },
      verifier: { name: 'G. Yadaiah', status: 'rejected' },
      legal: { name: 'Adv. Rajeshwari Sharma', status: 'rejected' },
      gis: { name: 'S. Ramakrishna', status: 'completed' },
    },
    rejectionReason: 'Encroachment on assigned government land buffer',
    tehsildarRemarks: 'Rejected by Executive Order due to boundary overlap with statutory government land parcel.',
    data: {
      property: {
        village: 'Ismailkhanpet',
        tehsil: 'Patancheru',
        district: 'Sangareddy',
        state: 'Telangana',
        surveyNumber: '88/1',
        extentAcres: 3.5,
        extentGuntas: 140,
        landClassification: 'Assigned / Prohibited (Sec 22A)',
        marketValue: '₹ 1,57,50,000',
      },
      owner: {
        primaryOwner: 'P. Vijay Kumar',
        aadhaarMasked: 'XXXX-XXXX-3341',
        phone: '+91 98850 33412',
        relativeName: 'P. Mallaiah',
        address: 'Ismailkhanpet, Patancheru',
      },
      document: {
        documentType: 'Gift Deed',
        documentNumber: 'DOC/PAT/8812/2026',
        registrationDate: '2026-08-10',
        subRegistrarOffice: 'SRO Patancheru',
        stampDutyPaid: '₹ 4,50,000',
      },
    },
  },
];

const INITIAL_HISTORY: RevenueHistoryRecord[] = [
  {
    id: 'HIST-REV-001',
    applicationId: 'REV-2026-798',
    applicationNo: 'REV-2026-798',
    citizenName: 'K. Somi Reddy',
    surveyNumber: '77/1',
    tehsil: 'Serilingampally',
    village: 'Hafeezpet',
    action: 'APPROVED',
    ulpin: 'ULPIN-36-RR-SER-077-98',
    mutationId: 'MUT-TG-2026-8812',
    remarks: 'Approved & Mutation triggered in Telangana Dharani. Title verified.',
    timestamp: '2026-09-08T07:45:00Z',
    officerName: 'Dr. K. V. Ramanathan',
    officerDesignation: 'Tahsildar & Executive Magistrate',
  },
  {
    id: 'HIST-REV-002',
    applicationId: 'REV-2026-799',
    applicationNo: 'REV-2026-799',
    citizenName: 'P. Vijaya Lakshmi',
    surveyNumber: '142/A',
    tehsil: 'Serilingampally',
    village: 'Chandanagar',
    action: 'CERTIFICATE_ISSUED',
    ulpin: 'ULPIN-36-RR-SER-142-99',
    mutationId: 'MUT-TG-2026-8813',
    remarks: 'Bhooraksha Verification Report issued with QR endorsement.',
    timestamp: '2026-09-08T08:15:00Z',
    officerName: 'Dr. K. V. Ramanathan',
    officerDesignation: 'Tahsildar & Executive Magistrate',
  },
  {
    id: 'HIST-REV-003',
    applicationId: 'REV-2026-800',
    applicationNo: 'REV-2026-800',
    citizenName: 'Ch. Madhusudhan Rao',
    surveyNumber: '55/3',
    tehsil: 'Gandipet',
    village: 'Narsingi',
    action: 'REJECTED',
    reason: 'Civil Court Injunction / Legal Block',
    remarks: 'Court stay order active under Order 39 CPC in OS 412/2024. Mutation rejected.',
    timestamp: '2026-09-08T08:45:00Z',
    officerName: 'Dr. K. V. Ramanathan',
    officerDesignation: 'Tahsildar & Executive Magistrate',
  },
];

export const useRevenueStore = create<RevenueState>((set, get) => ({
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

  selectAllApplications: (ids) =>
    set(() => ({
      selectedApplicationIds: ids,
    })),

  clearSelection: () =>
    set(() => ({
      selectedApplicationIds: [],
    })),

  approveApplication: async (id, remarks) => {
    const app = get().applications.find((a) => a.id === id);
    if (!app) return;

    const generatedUlpin = app.ulpin || `ULPIN-36-RR-${app.tehsil.slice(0, 3).toUpperCase()}-${app.surveyNumber.replace(/[^0-9]/g, '')}-${Date.now().toString().slice(-2)}`;
    const mutationId = `MUT-TG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newHistoryItem: RevenueHistoryRecord = {
      id: `HIST-REV-${Date.now()}`,
      applicationId: app.id,
      applicationNo: app.applicationNo,
      citizenName: app.citizenName,
      surveyNumber: app.surveyNumber,
      tehsil: app.tehsil,
      village: app.village,
      action: 'APPROVED',
      ulpin: generatedUlpin,
      mutationId,
      remarks: remarks || 'Approved by Executive Magistrate. Mutation packet dispatched to State Registry.',
      timestamp: new Date().toISOString(),
      officerName: 'Dr. K. V. Ramanathan',
      officerDesignation: 'Tahsildar & Executive Magistrate',
    };

    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'approved',
              ulpin: generatedUlpin,
              mutationStatus: 'TRIGGERED',
              mutationId,
              tehsildarRemarks: remarks,
            }
          : a
      ),
      history: [newHistoryItem, ...state.history],
    }));
  },

  rejectApplication: async (id, reason, remarks) => {
    const app = get().applications.find((a) => a.id === id);
    if (!app) return;

    const newHistoryItem: RevenueHistoryRecord = {
      id: `HIST-REV-${Date.now()}`,
      applicationId: app.id,
      applicationNo: app.applicationNo,
      citizenName: app.citizenName,
      surveyNumber: app.surveyNumber,
      tehsil: app.tehsil,
      village: app.village,
      action: 'REJECTED',
      reason,
      remarks: remarks || `Rejected by Executive Order: ${reason}`,
      timestamp: new Date().toISOString(),
      officerName: 'Dr. K. V. Ramanathan',
      officerDesignation: 'Tahsildar & Executive Magistrate',
    };

    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'rejected',
              rejectionReason: reason,
              tehsildarRemarks: remarks,
            }
          : a
      ),
      history: [newHistoryItem, ...state.history],
    }));
  },

  generateCertificate: async (id) => {
    const app = get().applications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');

    const certUrl = `https://bhooraksha.gov.in/certificates/verify?id=${app.id}&ulpin=${app.ulpin || 'ULPIN-VALID'}&auth=sha256-verified`;

    const newHistoryItem: RevenueHistoryRecord = {
      id: `HIST-REV-${Date.now()}`,
      applicationId: app.id,
      applicationNo: app.applicationNo,
      citizenName: app.citizenName,
      surveyNumber: app.surveyNumber,
      tehsil: app.tehsil,
      village: app.village,
      action: 'CERTIFICATE_ISSUED',
      ulpin: app.ulpin,
      remarks: 'Digital title certificate generated and cryptographically signed with Revenue Seal.',
      timestamp: new Date().toISOString(),
      officerName: 'Dr. K. V. Ramanathan',
      officerDesignation: 'Tahsildar & Executive Magistrate',
    };

    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              certificateUrl: certUrl,
            }
          : a
      ),
      history: [newHistoryItem, ...state.history],
    }));

    return certUrl;
  },

  batchApprove: async (ids, remarks) => {
    for (const id of ids) {
      await get().approveApplication(id, remarks || 'Bulk approval by Tahsildar');
    }
    set({ selectedApplicationIds: [] });
  },

  batchReject: async (ids, reason, remarks) => {
    for (const id of ids) {
      await get().rejectApplication(id, reason, remarks || 'Bulk rejection by Tahsildar');
    }
    set({ selectedApplicationIds: [] });
  },

  getStats: () => {
    const apps = get().applications;
    const history = get().history;

    const total = 142; // District-wide total
    const pending = apps.filter((a) => a.status === 'pending').length;
    const approved = 89;
    const rejected = 14;
    const mutations = 85;
    const certificates = 78;

    return {
      total,
      pending,
      approved,
      rejected,
      mutations,
      certificates,
      todayApproved: 3,
      todayRejected: 1,
      todayMutations: 2,
      todayCertificates: 3,
    };
  },

  getTehsilStats: () => [
    {
      tehsil: 'Serilingampally',
      total: 48,
      pending: 2,
      approved: 42,
      rejected: 4,
      approvalRate: 91.3,
      avgProcessingHours: 18.5,
    },
    {
      tehsil: 'Patancheru',
      total: 34,
      pending: 1,
      approved: 28,
      rejected: 5,
      approvalRate: 84.8,
      avgProcessingHours: 22.1,
    },
    {
      tehsil: 'Gandipet',
      total: 26,
      pending: 1,
      approved: 22,
      rejected: 3,
      approvalRate: 88.0,
      avgProcessingHours: 19.8,
    },
    {
      tehsil: 'Keesara',
      total: 20,
      pending: 1,
      approved: 18,
      rejected: 1,
      approvalRate: 94.7,
      avgProcessingHours: 14.2,
    },
    {
      tehsil: 'Rajendranagar',
      total: 14,
      pending: 1,
      approved: 12,
      rejected: 1,
      approvalRate: 92.3,
      avgProcessingHours: 16.0,
    },
  ],

  getStatusStats: () => [
    {
      status: 'approved',
      label: 'Approved & Mutation Dispatched',
      count: 89,
      percentage: 62.7,
      color: '#10b981',
    },
    {
      status: 'pending',
      label: 'Pending Final Ratification',
      count: 5,
      percentage: 3.5,
      color: '#f59e0b',
    },
    {
      status: 'mutation_completed',
      label: 'Mutation Verified in RoR',
      count: 34,
      percentage: 23.9,
      color: '#06b6d4',
    },
    {
      status: 'rejected',
      label: 'Rejected by Order',
      count: 14,
      percentage: 9.9,
      color: '#ef4444',
    },
  ],
}));
