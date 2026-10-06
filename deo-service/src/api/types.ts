export type ApplicationStatus =
  | 'PENDING_DEO_REVIEW'
  | 'READY_TO_FORWARD'
  | 'READY_FOR_VERIFIER'
  | 'NEEDS_ATTENTION'
  | 'MISSING_DOCUMENTS'
  | 'API_FAILURE_MANUAL_ENTRY'
  | 'ROUTED_TO_VERIFIER'
  | 'CORRECTION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'LEGAL_REVIEW'
  | 'GIS_REVIEW';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ValidationStatus = 'MATCH' | 'PARTIAL' | 'MISMATCH' | 'NOT_AVAILABLE';

export interface ValidationItem {
  field: string;
  documentValue: string;
  govtValue: string;
  status: ValidationStatus;
  explanation: string;
  category?: 'SURVEY' | 'OWNER' | 'AREA' | 'REGISTRATION' | 'LEGAL' | 'GIS';
}

export interface FieldExtractionMeta {
  value: string | number;
  confidence: number; // 0 - 100
  sourceDoc: string;
  page?: number | string;
  line?: string;
  rawOcrSnippet?: string;
  isAutoVerified?: boolean;
  isCorrected?: boolean;
  originalAiValue?: string | number;
  correctedBy?: string;
  correctionReason?: string;
  correctionTimestamp?: string;
}

export interface PropertyDetails {
  state: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  subDivision?: string;
  ulpin?: string;
  meta?: Record<string, FieldExtractionMeta>;
}

export interface OwnerDetails {
  name: string;
  fatherOrSpouse?: string;
  share?: string;
  previousOwner?: string;
  panOrAadhaarLast4?: string;
  maskedAadhaar?: string;
  meta?: Record<string, FieldExtractionMeta>;
}

export interface LandDetails {
  area: number;
  unit: string;
  landType: string;
  usage?: string;
  boundaries: {
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
  meta?: Record<string, FieldExtractionMeta>;
}

export interface DocumentDetails {
  type: string;
  number: string;
  registrationNumber?: string;
  registrationDate?: string;
  issuingAuthority?: string;
  mutationNumber?: string;
  sroOffice?: string;
  meta?: Record<string, FieldExtractionMeta>;
}

export interface ExtractedData {
  propertyDetails: PropertyDetails;
  ownerDetails: OwnerDetails;
  landDetails: LandDetails;
  documentDetails: DocumentDetails;
}

export interface GovtRecord {
  propertyDetails: PropertyDetails;
  ownerDetails: OwnerDetails;
  landDetails: LandDetails;
  documentDetails: DocumentDetails;
  khataNumber?: string;
  lastUpdated?: string;
  disputeFlag?: boolean;
}

export interface DocumentDossierItem {
  id: string;
  name: string;
  type:
    | 'Registered Sale Deed'
    | 'Gift Deed (Daanam)'
    | 'Partition Deed'
    | 'Inheritance / Succession'
    | 'RoR / Pattadar Record (1-B)'
    | 'Mutation Record'
    | 'Cadastral Map (FMB)'
    | 'Encumbrance Certificate'
    | 'Identity Proof (Masked)'
    | 'Other Supporting Document';
  status: 'UPLOADED' | 'PROCESSED' | 'MISSING' | 'NEEDS_RESCAN';
  pagesCount: number;
  size: string;
  confidence: number;
  uploadTimestamp: string;
}

export interface FieldCorrectionRecord {
  id: string;
  applicationId: string;
  field: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  originalAiValue?: string;
  correctedValue?: string;
  officerId: string;
  officer: string;
  officerName: string;
  timestamp: string;
  isoTimestamp?: string;
  reason: string;
  sourceDoc?: string;
  sha256Digest?: string;
}

export interface CompletenessItem {
  key: string;
  label: string;
  status: 'COMPLETE' | 'PARTIAL' | 'MISSING';
  docType?: string;
  details?: string;
}

export interface DEOApplication {
  id: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  documentType: string;
  submissionDate: string;
  status: ApplicationStatus;
  priority: PriorityLevel;
  riskScore: number;
  confidenceCategory: 'HIGH' | 'MEDIUM' | 'LOW';
  fileName: string;
  fileSize: number;
  documentUrl?: string;
  govtApiStatus: 'available' | 'failed';
  extractedData: ExtractedData;
  govtRecord?: GovtRecord;
  validationResults: ValidationItem[];
  documentsDossier?: DocumentDossierItem[];
  completenessCheck?: CompletenessItem[];
  fieldCorrections?: FieldCorrectionRecord[];
  remarks?: string;
  assignedVerifierId?: string;
  historyLogs?: {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    notes?: string;
  }[];
}

export interface DEOStats {
  pending: number;
  apiFailures: number;
  reviewedToday: number;
  sentToVerifier: number;
  readyToForward: number;
  needsAttention: number;
  criticalIssues: number;
  missingDocuments: number;
}

export interface Verifier {
  id: string;
  name: string;
  designation: string;
  district: string;
  mandal: string;
  activeQueueCount: number;
}

export interface HistoryRecord {
  id: string;
  applicationId: string;
  citizenName: string;
  surveyNumber: string;
  action:
    | 'ROUTED_TO_VERIFIER'
    | 'READY_FOR_VERIFIER'
    | 'CORRECTIONS_SAVED'
    | 'CORRECTION_REQUIRED'
    | 'MANUAL_ENTRY_SAVED'
    | 'LEGAL_REQUESTED'
    | 'GIS_REQUESTED'
    | 'FIELD_CORRECTED'
    | 'BULK_INGESTED';
  targetOfficer?: string;
  remarks: string;
  timestamp: string;
  priority: PriorityLevel;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'deo';
  designation: string;
  office: string;
  district: string;
  state: string;
  languagePreference: string;
}

export interface ManualEntryPayload {
  state: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  ulpin?: string;
  ownerName: string;
  fatherName?: string;
  share?: string;
  previousOwner?: string;
  area: number;
  areaUnit: string;
  landType: string;
  currentUsage?: string;
  boundaryNorth?: string;
  boundarySouth?: string;
  boundaryEast?: string;
  boundaryWest?: string;
  documentType: string;
  documentNumber: string;
  registrationNumber?: string;
  registrationDate?: string;
  issuingAuthority?: string;
  mutationNumber?: string;
}
