import { User } from './user';

export type ApplicationStatus =
  | 'submitted'
  | 'quality_check'
  | 'ocr_processing'
  | 'deo_review'
  | 'verification_pending'
  | 'legal_review'
  | 'gis_review'
  | 'revenue_approval'
  | 'approved'
  | 'rejected'
  | 'mutated';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface LandApplication {
  id: string;
  applicationNo: string;
  applicantId: string;
  applicant?: User;
  state: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  subdivisionNumber?: string;
  extentAcres: number;
  status: ApplicationStatus;
  currentStage: string;
  riskScore: number;
  riskLevel: RiskLevel;
  slaDeadline?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFilter {
  status?: ApplicationStatus;
  district?: string;
  riskLevel?: RiskLevel;
  search?: string;
  page?: number;
  limit?: number;
}
