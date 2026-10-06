import { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
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
  const [selectedReason, setSelectedReason] = useState<string>(REJECT_REASONS[0].label);
  const [remarks, setRemarks] = useState(
    defaultRemarks || 'Irreconcilable discrepancy between submitted instrument and official village cadastral register. Application rejected with cause.'
  );

  const handleConfirm = () => {
    if (!selectedReason || !remarks.trim()) return;
    onConfirm(selectedReason, remarks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                REJECT APPLICATION
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

        {/* Rejection Warning Box */}
        <div className="p-3.5 bg-rose-950/40 rounded-xl border border-rose-500/30 text-xs text-rose-300 leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p>
            <strong>Statutory Finality:</strong> Rejecting closes the verification workflow and records the statutory objection in the permanent tamper-evident audit ledger. Citizen will receive formal rejection notice with grounds.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Structured Reason */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Structured Statutory Rejection Reason *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {REJECT_REASONS.map((r) => (
                <option key={r.id} value={r.label} className="bg-slate-900 text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Remarks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Detailed Rejection Grounds & Officer Findings *
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all placeholder:text-slate-500"
              placeholder="Explicit grounds for rejection..."
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
            disabled={!remarks.trim() || isSubmitting}
            className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-rose-950"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Rejection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
