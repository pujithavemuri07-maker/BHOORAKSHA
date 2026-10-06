export interface LegalFlag {
  id: string;
  applicationId: string;
  flagCode: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVED' | 'WAIVED';
  legalOpinion?: string;
  officerId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface GISParcelOverlap {
  id: string;
  sourceParcelId: string;
  overlappingParcelId: string;
  overlapAreaSqm: number;
  overlapPercentage: number;
  status: 'DETECTED' | 'RESOLVED' | 'DISPUTED';
  resolvedBy?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface VerificationDecision {
  applicationId: string;
  stage: string;
  decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'FORWARD';
  remarks: string;
  metadata?: Record<string, any>;
}
