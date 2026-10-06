import React from 'react';
import { RiskLevel } from '../types/application';
import { RISK_LEVEL_CONFIG } from '../constants/statuses';

interface RiskGaugeProps {
  score: number; // 0 - 100
  level?: RiskLevel;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level = 'low',
  className = '',
  size = 'md',
}) => {
  const config = RISK_LEVEL_CONFIG[level] || RISK_LEVEL_CONFIG.low;

  const colorClass =
    score <= 25
      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      : score <= 50
      ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      : score <= 75
      ? 'text-orange-500 bg-orange-500/10 border-orange-500/30'
      : 'text-red-500 bg-red-500/10 border-red-500/30';

  const sizeClass =
    size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-3 py-1.5' : 'text-sm px-2.5 py-1';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border font-mono font-bold ${colorClass} ${sizeClass} ${className}`}
    >
      <span className="text-muted-foreground font-sans font-medium text-xs">Risk:</span>
      <span>{score}/100</span>
      <span className="text-xs uppercase px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-sans font-semibold">
        {config.label}
      </span>
    </div>
  );
};
