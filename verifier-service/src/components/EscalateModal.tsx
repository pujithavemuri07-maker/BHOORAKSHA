import { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, ArrowUp, AlertOctagon, Send } from 'lucide-react';
import { ESCALATION_CATEGORIES } from '../utils/constants';

interface EscalateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: string, reason: string, remarks: string) => void;
  applicationId: string;
  defaultRemarks?: string;
  isSubmitting?: boolean;
}

export const EscalateModal = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultRemarks = '',
  isSubmitting = false,
}: EscalateModalProps) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>(ESCALATION_CATEGORIES[0].label);
  const [reason, setReason] = useState('Active civil litigation caveat / disputed partition share requiring Tehsildar statutory enquiry.');
  const [remarks, setRemarks] = useState(
    defaultRemarks || 'High legal complexity: Active civil litigation caveat OS 412/2024 pending. Escalated for Tehsildar statutory enquiry and legal counsel referral.'
  );

  const handleConfirm = () => {
    if (!selectedCategory || !reason.trim() || !remarks.trim()) return;
    onConfirm(selectedCategory, reason, remarks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 flex items-center justify-center">
              <ArrowUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                ESCALATE TO REVENUE ADMIN (TAHSILDAR)
              </h3>
              <p className="text-xs text-slate-400">
                Application: <span className="text-amber-400 font-mono font-bold">{applicationId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-500/30 text-xs text-purple-300 leading-relaxed flex items-start gap-2">
          <AlertOctagon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p>
            Escalating transfers this dossier directly to the Executive Magistrate / Tahsildar for statutory decision, legal cell review, or field survey commission.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Issue Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Escalation Issue Category *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {ESCALATION_CATEGORIES.map((c) => (
                <option key={c.id} value={c.label} className="bg-slate-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Reason */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Specific Escalation Grounds *
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Core reason requiring Tehsildar intervention..."
              required
            />
          </div>

          {/* Detailed Remarks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Detailed Verifier Briefing for Tahsildar *
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-500"
              placeholder="Detailed brief for Tahsildar..."
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!reason.trim() || !remarks.trim() || isSubmitting}
            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-purple-950"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Escalation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
