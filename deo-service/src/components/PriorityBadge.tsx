import React from 'react';
import { PriorityLevel } from '../api/types';
import { cn } from '../lib/utils';
import { Flame, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const configs = {
    HIGH: {
      label: 'HIGH PRIORITY',
      icon: Flame,
      style: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20',
    },
    MEDIUM: {
      label: 'MEDIUM',
      icon: AlertTriangle,
      style: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20',
    },
    LOW: {
      label: 'ROUTINE',
      icon: ShieldCheck,
      style: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20',
    },
  };

  const config = configs[priority] || configs.MEDIUM;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide border',
        config.style,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
