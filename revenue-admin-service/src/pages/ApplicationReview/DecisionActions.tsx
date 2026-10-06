import React from 'react';
import { RevenueApplication } from '../../api/types';
import { useTranslation } from '../../i18n';
import {
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface DecisionActionsProps {
  application: RevenueApplication;
  remarks: string;
  onApprove: () => void;
  onReject: () => void;
  onGenerateCertificate: () => void;
  isProcessing?: boolean;
}

export const DecisionActions: React.FC<DecisionActionsProps> = ({
  application,
  remarks,
  onApprove,
  onReject,
  onGenerateCertificate,
  isProcessing = false,
}) => {
  const { t } = useTranslation();
  const isApproved = application.status === 'approved' || application.status === 'mutation_completed';
  const isRejected = application.status === 'rejected';

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">
            {t('Statutory Adjudication & Mutation Dispatch')}
          </h3>
          <p className="text-xs text-slate-400">
            {t('Final executive decision will prepare the mutation packet for review. (Mutation packet prepared — no official land record modified in demo mode).')}
          </p>
        </div>

        {/* Mutation Status Indicator */}
        {application.mutationId && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>
              {t('Mutation Packet')}: #{application.mutationId} (
              {t(application.mutationStatus || 'COMPLETED')})
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-400">
          {isApproved ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {t('Application Approved. Mutation packet prepared — no official land record modified.')}
            </span>
          ) : isRejected ? (
            <span className="text-rose-400 font-semibold flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              {t('Application has been officially rejected by the Executive Magistrate.')}
            </span>
          ) : (
            <span>
              {t('Action requires mandatory official remarks. Concurrence from 4 officer desks has been recorded.')}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Certificate Button (Enabled after approval or if already generated) */}
          {isApproved && (
            <button
              type="button"
              onClick={onGenerateCertificate}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition hover:scale-102"
            >
              <Award className="w-4 h-4" />
              <span>
                {application.certificateUrl
                  ? t('View / Print Bhooraksha Verification Report')
                  : t('Generate Bhooraksha Verification Report')}
              </span>
            </button>
          )}

          {/* Primary Action Buttons */}
          {!isApproved && !isRejected && (
            <>
              <button
                type="button"
                onClick={onReject}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>{t('Reject Application')}</span>
              </button>

              <button
                type="button"
                onClick={onApprove}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition hover:scale-102"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{t('Approve & Prepare Mutation')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
