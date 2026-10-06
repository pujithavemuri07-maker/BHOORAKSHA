import React from 'react';
import { LegalSeverity } from '../api/types';
import { SEVERITY_COLORS } from '../utils/constants';

interface SeverityBadgeProps {
  severity: LegalSeverity;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const config = SEVERITY_COLORS[severity] || SEVERITY_COLORS.low;
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${config.badge} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {severity} Risk
    </span>
  );
};
