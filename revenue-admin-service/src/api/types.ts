export type OfficerReviewStatus = 'completed' | 'pending' | 'rejected';

export interface OfficerInfo {
  name: string;
  designation?: string;
  status: OfficerReviewStatus;
  timestamp?: string;
  remarks?: string;
  opinion?: string;
}

export type RevenueApplicationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'mutation_pending'
  | 'mutation_completed'
  | 'mutation_failed';

export type PriorityLevel = 'urgent' | 'high' | 'normal' | 'low';

export interface PropertyData {
  village: string;
  tehsil: string;
  district: string;
  state: string;
  surveyNumber: string;
  subdivisionNumber?: string;
  ulpin?: string;
  extentAcres: number;
  extentGuntas: number;
  landClassification: string;
  marketValue: string;
}

export interface OwnerData {
  primaryOwner: string;
  aadhaarMasked: string;
  phone: string;
  relativeName: string;
  address: string;
  casteCategory?: string;
}

export interface DocumentData {
  documentType: string;
  documentNumber: string;
  registrationDate: string;
  subRegistrarOffice: string;
  stampDutyPaid: string;
}

export interface CompleteApplicationData {
  property: PropertyData;
  owner: OwnerData;
  document: DocumentData;
}

export interface RevenueApplication {
  id: string;
  applicationNo: string;
  citizenName: string;
  citizenPhone: string;
  surveyNumber: string;
  subdivisionNumber?: string;
  tehsil: string;
  district: string;
  village: string;
  extentAcres: number;
  extentGuntas: number;
  status: RevenueApplicationStatus;
  priority: PriorityLevel;
  riskScore: number;
  ulpin?: string;
  submittedAt: string;
  createdAt: string;
  officers: {
    deo: OfficerInfo;
    verifier: OfficerInfo;
    legal: OfficerInfo;
    gis: OfficerInfo;
  };
  deoRemarks?: string;
  verifierRemarks?: string;
  legalOpinion?: string;
  gisRemarks?: string;
  tehsildarRemarks?: string;
  rejectionReason?: string;
  certificateUrl?: string;
  mutationStatus?: 'PENDING' | 'TRIGGERED' | 'CONFIRMED' | 'FAILED';
  mutationId?: string;
  data: CompleteApplicationData;
}

export interface RevenueStatsResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  mutations: number;
  certificates: number;
  todayApproved: number;
  todayRejected: number;
  todayMutations: number;
  todayCertificates: number;
}

export interface TehsilStat {
  tehsil: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  avgProcessingHours: number;
}

export interface StatusStat {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RevenueHistoryRecord {
  id: string;
  applicationId: string;
  applicationNo: string;
  citizenName: string;
  surveyNumber: string;
  tehsil: string;
  village: string;
  action: 'APPROVED' | 'REJECTED' | 'CERTIFICATE_ISSUED' | 'MUTATION_TRIGGERED';
  ulpin?: string;
  mutationId?: string;
  reason?: string;
  remarks: string;
  timestamp: string;
  officerName: string;
  officerDesignation: string;
}

export interface RevenueUser {
  id: string;
  name: string;
  role: 'revenue';
  email: string;
  phone: string;
  designation: string;
  office: string;
  district: string;
  jurisdiction: string;
  employeeId: string;
  token?: string;
}
