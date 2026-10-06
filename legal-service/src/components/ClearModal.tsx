import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, CheckCircle, ShieldCheck, Scale } from 'lucide-react';

interface ClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (opinion: string) => void;
  applicationId: string;
  defaultOpinion?: string;
  isSubmitting?: boolean;
}

export const ClearModal: React.FC<ClearModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultOpinion = '',
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [opinion, setOpinion] = useState(
    defaultOpinion ||
      'Having examined the primary instrument and certified prior link deeds under Sec 54 Transfer of Property Act 1882 and Registration Act 1908, the title is found to be clean, marketable, and free from encumbrance or stay orders. Cleared for mutation sanction.'
  );
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(opinion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('legal.clearModalTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                Case ID: <span className="font-mono text-emerald-300 font-semibold">{applicationId}</span>
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

        <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-xs text-emerald-300/90 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>{t('legal.clearConfirmation')}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            Statutory Legal Opinion & Mutation Advice *
          </label>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder={t('legal.opinionPlaceholder')}
          />
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
          />
          <span>
            I certify under digital signature that all chain link documents and revenue registers have been examined and found free from defect.
          </span>
        </label>

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
            disabled={isSubmitting || !acknowledged || !opinion.trim()}
            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sanction & Clear Title'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
