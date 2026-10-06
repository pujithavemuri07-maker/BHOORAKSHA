import { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, XCircle, AlertOctagon } from 'lucide-react';
import { REJECT_REASONS } from '../utils/constants';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, remarks: string) => void;
  applicationId: string;
  defaultRemarks?: string;
  isSubmitting?: boolean;
}

export const RejectModal = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultRemarks = '',
  isSubmitting = false,
}: RejectModalProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('incomplete_verification');
  const [remarks, setRemarks] = useState(
    defaultRemarks || 'Rejected by Executive Order of Tahsildar due to discrepancy in verification findings.'
  );

  const handleConfirm = () => {
    if (!reason || !remarks.trim()) return;
    onConfirm(reason, remarks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {t('revenue.rejectApplication')}
              </h3>
              <p className="text-xs text-slate-400">
                Application No: <span className="font-mono text-rose-400 font-bold">{applicationId}</span>
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

        <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs flex items-start gap-2.5 text-rose-300">
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t('revenue.rejectConfirmation')}</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">
              {t('revenue.rejectReason')} *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
            >
              {REJECT_REASONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">
              {t('revenue.remarks')} *
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              placeholder={t('revenue.rejectRemarksPlaceholder')}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!reason || !remarks.trim() || isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t('revenue.confirmReject')
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
