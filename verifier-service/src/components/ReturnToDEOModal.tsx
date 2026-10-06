import { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, RotateCcw, AlertTriangle, Send } from 'lucide-react';
import { RETURN_REASONS } from '../utils/constants';

interface ReturnToDEOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, remarks: string, requiredCorrection?: string, requestedDoc?: string) => void;
  applicationId: string;
  defaultRemarks?: string;
  isSubmitting?: boolean;
}

export const ReturnToDEOModal = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultRemarks = '',
  isSubmitting = false,
}: ReturnToDEOModalProps) => {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>(RETURN_REASONS[0].label);
  const [remarks, setRemarks] = useState(
    defaultRemarks || 'Discrepancy identified in land extent/boundary. Please cross-verify with village cadastral map and re-upload clear deed scan.'
  );
  const [requiredCorrection, setRequiredCorrection] = useState('Rectification of middle name and verification against physical 1B register');
  const [requestedDoc, setRequestedDoc] = useState('Citizen Aadhaar Proof & SRO Certified Deed Copy');

  const [selectedFields, setSelectedFields] = useState<string[]>(['Owner Name', 'Documents']);

  const fieldOptions = [
    'Owner Name',
    'Survey Number',
    'Area Extent',
    'Registration Number',
    'Mutation Record',
    'Missing Documents',
    'GIS Boundary',
    'Other',
  ];

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleConfirm = () => {
    if (!selectedReason || !remarks.trim()) return;
    const correctionSummary = `[Fields: ${selectedFields.join(', ')}] ${requiredCorrection}`;
    onConfirm(selectedReason, remarks, correctionSummary, requestedDoc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                RETURN TO DEO / PATWARI
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

        {/* Warning Banner */}
        <div className="p-3.5 bg-orange-950/40 rounded-xl border border-orange-500/30 text-xs text-orange-300 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p>
            Returning will re-assign this dossier to the Village Revenue Officer (DEO / Patwari) queue for physical verification or document correction. Historical verifier decisions remain permanently recorded in the audit trail.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 text-xs">
          {/* Reason Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Primary Reason for Returning *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {RETURN_REASONS.map((r) => (
                <option key={r.id} value={r.label} className="bg-slate-900 text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Selectable Fields Requiring Correction */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Select Fields Requiring Correction *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {fieldOptions.map((field) => {
                const isSelected = selectedFields.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleField(field)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {field} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Correction */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Required Correction / Missing Information *
            </label>
            <input
              type="text"
              value={requiredCorrection}
              onChange={(e) => setRequiredCorrection(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Explicit items DEO must re-verify or collect..."
              required
            />
          </div>

          {/* Optional Supporting Doc */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Requested Supporting Document (Optional)
            </label>
            <input
              type="text"
              value={requestedDoc}
              onChange={(e) => setRequestedDoc(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="e.g. Identity Voucher / FMB Sketch / Legal Heir NOC"
            />
          </div>

          {/* Detailed Remarks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Verifier Instructions for DEO *
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-500"
              placeholder="Instructions for DEO..."
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
            disabled={!remarks.trim() || !requiredCorrection.trim() || isSubmitting}
            className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-orange-950"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to DEO</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
