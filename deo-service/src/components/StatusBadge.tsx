import React from 'react';
import { ApplicationStatus } from '../api/types';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n';
import {
  Clock,
  AlertCircle,
  Send,
  CheckCircle2,
  XCircle,
  Scale,
  MapPin,
  Sparkles,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();

  const configs: Record<string, { label: string; icon: any; style: string }> = {
    PENDING_DEO_REVIEW: {
      label: 'Pending DEO Review',
      icon: Clock,
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    READY_TO_FORWARD: {
      label: 'Ready to Forward',
      icon: CheckCircle2,
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    NEEDS_ATTENTION: {
      label: 'Needs Attention',
      icon: AlertTriangle,
      style: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    },
    MISSING_DOCUMENTS: {
      label: 'Missing Documents',
      icon: FileText,
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
    API_FAILURE_MANUAL_ENTRY: {
      label: 'API Failure (Manual)',
      icon: AlertCircle,
      style: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    ROUTED_TO_VERIFIER: {
      label: 'Forwarded to Verifier',
      icon: Send,
      style: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    READY_FOR_VERIFIER: {
      label: 'Ready for Verifier',
      icon: Send,
      style: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    CORRECTION_REQUIRED: {
      label: 'Correction Required',
      icon: AlertCircle,
      style: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    },
    APPROVED: {
      label: 'Approved & Mutated',
      icon: CheckCircle2,
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    REJECTED: {
      label: 'Rejected',
      icon: XCircle,
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
    LEGAL_REVIEW: {
      label: 'Legal Scrutiny',
      icon: Scale,
      style: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    GIS_REVIEW: {
      label: 'GIS Overlay Review',
      icon: MapPin,
      style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    },
  };

  const config = configs[status] || {
    label: (status || 'UNKNOWN').replace(/_/g, ' '),
    icon: Clock,
    style: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap',
        config.style,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {t(config.label)}
    </span>
  );
};
