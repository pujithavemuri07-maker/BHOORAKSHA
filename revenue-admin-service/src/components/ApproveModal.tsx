import { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, CheckCircle, TrendingUp, ShieldCheck, FileCheck } from 'lucide-react';

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  applicationId: string;
  defaultRemarks?: string;
  isSubmitting?: boolean;
  ulpin?: string;
}

export const ApproveModal = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultRemarks = '',
  isSubmitting = false,
  ulpin,
}: ApproveModalProps) => {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState(
    defaultRemarks || 'Title verified across all statutory parameters. Executive mutation order issued under Section 5 ROR Act.'
  );

  const handleConfirm = () => {
    onConfirm(remarks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {t('revenue.approveAndTriggerMutation')}
              </h3>
              <p className="text-xs text-slate-400">
                Application No: <span className="font-mono text-amber-400 font-bold">{applicationId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executive Endorsement & Title Ratification</span>
          </div>
          <p className="text-emerald-300/90 leading-relaxed">
            {t('revenue.approveConfirmation')}
          </p>
          {ulpin && (
            <div className="p-2 rounded-lg bg-slate-950 border border-emerald-500/20 text-slate-200 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Assigned ULPIN:</span>
              <span className="font-bold text-emerald-400">{ulpin}</span>
            </div>
          )}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
            <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t('revenue.mutationWillBeTriggered')}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>{t('revenue.remarks')} *</span>
            <span className="text-[10px] text-slate-500 font-normal">Official Order Trail</span>
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder={t('revenue.approveRemarksPlaceholder')}
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                <span>{t('revenue.confirmApprove')}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
