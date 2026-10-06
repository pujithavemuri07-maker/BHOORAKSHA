export type PriorityLevel = 'high' | 'medium' | 'low';
export type RiskLevel = 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK';

export interface RiskClassification {
  score: number;
  priority: PriorityLevel;
  priorityLabel: string;
  riskLabel: RiskLevel;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

/**
 * Single Centralized Risk & Priority Classification Function for Bhooraksha Verifier.
 *
 * Rules:
 * - 75–100: Priority = LOW, Risk Label = LOW RISK (75 belongs to LOW)
 * - 50–74:  Priority = MEDIUM, Risk Label = MEDIUM RISK (50 belongs to MEDIUM)
 * - 0–49:   Priority = HIGH, Risk Label = HIGH RISK (49 belongs to HIGH)
 *
 * Examples:
 * 82 -> LOW
 * 75 -> LOW
 * 74 -> MEDIUM
 * 68 -> MEDIUM
 * 50 -> MEDIUM
 * 49 -> HIGH
 * 45 -> HIGH
 * 22 -> HIGH
 * 18 -> HIGH
 */
export function classifyRisk(score: number | undefined | null): RiskClassification {
  const safeScore = typeof score === 'number' && !isNaN(score) ? score : 0;

  if (safeScore >= 75) {
    return {
      score: safeScore,
      priority: 'low',
      priorityLabel: 'LOW PRIORITY',
      riskLabel: 'LOW RISK',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/20',
    };
  }

  if (safeScore >= 50) {
    return {
      score: safeScore,
      priority: 'medium',
      priorityLabel: 'MEDIUM PRIORITY',
      riskLabel: 'MEDIUM RISK',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/20',
    };
  }

  return {
    score: safeScore,
    priority: 'high',
    priorityLabel: 'HIGH PRIORITY',
    riskLabel: 'HIGH RISK',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/20',
  };
}

/**
 * Returns the effective priority for any application record.
 */
export function getApplicationEffectivePriority(app: { riskScore?: number; priority?: string }): PriorityLevel {
  if (typeof app.riskScore === 'number') {
    return classifyRisk(app.riskScore).priority;
  }
  if (app.priority === 'low' || app.priority === 'medium' || app.priority === 'high') {
    return app.priority as PriorityLevel;
  }
  return 'high';
}

/**
 * Sanitizes application data to ensure priority and risk label strictly follow the centralized statutory rule.
 */
export function sanitizeVerifierApplication<T extends { riskScore?: number; priority?: any }>(app: T): T {
  if (typeof app.riskScore === 'number') {
    const classification = classifyRisk(app.riskScore);
    return {
      ...app,
      priority: classification.priority,
    };
  }
  return app;
}
