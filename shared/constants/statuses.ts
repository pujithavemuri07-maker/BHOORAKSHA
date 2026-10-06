import { ApplicationStatus, RiskLevel } from '../types/application';

export const STATUS_DETAILS: Record<ApplicationStatus, { label: string; color: string; step: number }> = {
  submitted: { label: 'Submitted', color: 'blue', step: 1 },
  quality_check: { label: 'Document Quality Check', color: 'indigo', step: 2 },
  ocr_processing: { label: 'AI OCR & Extraction', color: 'purple', step: 3 },
  deo_review: { label: 'DEO (Patwari) Review', color: 'amber', step: 4 },
  verification_pending: { label: 'Checker Verification', color: 'orange', step: 5 },
  legal_review: { label: 'Legal Review', color: 'rose', step: 6 },
  gis_review: { label: 'GIS Boundary Review', color: 'teal', step: 7 },
  revenue_approval: { label: 'Tehsildar Sanction', color: 'cyan', step: 8 },
  approved: { label: 'Sanctioned & Approved', color: 'emerald', step: 9 },
  rejected: { label: 'Rejected', color: 'red', step: 9 },
  mutated: { label: 'Mutation Recorded', color: 'green', step: 10 },
};

export const RISK_LEVEL_CONFIG: Record<RiskLevel, { label: string; color: string; maxScore: number }> = {
  low: { label: 'Low Risk', color: 'emerald', maxScore: 25 },
  medium: { label: 'Moderate Risk', color: 'amber', maxScore: 50 },
  high: { label: 'High Risk', color: 'orange', maxScore: 75 },
  critical: { label: 'Critical Risk', color: 'red', maxScore: 100 },
};
