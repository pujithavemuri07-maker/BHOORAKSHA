import React, { useState } from 'react';
import { X, FileText, Send, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { useDEOStore } from '../store/deoStore';
import toast from 'react-hot-toast';

interface RequestMissingDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

const MISSING_DOC_PRESETS = [
  { id: 'id_proof', label: 'Citizen Identity Proof (Masked Aadhaar / Voter ID / Passport)' },
  { id: 'fmb_map', label: 'Cadastral Sub-Division Map / FMB Demarcation Tippan' },
  { id: 'ror_extract', label: 'Certified 1-B Village ROR / Pahani Register Extract' },
  { id: 'mutation_order', label: 'Prior Mutation Proceeding Order Copy' },
  { id: 'heir_noc', label: 'Donor Legal Heir NOC / Death Certificate' },
  { id: 'ec_certificate', label: '15-Year Encumbrance Certificate (Nil EC)' },
  { id: 'sro_cc', label: 'Certified True Copy (CC) of Registered Deed from SRO' },
  { id: 'other', label: 'Other Statutory Supporting Document' },
];

export const RequestMissingDocModal: React.FC<RequestMissingDocModalProps> = ({
  isOpen,
  onClose,
  applicationId,
}) => {
  const requestMissingDocument = useDEOStore((state) => state.requestMissingDocument);

  const [selectedDoc, setSelectedDoc] = useState(MISSING_DOC_PRESETS[0].label);
  const [deadlineSLA, setDeadlineSLA] = useState('3 Days');
  const [remarks, setRemarks] = useState(
    'Please upload clear 300 DPI scanned copy of the requested document to proceed with verification.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendRequest = () => {
    setIsSubmitting(true);
    requestMissingDocument(
      applicationId,
      selectedDoc,
      `[SLA: ${deadlineSLA}] ${remarks}`
    );
    setIsSubmitting(false);
    toast.success(`Missing document request sent for ${applicationId}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                REQUEST MISSING DOCUMENT
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

        {/* Form Body */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Select Missing Statutory Document *
            </label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {MISSING_DOC_PRESETS.map((d) => (
                <option key={d.id} value={d.label}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Submission SLA Deadline
            </label>
            <select
              value={deadlineSLA}
              onChange={(e) => setDeadlineSLA(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="3 Days">3 Days (Fast-Track Notice)</option>
              <option value="7 Days">7 Days (Standard SLA)</option>
              <option value="15 Days">15 Days (Statutory Max Notice)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Specific Instructions for Citizen / Applicant *
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-500"
              placeholder="Enter specific guidance (e.g., Scan must clearly show schedule boundaries)..."
            />
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Citizen will receive an automated SMS & portal notification with upload link.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleSendRequest}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Notice to Citizen</span>
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
