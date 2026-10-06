import React from 'react';
import { cn } from '../lib/utils';
import { ApplicationStatus } from '../api/types';
import { useTranslation } from '../i18n';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useTranslation();

  const getBadgeConfig = () => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Approved & Mutation Sanctioned',
          className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
        };
      case 'AI_PROCESSING':
        return {
          label: 'AI Verification Running',
          className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
          dot: 'bg-blue-500 animate-ping',
        };
      case 'HUMAN_REVIEW':
        return {
          label: 'Field Officer Inspection',
          className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
          dot: 'bg-purple-500',
        };
      case 'CORRECTION_REQUIRED':
        return {
          label: 'Action Required: Re-upload',
          className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'REJECTED':
        return {
          label: 'Application Rejected',
          className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
        };
      case 'CROSS_VERIFICATION':
        return {
          label: 'Govt Record Matching',
          className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
          dot: 'bg-teal-500 animate-pulse',
        };
      default:
        return {
          label: status.replace(/_/g, ' '),
          className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
          dot: 'bg-slate-500',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm transition-all',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      <span>{t(config.label)}</span>
    </span>
  );
};
