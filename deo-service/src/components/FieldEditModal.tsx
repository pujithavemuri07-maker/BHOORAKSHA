import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, FileText, Sparkles, ShieldCheck, History, Edit3, Link2 } from 'lucide-react';
import { useDEOStore } from '../store/deoStore';
import toast from 'react-hot-toast';

interface FieldEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  section: 'propertyDetails' | 'ownerDetails' | 'landDetails' | 'documentDetails';
  fieldKey: string;
  fieldLabel: string;
  currentValue: any;
  sourceDoc?: string;
}

const COMMON_PROOF_SOURCES = [
  { label: 'Registered Sale Deed (Schedule / Header)', source: 'Registered Sale Deed #SD-2025-045, Page 1' },
  { label: 'Identity Proof (UIDAI Masked Aadhaar)', source: 'UIDAI Masked E-KYC Aadhaar, Page 1' },
  { label: 'Pattadar Passbook / Form 1-B Record Extract', source: 'Pattadar Passbook 1B (KH-88214), Page 1' },
  { label: 'Cadastral Map (FMB Tippan Sketch)', source: 'Cadastral Map FMB Tippan 123/456, Page 1' },
  { label: 'Prior Mutation Proceeding Order', source: 'Tahsildar Mutation Proceeding MUT-2022-8110, Page 1' },
  { label: 'Physical / Certified Government Revenue Register', source: 'Physical 1-B Register & Village Pahani' },
];

const COMMON_REASONS = [
  'Name verified and reconciled with uploaded identity proof (Aadhaar).',
  'Area extent corrected after checking certified RoR 1-B extract.',
  'Survey number typo corrected according to registered deed schedule.',
  'Schedule boundaries reconciled with cadastral FMB map.',
  'Deed registration date verified against SRO rubber stamp.',
  'Corrected based on physical certified revenue records / API fallback.',
  'Minor spelling / phonetic transliteration correction.',
];

export const FieldEditModal: React.FC<FieldEditModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  section,
  fieldKey,
  fieldLabel,
  currentValue,
  sourceDoc = 'Registered Sale Deed #SD-2025-045, Page 1',
}) => {
  const correctField = useDEOStore((state) => state.correctField);

  const [newValue, setNewValue] = useState(String(currentValue || ''));
  const [selectedProofSource, setSelectedProofSource] = useState(sourceDoc);
  const [reason, setReason] = useState(COMMON_REASONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNewValue(String(currentValue || ''));
    setSelectedProofSource(sourceDoc);
  }, [currentValue, sourceDoc]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!newValue.trim() || !reason.trim()) {
      toast.error('Please enter the corrected value and reason.');
      return;
    }

    setIsSubmitting(true);
    correctField(applicationId, section, fieldKey, newValue, reason, selectedProofSource);
    setIsSubmitting(false);
    toast.success(`Field "${fieldLabel}" updated and linked to proof.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                CORRECT AI EXTRACTED FIELD
              </h3>
              <p className="text-xs text-slate-400">
                Application: <span className="font-mono font-bold text-amber-400">{applicationId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Details */}
        <div className="space-y-3.5 text-xs">
          {/* Target Field */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500">Target Field</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                {section}.{fieldKey}
              </span>
            </div>
            <p className="text-sm font-bold text-white">{fieldLabel}</p>
          </div>

          {/* Original AI Value */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Original AI Extracted Value (Preserved in Audit Log)
            </label>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-400">
              "{currentValue}"
            </div>
          </div>

          {/* New Corrected Value */}
          <div>
            <label className="block text-xs font-bold text-white mb-1">
              Corrected DEO Value *
            </label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-xs font-mono font-bold text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter verified correct value..."
            />
          </div>

          {/* Supporting Proof Source */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Supporting Proof Source *</span>
            </label>
            <select
              value={selectedProofSource}
              onChange={(e) => setSelectedProofSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 mb-2"
            >
              {COMMON_PROOF_SOURCES.map((p, i) => (
                <option key={i} value={p.source}>
                  {p.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={selectedProofSource}
              onChange={(e) => setSelectedProofSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-[11px]"
              placeholder="Or specify custom proof reference..."
            />
          </div>

          {/* Statutory Correction Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Statutory Correction Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 mb-2"
            >
              {COMMON_REASONS.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Or type custom statutory rationale..."
            />
          </div>

          {/* Audit Notice */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              This edit will append an immutable cryptographic record (Officer: Suresh G. Patil). Original AI value remains preserved.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || !newValue.trim()}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Correction & Append to Audit Trail</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
