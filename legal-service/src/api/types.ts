export type LegalSeverity = 'high' | 'medium' | 'low';

export type LegalApplicationStatus =
  | 'pending_legal_review'
  | 'cleared_by_legal'
  | 'flagged_by_legal'
  | 'blocked_by_legal'
  | 'escalated_by_legal';

export type PriorityLevel = 'urgent' | 'normal' | 'low';

export interface LegalFlag {
  id: string;
  type:
    | 'ownership_inconsistency'
    | 'registration_irregularity'
    | 'document_fraud'
    | 'under_litigation'
    | 'invalid_title'
    | 'non_transferable'
    | 'missing_legal_documents'
    | 'suspicious_transfer'
    | 'succession_issue'
    | 'encumbrance_concern'
    | 'stamp_duty_issue';
  title: string;
  description: string;
  severity: LegalSeverity;
  recommendation: string;
  source: 'ai' | 'manual';
  detectedAt?: string;
  citation?: string;
}

export interface ExtractedData {
  propertyDetails: {
    state: string;
    district: string;
    taluk: string;
    village: string;
    surveyNumber: string;
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
}

export interface LegalApplication {
  id: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  surveyNumber: string;
  documentType: string;
  documentUrl: string;
  status: LegalApplicationStatus;
  legalRiskScore: number;
  severity: LegalSeverity;
  priority: PriorityLevel;
  legalFlagsCount: number;
  legalFlags: LegalFlag[];
  extractedData: ExtractedData;
  govtRecord: GovtRecord;
  legalOpinion?: string;
  legalReferences?: string[];
  decisionDate?: string;
  decisionBy?: string;
  createdAt: string;
  escalated: boolean;
  attachments?: string[];
}

export interface HistoryRecord {
  id: string;
  applicationId: string;
  citizenName: string;
  surveyNumber: string;
  action: 'CLEARED' | 'FLAGGED' | 'BLOCKED' | 'ESCALATED';
  reason?: string;
  opinion: string;
  legalReferences?: string[];
  timestamp: string;
  officerName: string;
}

export interface StatsResponse {
  pending: number;
  legalBlocks: number;
  reviewedToday: number;
  escalated: number;
  clearedToday: number;
  flaggedToday: number;
  blockedToday: number;
}

export interface User {
  id: string;
  name: string;
  role: 'legal';
  email: string;
  phone: string;
  designation: string;
  barCouncilId: string;
  department: string;
  office: string;
  jurisdiction: string;
  token?: string;
}
