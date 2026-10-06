export type ApplicationStatus =
  | 'UPLOADED'
  | 'QUALITY_CHECK'
  | 'AI_PROCESSING'
  | 'CROSS_VERIFICATION'
  | 'RISK_ASSESSMENT'
  | 'HUMAN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CORRECTION_REQUIRED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  role: 'CITIZEN' | 'DEO' | 'VERIFIER' | 'LEGAL' | 'GIS' | 'REVENUE_ADMIN' | 'SYSTEM_ADMIN';
  languagePreference?: string;
  notificationsEnabled?: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

export interface ExtractedData {
  propertyDetails: {
    state: string;
    district: string;
    taluk: string;
    village: string;
    surveyNumber: string;
    subDivision?: string;
    ulpin: string;
  };
  ownerDetails: {
    name: string;
    fatherOrSpouse: string;
    share: string;
    previousOwner: string;
    panOrAadhaarLast4?: string;
  };
  landDetails: {
    area: number;
    unit: 'Acres' | 'Cents' | 'Guntas' | 'Bigha' | 'Sq. Yards';
    landType: 'Agricultural' | 'Residential' | 'Commercial' | 'Industrial';
    boundaries: {
      north: string;
      south: string;
      east: string;
      west: string;
    };
  };
  documentDetails: {
    type: string;
    number: string;
    registrationNumber: string;
    date: string;
    issuingAuthority: string;
    sroOffice?: string;
  };
}

export interface GisBoundaryData {
  documentBoundary: [number, number][];
  governmentBoundary: [number, number][];
  overlapPercentage: number;
  encroachmentAlert: boolean;
  encroachmentAreaSqM?: number;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  timestamp: string;
  remarks?: string;
}

export interface Application {
  id: string;
  documentType: string;
  submissionDate: string;
  status: ApplicationStatus;
  riskScore: number;
  confidenceCategory: 'HIGH' | 'MEDIUM' | 'LOW';
  fileName: string;
  fileSize: number;
  fileUrl?: string;
  extractedData: ExtractedData;
  riskFactors: string[];
  legalFlags: string[];
  gisData: GisBoundaryData;
  auditLog: AuditLogEntry[];
}

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  correctionRequired?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  applicationId?: string;
}

export interface ShareWithBankPayload {
  bankName: string;
  bankEmail: string;
  ulpin: string;
  expiresInDays: number;
}
