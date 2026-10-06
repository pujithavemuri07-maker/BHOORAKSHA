import React from 'react';
import { ValidationStatus } from '../api/types';
import { cn } from '../lib/utils';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  status: ValidationStatus;
  className?: string;
}

export const ValidationResultBadge: React.FC<Props> = ({ status, className }) => {
  const configs: Record<ValidationStatus, { label: string; icon: any; style: string }> = {
    MATCH: {
      label: 'MATCH',
      icon: CheckCircle2,
      style: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20',
    },
    PARTIAL: {
      label: 'PARTIAL MATCH',
      icon: AlertTriangle,
      style: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20',
    },
    MISMATCH: {
      label: 'MISMATCH',
      icon: XCircle,
      style: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20',
    },
  };

  const config = configs[status] || configs.PARTIAL;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border',
        config.style,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};
