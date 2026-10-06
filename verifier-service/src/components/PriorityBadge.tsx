import { AlertTriangle, Flame, ShieldCheck } from 'lucide-react';
import { PriorityLevel } from '../api/types';
import { classifyRisk } from '../utils/riskClassification';
import { cn } from '../lib/utils';

interface PriorityBadgeProps {
  priority?: PriorityLevel | string;
  riskScore?: number;
  className?: string;
}

export const PriorityBadge = ({ priority, riskScore, className }: PriorityBadgeProps) => {
  let resolvedPriority: PriorityLevel = 'low';

  if (typeof riskScore === 'number') {
    resolvedPriority = classifyRisk(riskScore).priority;
  } else if (priority === 'high' || priority === 'medium' || priority === 'low') {
    resolvedPriority = priority;
  }

  switch (resolvedPriority) {
    case 'high':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
            'bg-rose-500/10 text-rose-400 border border-rose-500/20',
            className
          )}
        >
          <Flame className="w-3.5 h-3.5 shrink-0" />
          HIGH PRIORITY
        </span>
      );
    case 'medium':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
            'bg-amber-500/10 text-amber-400 border border-amber-500/20',
            className
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          MEDIUM PRIORITY
        </span>
      );
    case 'low':
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
            className
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          LOW PRIORITY
        </span>
      );
  }
};
