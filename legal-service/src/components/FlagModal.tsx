import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, AlertTriangle, Scale } from 'lucide-react';
import { FLAG_REASONS } from '../utils/constants';

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { reason: string; opinion: string }) => void;
  applicationId: string;
  defaultReason?: string;
  isSubmitting?: boolean;
}

export const FlagModal: React.FC<FlagModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultReason = 'ownership_dispute',
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState(defaultReason);
  const [opinion, setOpinion] = useState(
    'Discrepancy noted in party particulars or documentation. Applicant is directed to produce link documents / rectifying endorsement within 15 days.'
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({ reason, opinion });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('legal.flagModalTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                Case ID: <span className="font-mono text-amber-300 font-semibold">{applicationId}</span>
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

        <div className="p-3.5 bg-amber-950/30 rounded-xl border border-amber-500/30 text-xs text-amber-300/90 leading-relaxed">
          {t('legal.flagConfirmation')}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Primary Reason for Flagging *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
          >
            {FLAG_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            Rectification Instructions & Legal Advisory Note *
          </label>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            placeholder="Specify precise legal rectification, documents required, or clarification demanded..."
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
            disabled={isSubmitting || !opinion.trim()}
            className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Flag for Rectification'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
