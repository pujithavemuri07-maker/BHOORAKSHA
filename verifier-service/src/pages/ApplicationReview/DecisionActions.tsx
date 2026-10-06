import { useTranslation } from '../../i18n';
import { CheckCircle, XCircle, RotateCcw, ArrowUp, AlertTriangle, ShieldCheck, Send, RefreshCw } from 'lucide-react';
import { ApplicationStatus } from '../../api/types';
import { cn } from '../../lib/utils';

interface DecisionActionsProps {
  currentStatus: ApplicationStatus;
  onApprove: () => void;
  onReject: () => void;
  onReturn: () => void;
  onEscalate: () => void;
  onReopen?: () => void;
  isChecklistIncomplete?: boolean;
  isApproving?: boolean;
  isRejecting?: boolean;
  isReturning?: boolean;
  isEscalating?: boolean;
}

export const DecisionActions = ({
  currentStatus,
  onApprove,
  onReject,
  onReturn,
  onEscalate,
  onReopen,
  isChecklistIncomplete = false,
  isApproving = false,
  isRejecting = false,
  isReturning = false,
  isEscalating = false,
}: DecisionActionsProps) => {
  const { t } = useTranslation();

  const isDecided =
    currentStatus === 'approved' ||
    currentStatus === 'approved_and_forwarded' ||
    currentStatus === 'returned_to_deo' ||
    currentStatus === 'rejected' ||
    currentStatus === 'rejected_by_verifier' ||
    currentStatus === 'escalated_to_revenue' ||
    currentStatus === 'revenue_admin_review';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {t('verifier.decision')} & Statutory Endorsement
          </h4>
          <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
            Girdawar Desk
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Cryptographically Signed Decision Block
        </span>
      </div>

      {/* If decision already executed, show persistent status banner */}
      {isDecided ? (
        <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Current Decision State: {currentStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verifier decision has been executed and cryptographically sealed into the append-only audit trail. Inappropriate duplicate actions are disabled for this stage.
            </p>
          </div>

          {onReopen && (
            <button
              type="button"
              onClick={onReopen}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition-all shrink-0"
              title="Re-open review cycle for demonstration"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Re-Review Cycle</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {/* Approve & Forward to Revenue Admin */}
          <button
            type="button"
            onClick={onApprove}
            disabled={isApproving}
            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-950 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {isApproving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Approve & Forward to Revenue Admin</span>
          </button>

          {/* Return to DEO */}
          <button
            type="button"
            onClick={onReturn}
            disabled={isReturning}
            className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-950 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {isReturning ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            <span>Return to DEO</span>
          </button>

          {/* Reject */}
          <button
            type="button"
            onClick={onReject}
            disabled={isRejecting}
            className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {isRejecting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>Reject Application</span>
          </button>

          {/* Escalate to Revenue Admin */}
          <button
            type="button"
            onClick={onEscalate}
            disabled={isEscalating}
            className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-950 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {isEscalating ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
            <span>Escalate to Revenue Admin</span>
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <p>
          Verifier decisions are cryptographically appended to the immutable audit ledger. Final mutation sanction remains with the Tahsildar.
        </p>
      </div>
    </div>
  );
};
