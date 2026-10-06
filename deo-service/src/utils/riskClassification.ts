import { PriorityLevel, ApplicationStatus } from '../api/types';

export interface RiskClassification {
  riskScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
  priority: PriorityLevel;
  status: ApplicationStatus;
  riskLabel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';
  statusLabel: 'READY TO FORWARD' | 'NEEDS ATTENTION' | 'MISSING DOCUMENTS';
  description: string;
  badgeClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

/**
 * Centralized statutory risk classification rule for Bhooraksha DEO / Patwari Portal:
 * 
 * 75–100: LOW RISK -> Priority: LOW -> Status: READY TO FORWARD
 * 50–74:  MEDIUM RISK -> Priority: MEDIUM -> Status: NEEDS ATTENTION
 * 0–49:   HIGH RISK -> Priority: HIGH -> Status: MISSING DOCUMENTS
 */
export function classifyRisk(riskScore: number | undefined | null): RiskClassification {
  const score = Math.max(0, Math.min(100, Math.round(Number(riskScore) || 0)));

  if (score >= 75) {
    return {
      riskScore: score,
      riskCategory: 'LOW',
      priority: 'LOW',
      status: 'READY_TO_FORWARD',
      riskLabel: 'LOW RISK',
      statusLabel: 'READY TO FORWARD',
      description: 'AI extraction and validation indicate no significant exception requiring DEO correction.',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      textClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/20',
    };
  }

  if (score >= 50) {
    return {
      riskScore: score,
      riskCategory: 'MEDIUM',
      priority: 'MEDIUM',
      status: 'NEEDS_ATTENTION',
      riskLabel: 'MEDIUM RISK',
      statusLabel: 'NEEDS ATTENTION',
      description: 'The application contains one or more exceptions that require DEO review/correction.',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      textClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/20',
    };
  }

  return {
    riskScore: score,
    riskCategory: 'HIGH',
    priority: 'HIGH',
    status: 'MISSING_DOCUMENTS',
    riskLabel: 'HIGH RISK',
    statusLabel: 'MISSING DOCUMENTS',
    description: 'Required information/documents are insufficient for normal processing.',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10',
    borderClass: 'border-rose-500/20',
  };
}

export function getPriorityFromRisk(score: number): PriorityLevel {
  return classifyRisk(score).priority;
}

export function getStatusFromRisk(score: number): ApplicationStatus {
  return classifyRisk(score).status;
}

export function getRiskLabel(score: number): string {
  return classifyRisk(score).riskLabel;
}

export function getStatusLabel(score: number): string {
  return classifyRisk(score).statusLabel;
}

export function getApplicationEffectiveStatus(app: { status?: string; riskScore?: number; govtApiStatus?: string }): ApplicationStatus {
  if (app.status === 'ROUTED_TO_VERIFIER') return 'ROUTED_TO_VERIFIER';
  if (app.status === 'LEGAL_REVIEW') return 'LEGAL_REVIEW';
  if (app.status === 'GIS_REVIEW') return 'GIS_REVIEW';
  if (app.status === 'API_FAILURE_MANUAL_ENTRY' || app.govtApiStatus === 'failed') return 'API_FAILURE_MANUAL_ENTRY';
  
  return classifyRisk(app.riskScore).status;
}

export function getApplicationEffectivePriority(app: { priority?: PriorityLevel; riskScore?: number }): PriorityLevel {
  return classifyRisk(app.riskScore).priority;
}

export function sanitizeApplication<T extends { status?: any; priority?: any; riskScore?: number; confidenceCategory?: any; govtApiStatus?: string }>(app: T): T {
  const risk = classifyRisk(app.riskScore);
  const effectiveStatus = getApplicationEffectiveStatus(app);
  const effectivePriority = getApplicationEffectivePriority(app);

  return {
    ...app,
    status: effectiveStatus,
    priority: effectivePriority,
    confidenceCategory: risk.riskCategory,
  };
}

