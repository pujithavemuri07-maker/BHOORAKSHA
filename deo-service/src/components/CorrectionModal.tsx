import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, AlertTriangle, Send, FileText, Clock, UserCheck, ShieldAlert } from 'lucide-react';
import { CORRECTION_REASONS } from '../utils/constants';

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, remarks: string) => void;
  applicationId: string;
  defaultRemarks?: string;
}

const FIELD_CORRECTION_PRESETS: Record<string, { current: string; expected: string; reason: string; doc: string }> = {
  'Owner Legal Name': {
    current: 'Ramesh Kumar',
    expected: 'Ramesh Kumaran',
    reason: 'Name mismatch with government master record (Pahani/1B)',
    doc: 'Official Identity Voucher (Aadhaar / Passport / Gazette Certificate)',
  },
  'Registration Date': {
    current: '20 Dec 2025 (Stamp Header)',
    expected: '15 Jan 2026 (SRO Registry Book I)',
    reason: 'Execution stamp date does not match Central Registry Index date',
    doc: 'Certified True Copy (CC) of Registered Deed from SRO',
  },
  'Survey Number': {
    current: '123/456',
    expected: '123/456 (Sub-Division P-1)',
    reason: 'Sub-division parcel notation requires official demarcation slip',
    doc: 'Tippan / FMB / Cadastral Sub-division Certificate',
  },
  'Land Extent Area': {
    current: '2.50 Acres',
    expected: '2.49 Acres (GIS Vector Polygon)',
    reason: '0.01 acre boundary discrepancy requires joint surveyor sign-off',
    doc: 'Joint Boundary Demarcation Panchnama',
  },
  'Other / Procedural': {
    current: 'As per submitted document',
    expected: 'As per State Land Records Master',
    reason: 'Procedural irregularity requiring applicant clarification',
    doc: 'Supporting Revenue Document / Affidavit',
  },
};

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultRemarks = '',
}) => {
  const { t } = useTranslation();
  const [selectedField, setSelectedField] = useState('Owner Legal Name');
  const [currentVal, setCurrentVal] = useState(FIELD_CORRECTION_PRESETS['Owner Legal Name'].current);
  const [expectedVal, setExpectedVal] = useState(FIELD_CORRECTION_PRESETS['Owner Legal Name'].expected);
  const [reason, setReason] = useState(FIELD_CORRECTION_PRESETS['Owner Legal Name'].reason);
  const [supportingDoc, setSupportingDoc] = useState(FIELD_CORRECTION_PRESETS['Owner Legal Name'].doc);
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [deadlineSLA, setDeadlineSLA] = useState('3 Days');
  const [remarks, setRemarks] = useState(defaultRemarks);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFieldChange = (field: string) => {
    setSelectedField(field);
    const preset = FIELD_CORRECTION_PRESETS[field] || FIELD_CORRECTION_PRESETS['Other / Procedural'];
    setCurrentVal(preset.current);
    setExpectedVal(preset.expected);
    setReason(preset.reason);
    setSupportingDoc(preset.doc);
  };

  const handleConfirm = () => {
    if (!reason) return;
    setIsSubmitting(true);
    const fullReason = `[${selectedField}] ${reason} (Expected: ${expectedVal} | SLA: ${deadlineSLA} | Req Doc: ${supportingDoc})`;
    onConfirm(fullReason, remarks);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                REQUEST CORRECTION
              </h3>
              <p className="text-xs text-slate-400">
                Application: <span className="font-mono font-bold text-amber-500">{applicationId}</span>
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

        {/* Structured Form */}
        <div className="space-y-3.5 text-xs">
          {/* Field Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Field Requiring Correction *
            </label>
            <select
              value={selectedField}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {Object.keys(FIELD_CORRECTION_PRESETS).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Current vs Expected Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Current Value (In Submitted Deed)
              </label>
              <input
                type="text"
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Expected / Government Master Value
              </label>
              <input
                type="text"
                value={expectedVal}
                onChange={(e) => setExpectedVal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Correction Reason *
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Detailed statutory rationale for correction..."
            />
          </div>

          {/* Required Supporting Document */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Required Supporting Document from Citizen *
            </label>
            <input
              type="text"
              value={supportingDoc}
              onChange={(e) => setSupportingDoc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Citizen SLA Deadline</label>
              <select
                value={deadlineSLA}
                onChange={(e) => setDeadlineSLA(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="3 Days">3 Days (Fast-track)</option>
                <option value="7 Days">7 Days (Standard)</option>
                <option value="15 Days">15 Days (Statutory Max)</option>
              </select>
            </div>
          </div>

          {/* Officer Remarks */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Internal Officer Notes (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-500"
              placeholder="Additional guidance for citizen or verifying officer..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleConfirm}
            disabled={!reason || isSubmitting}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Correction Request</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
