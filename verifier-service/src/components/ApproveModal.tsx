import { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, CheckCircle, ShieldCheck, AlertCircle, Info, Send } from 'lucide-react';

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  applicationId: string;
  citizenName?: string;
  surveyNumber?: string;
  riskScore?: number;
  currentStatus?: string;
  defaultRemarks?: string;
  isSubmitting?: boolean;
}

export const ApproveModal = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  citizenName = 'Ramesh Kumar Patel',
  surveyNumber = '123/456',
  riskScore = 68,
  currentStatus = 'Pending Verification',
  defaultRemarks = '',
  isSubmitting = false,
}: ApproveModalProps) => {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState(
    defaultRemarks || 'Verified against physical Pahani and 1-B master record. All cadastral boundaries and 30-year title chains reconciled. Forwarded for Tahsildar sanction.'
  );
  const [confirmedCheck, setConfirmedCheck] = useState(false);

  const handleConfirm = () => {
    if (!remarks.trim() || !confirmedCheck) return;
    onConfirm(remarks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                APPROVE & FORWARD TO REVENUE ADMIN
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

        {/* Application Key Attributes Box */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Citizen</span>
              <span className="text-slate-200 font-semibold truncate block">{citizenName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Survey / Hissa</span>
              <span className="text-amber-400 font-mono font-bold block">{surveyNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Review Priority</span>
              <span className="text-amber-400 font-mono font-bold block">{riskScore} / 100</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Stage</span>
              <span className="text-emerald-400 font-bold block">Verifier Scrutiny</span>
            </div>
          </div>
        </div>

        {/* Statutory Limitation Notice */}
        <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-300 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>Statutory Governance Note:</strong> "Approve & Forward" is NOT final legal approval. It forwards the verified application to the Revenue Admin / Tahsildar for final statutory mutation sanction.
          </p>
        </div>

        {/* Remarks Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Verifier Endorsement Remarks *
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
            placeholder="Detailed verification findings for the Tahsildar..."
            required
          />
        </div>

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmedCheck}
            onChange={(e) => setConfirmedCheck(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
          />
          <span className="text-[11px] text-slate-300 leading-snug">
            I confirm that I have reviewed the submitted documents, cross-verification results, GIS findings and relevant verification information.
          </span>
        </label>

        {/* Action Buttons */}
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
            disabled={!remarks.trim() || !confirmedCheck || isSubmitting}
            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Approve & Forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
