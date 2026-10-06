export type ApplicationStatus =
  | 'pending_verification'
  | 'under_verifier_review'
  | 'approved'
  | 'verified_by_verifier'
  | 'approved_and_forwarded'
  | 'rejected'
  | 'rejected_by_verifier'
  | 'returned_to_deo'
  | 'returned_to_verifier'
  | 'escalated_to_revenue'
  | 'revenue_admin_review'
  | 'deo_forwarded'
  | 'ai_direct'
  | 'final_approved'
  | 'completed'
  | string;

export type PriorityLevel = 'high' | 'medium' | 'low';

export type ApplicationSource = 'deo_forwarded' | 'ai_direct';

export interface ValidationItem {
  id: string;
  field: string;
  label: string;
  documentValue: string;
  govtValue: string;
  status: 'MATCH' | 'PARTIAL' | 'MISMATCH' | 'NOT_AVAILABLE';
  confidence: number;
  explanation?: string;
  sourceDoc?: string;
  sourcePage?: number;
}

export interface TransactionRecordItem {
  id: string;
  year: string;
  transactionType: 'SALE' | 'MUTATION' | 'INHERITANCE' | 'GIFT' | 'PARTITION';
  date: string;
  fromOwner: string;
  toOwner: string;
  documentNumber: string;
  registrationNumber: string;
  mutationNumber?: string;
  sourceRegister: string;
  remarks: string;
}

export interface ExtractedData {
  propertyDetails: {
    state: string;
    district: string;
    taluk: string;
    village: string;
    surveyNumber: string;
    hissaNumber?: string;
    ulpin: string;
  };
  ownerDetails: {
    name: string;
    fatherName: string;
    share: string;
    previousOwner: string;
  };
  landDetails: {
    totalArea: string;
    areaUnit: string;
    landType: string;
    currentUsage: string;
    boundaries: {
      north: string;
      south: string;
      east: string;
      west: string;
    };
  };
  documentDetails: {
    documentType: string;
    documentNumber: string;
    registrationNumber: string;
    registrationDate: string;
    issuingAuthority: string;
    mutationNumber?: string;
  };
}

export interface GovtRecord {
  propertyDetails: {
    state: string;
    district: string;
    taluk: string;
    village: string;
    surveyNumber: string;
    hissaNumber?: string;
    ulpin: string;
  };
  ownerDetails: {
    name: string;
    fatherName: string;
    share: string;
    previousOwner: string;
  };
  landDetails: {
    totalArea: string;
    areaUnit: string;
    landType: string;
    currentUsage: string;
    boundaries: {
      north: string;
      south: string;
      east: string;
      west: string;
    };
  };
  documentDetails: {
    documentType: string;
    documentNumber: string;
    registrationNumber: string;
    registrationDate: string;
    issuingAuthority: string;
    mutationNumber?: string;
  };
  sourceRegister: string;
  lastUpdated: string;
  verifiedByDeo?: boolean;
  serviceStatus?: 'ONLINE' | 'UNAVAILABLE';
}

export interface ActionHistoryItem {
  id: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  remarks: string;
  previousStatus: string;
  newStatus: string;
  nextStage: string;
  nextAssignedRole?: string;
  nextAssignedOfficer?: string;
  reason?: string;
  requiredCorrection?: string;
  requestedDoc?: string;
  versionNumber: number;
  auditHash: string;
  prevHash: string;
  reviewCycle?: number;
}

export interface VerificationCompleteness {
  documents: boolean;
  aiExtraction: boolean;
  crossDocumentValidation: boolean;
  gisValidation: boolean;
  legalEncumbranceCheck: boolean;
  govtRecord: boolean;
  previousTransactionHistory: boolean;
  verifierRemarks: boolean;
  missingFields: string[];
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  required: boolean;
  available: boolean;
  url?: string;
  docTypeKey?: string;
  pageCount?: number;
  uploadedDate?: string;
}

export interface DEOCorrectionItem {
  id: string;
  field: string;
  aiOriginalValue: string;
  deoCorrectedValue: string;
  sourceDoc: string;
  sourcePage: number;
  reason: string;
  timestamp: string;
  deoOfficer: string;
}

export interface GISData {
  recordedArea: number;
  calculatedArea: number;
  difference: number;
  tolerance: number;
  unit: string;
  result: 'WITHIN_TOLERANCE' | 'POTENTIAL_AREA_MISMATCH';
  surveyNumber: string;
  hissaNumber?: string;
  neighboringParcels: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  polygonCoordinates?: Array<[number, number]>;
  boundaryStatusText?: string;
}

export interface LegalCheckData {
  searchPeriodYears: number;
  ecReferenceNumber: string;
  sroOffice: string;
  searchDate: string;
  encumbranceStatus: 'CLEAR' | 'ENCUMBERED' | 'PROVISIONAL_REVIEW';
  activeEncumbranceCount: number;
  isSimulatedDemo: boolean;
  sourceText?: string;
}

export interface VerificationChecklistState {
  documentsReviewed: boolean;
  identityProofChecked: boolean;
  ownerInfoChecked: boolean;
  surveyNumberChecked: boolean;
  areaChecked: boolean;
  registrationDetailsChecked: boolean;
  mutationDetailsChecked: boolean;
  transactionHistoryChecked: boolean;
  govtRecordCrossChecked: boolean;
  gisResultReviewed: boolean;
  conflictsReviewed: boolean;
  verifierRemarksEntered: boolean;
}

export interface VerifierApplication {
  id: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  surveyNumber: string;
  hissaNumber?: string;
  village?: string;
  mandal?: string;
  district?: string;
  documentType: string;
  documentNumber?: string;
  registrationNumber?: string;
  documentUrl: string;
  status: ApplicationStatus;
  currentStatus?: ApplicationStatus;
  previousStatus?: ApplicationStatus;
  currentStage?: string;
  assignedOfficer?: string;
  assignedRole?: string;
  decision?: string;
  decisionReason?: string;
  officerRemarks?: string;
  decisionTimestamp?: string;
  nextAssignedRole?: string;
  nextAssignedOfficer?: string;
  actionHistory: ActionHistoryItem[];
  versionNumber: number;
  auditHash: string;
  reviewCycleNumber?: number;
  verificationCompleteness?: VerificationCompleteness;
  riskScore: number;
  priority: PriorityLevel;
  source: ApplicationSource;
  deoName?: string;
  deoRemarks?: string;
  deoForwardedAt?: string;
  createdAt: string;
  forwardedDate?: string;
  lastUpdated?: string;
  transactionType?: string;
  extractedData: ExtractedData;
  govtRecord: GovtRecord;
  validationResults: ValidationItem[];
  verificationNotes?: string;
  decisionDate?: string;
  decisionBy?: string;
  rejectionReason?: string;
  // Enhanced Operational Data
  documentsList?: DocumentItem[];
  deoCorrections?: DEOCorrectionItem[];
  gisData?: GISData;
  legalCheck?: LegalCheckData;
  transactionHistory?: TransactionRecordItem[];
  checklist?: VerificationChecklistState;
  attentionSummary?: {
    documentsMissing: number;
    conflictsDetected: number;
    gisFlags: number;
    duplicateFlags: number;
    returnedApplications: number;
    ownerNameMismatch: boolean;
    surveyNumberMatch: boolean;
    areaMatch: boolean;
    regDateDiff: boolean;
    gisAreaDiff: boolean;
    potentialDuplicate: boolean;
  };
}

export interface HistoryRecord {
  id: string;
  applicationId: string;
  citizenName: string;
  surveyNumber: string;
  action: 'APPROVED' | 'APPROVED_AND_FORWARDED' | 'REJECTED' | 'RETURNED_TO_DEO' | 'ESCALATED_TO_REVENUE' | 'REOPENED';
  reason?: string;
  remarks: string;
  timestamp: string;
  verifierName: string;
  previousStatus?: string;
  newStatus?: string;
  nextStage?: string;
  auditHash?: string;
  versionNumber?: number;
  reviewCycle?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'error';
  applicationId?: string;
  read?: boolean;
}

export interface StatsResponse {
  pending: number;
  verifiedToday: number; // completed reviews count today
  completedReviewsToday: number;
  approvedToday: number;
  rejectedToday: number;
  returnedToday: number;
  escalatedToday: number;
  approvalRate: number;
  highRisk: number;
  attentionSummary: {
    documentsMissing: number;
    conflictsDetected: number;
    gisFlags: number;
    duplicateFlags: number;
    returnedApplications: number;
  };
}

export interface User {
  id: string;
  name: string;
  role: 'verifier';
  email: string;
  phone: string;
  designation: string;
  department: string;
  office: string;
  jurisdiction: string;
  district?: string;
  mandal?: string;
  assignedVillages?: string[];
  accountStatus?: string;
  lastLogin?: string;
  dscStatus?: string;
  token?: string;
}
