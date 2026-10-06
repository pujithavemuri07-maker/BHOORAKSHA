import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, AlertOctagon, XCircle } from 'lucide-react';
import { REJECT_REASONS } from '../utils/constants';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, remarks: string) => void;
  applicationId: string;
  defaultRemarks?: string;
  isSubmitting?: boolean;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultRemarks = '',
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('boundary_different');
  const [remarks, setRemarks] = useState(
    defaultRemarks ||
      'Deed schedule boundary conflicts irreconcilably with government cadastral map. Extent overlaps protected government buffer.'
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason, remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('gis.rejectBoundary')}
              </h3>
              <p className="text-xs text-slate-400">
                Case ID: <span className="font-mono text-red-300 font-semibold">{applicationId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 bg-red-950/40 rounded-xl border border-red-500/40 text-xs text-red-300 leading-relaxed flex items-start gap-2.5">
          <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p>{t('gis.rejectConfirmation')}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t('gis.rejectReason')} *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
          >
            {REJECT_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Formal Rejection Grounds & Discrepancy Findings *
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            placeholder={t('gis.rejectRemarksPlaceholder')}
          />
        </div>

        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || !remarks.trim()}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Confirm Spatial Rejection'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
