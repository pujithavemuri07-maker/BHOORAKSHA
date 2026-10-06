import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, ShieldAlert, BookOpen, AlertOctagon } from 'lucide-react';
import { BLOCK_REASONS, STATUTORY_CITATIONS } from '../utils/constants';

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { reason: string; opinion: string; legalReferences: string[] }) => void;
  applicationId: string;
  defaultReason?: string;
  isSubmitting?: boolean;
}

export const BlockModal: React.FC<BlockModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultReason = 'document_fraud',
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState(defaultReason);
  const [opinion, setOpinion] = useState(
    'Instrument suffers from incurable legal defects / statutory prohibition. Title cannot be mutated under applicable Revenue Acts.'
  );
  const [selectedCitations, setSelectedCitations] = useState<string[]>([
    STATUTORY_CITATIONS[0],
  ]);
  const [customCitation, setCustomCitation] = useState('');

  if (!isOpen) return null;

  const toggleCitation = (cit: string) => {
    if (selectedCitations.includes(cit)) {
      setSelectedCitations(selectedCitations.filter((c) => c !== cit));
    } else {
      setSelectedCitations([...selectedCitations, cit]);
    }
  };

  const handleAddCustomCitation = () => {
    if (customCitation.trim() && !selectedCitations.includes(customCitation.trim())) {
      setSelectedCitations([...selectedCitations, customCitation.trim()]);
      setCustomCitation('');
    }
  };

  const handleConfirm = () => {
    onConfirm({ reason, opinion, legalReferences: selectedCitations });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('legal.blockModalTitle')}
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
          <div>
            <span className="font-bold">Statutory Invalidation Notice: </span>
            {t('legal.blockConfirmation')}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Statutory Grounds for Block *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
          >
            {BLOCK_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            Statutory Legal Citations & Provisions Violated
          </label>
          <div className="max-h-36 overflow-y-auto space-y-1.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700">
            {STATUTORY_CITATIONS.map((cit) => (
              <label
                key={cit}
                className="flex items-start gap-2 text-xs text-slate-300 hover:text-white cursor-pointer p-1 rounded hover:bg-slate-800"
              >
                <input
                  type="checkbox"
                  checked={selectedCitations.includes(cit)}
                  onChange={() => toggleCitation(cit)}
                  className="mt-0.5 rounded border-slate-700 text-red-600 focus:ring-red-500 bg-slate-900"
                />
                <span className="leading-tight">{cit}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customCitation}
              onChange={(e) => setCustomCitation(e.target.value)}
              placeholder="Or add custom court decree or gazette notification..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={handleAddCustomCitation}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Formal Legal Invalidation Reason & Officer Order *
          </label>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            placeholder="Document definitive findings, court order particulars, and statutory directives..."
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
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Issue Statutory Block'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
