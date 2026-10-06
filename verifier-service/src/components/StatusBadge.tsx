import { ApplicationStatus } from '../api/types';
import { STATUS_LABELS } from '../utils/constants';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n';
import { CheckCircle2, Clock, XCircle, RotateCcw, ArrowUp, Send, ShieldCheck, CheckCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const { t } = useTranslation();
  const meta = STATUS_LABELS[status] || {
    label: (status || 'Unknown').replace(/_/g, ' ').toUpperCase(),
    color: 'text-gray-300',
    bg: 'bg-gray-500/10 border-gray-500/30',
  };

  const getIcon = () => {
    switch (status) {
      case 'approved':
      case 'verified_by_verifier':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'approved_and_forwarded':
        return <Send className="w-3.5 h-3.5 text-emerald-400" />;
      case 'final_approved':
      case 'completed':
        return <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'rejected':
      case 'rejected_by_verifier':
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'returned_to_deo':
      case 'returned_to_verifier':
        return <RotateCcw className="w-3.5 h-3.5 text-orange-400" />;
      case 'escalated_to_revenue':
      case 'revenue_admin_review':
        return <ArrowUp className="w-3.5 h-3.5 text-purple-400" />;
      case 'pending_verification':
      case 'under_verifier_review':
      default:
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide whitespace-nowrap',
        meta.bg,
        meta.color,
        className
      )}
    >
      {getIcon()}
      {t(meta.label)}
    </span>
  );
};
