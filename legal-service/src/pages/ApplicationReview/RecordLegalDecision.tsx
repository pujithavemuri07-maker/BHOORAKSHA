import React, { useState } from 'react';
import { LegalApplication } from '../../api/types';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Scale,
  Award,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface RecordLegalDecisionProps {
  application: LegalApplication;
  onClear: (opinion: string) => void;
  onFlag: (data: { reason: string; opinion: string }) => void;
  onBlock: (data: { reason: string; opinion: string; legalReferences: string[] }) => void;
  onEscalate: (remarks: string) => void;
  isSubmitting?: boolean;
}

type DecisionType = 'CLEAR' | 'REQUEST_CORRECTION' | 'PLACE_LEGAL_HOLD' | 'ESCALATE';

export const RecordLegalDecision: React.FC<RecordLegalDecisionProps> = ({
  application,
  onClear,
  onFlag,
  onBlock,
  onEscalate,
  isSubmitting = false,
}) => {
  const user = useAuthStore((s) => s.user);

  const [selectedDecision, setSelectedDecision] = useState<DecisionType | null>(null);
  const [decisionReason, setDecisionReason] = useState<string>('');
  const [officerRemarks, setOfficerRemarks] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isProcessed = application.status !== 'pending_legal_review';

  const decisionOptions = [
    {
      type: 'CLEAR' as DecisionType,
      title: 'CLEAR / APPROVE',
      description: 'No unresolved legal issue identified after review.',
      badgeText: 'Legal Review Cleared',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      activeColor: 'border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-950/40',
      defaultReason: 'All chain of title documents and revenue registers verified free from legal defect.',
      defaultRemarks: 'Evidence reviewed and verified free from unresolved legal defects. Recommended for authorized mutation proceeding.',
    },
    {
      type: 'REQUEST_CORRECTION' as DecisionType,
      title: 'REQUEST CORRECTION',
      description: 'Record or document correction is required before processing.',
      badgeText: '15-Day Notice',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      activeColor: 'border-amber-500 ring-2 ring-amber-500/50 bg-amber-950/40',
      defaultReason: 'Discrepancy in party names or missing registered prior link title deeds.',
      defaultRemarks: 'Applicant directed to submit certified link documents / rectifying deed.',
    },
    {
      type: 'PLACE_LEGAL_HOLD' as DecisionType,
      title: 'PLACE LEGAL HOLD',
      description: 'Processing should remain on hold because an unresolved legal issue requires attention.',
      badgeText: 'Section 52 / 22-A Hold',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
      activeColor: 'border-rose-500 ring-2 ring-rose-500/50 bg-rose-950/40',
      defaultReason: 'Active civil litigation caveat / Section 22-A prohibited land classification.',
      defaultRemarks: 'Mutation proceedings placed on legal hold pending judicial disposal.',
    },
    {
      type: 'ESCALATE' as DecisionType,
      title: 'ESCALATE',
      description: 'Refer the case to the appropriate higher authority for further review.',
      badgeText: 'Revenue Authority',
      icon: <ArrowUpRight className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      activeColor: 'border-purple-500 ring-2 ring-purple-500/50 bg-purple-950/40',
      defaultReason: 'Complex multi-party succession dispute or policy ambiguity requiring Tehsildar adjudication.',
      defaultRemarks: 'Escalated to Mandal Revenue Officer / Tehsildar for statutory hearing.',
    },
  ];

  const handleSelectDecision = (option: typeof decisionOptions[0]) => {
    setSelectedDecision(option.type);
    if (!decisionReason) setDecisionReason(option.defaultReason);
    if (!officerRemarks) setOfficerRemarks(option.defaultRemarks);
  };

  const handleOpenConfirmation = () => {
    if (!selectedDecision) {
      toast.error('Please select a legal decision first');
      return;
    }
    if (!decisionReason.trim()) {
      toast.error('Please provide a Decision Reason');
      return;
    }
    if (!officerRemarks.trim()) {
      toast.error('Please provide Officer Remarks');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecuteDecision = () => {
    const combinedOpinion = `DECISION REASON:\n${decisionReason}\n\nOFFICER REMARKS:\n${officerRemarks}`;

    if (selectedDecision === 'CLEAR') {
      onClear(combinedOpinion);
    } else if (selectedDecision === 'REQUEST_CORRECTION') {
      onFlag({ reason: decisionReason, opinion: combinedOpinion });
    } else if (selectedDecision === 'PLACE_LEGAL_HOLD') {
      onBlock({
        reason: decisionReason,
        opinion: combinedOpinion,
        legalReferences: ['Section 52 Transfer of Property Act 1882', 'Section 22-A Registration Act 1908'],
      });
    } else if (selectedDecision === 'ESCALATE') {
      onEscalate(combinedOpinion);
    }

    setShowConfirmModal(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            Record Legal Decision
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select the formal quasi-judicial statutory determination. All decisions are cryptographically recorded with officer DSC.
          </p>
        </div>

        {isProcessed && (
          <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto">
            CURRENT RECORDED STATUS: {application.status.toUpperCase()}
          </span>
        )}
      </div>

      {/* 4 Decision Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {decisionOptions.map((opt) => {
          const isSelected = selectedDecision === opt.type;

          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleSelectDecision(opt)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all relative group cursor-pointer ${
                isSelected ? opt.activeColor : `${opt.color} hover:border-slate-600`
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 group-hover:scale-105 transition-transform">
                  {opt.icon}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                  {opt.badgeText}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {opt.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {opt.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400">
                  {isSelected ? 'Selected' : 'Click to select'}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Required Decision Details Inputs */}
      {selectedDecision && (
        <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-white">
              Decision Details for: <span className="text-indigo-300 font-mono">{selectedDecision.replace(/_/g, ' ')}</span>
            </span>
            <span className="text-[11px] text-slate-400">Officer Input Required</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Decision Reason *
            </label>
            <input
              type="text"
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="State the core legal ground or statutory provision..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Officer Remarks & Statutory Directive *
            </label>
            <textarea
              value={officerRemarks}
              onChange={(e) => setOfficerRemarks(e.target.value)}
              rows={3}
              placeholder="Provide detailed reasons, conditions, or instructions to revenue authorities..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleOpenConfirmation}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950/80 flex items-center gap-2"
            >
              <span>Confirm Legal Decision</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Summary Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Confirmation Summary</h3>
                  <p className="text-xs text-slate-400">Review decision details before recording</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Case ID:</span>
                  <span className="font-mono font-bold text-indigo-300">{application.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Decision:</span>
                  <span className="font-bold text-white uppercase">{selectedDecision?.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Decision Reason:</span>
                  <span className="font-medium text-slate-200 text-right max-w-xs">{decisionReason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Officer Name:</span>
                  <span className="font-semibold text-emerald-300">{user?.name || 'Adv. Rajeshwari Sharma'}</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-indigo-200 text-[11px] leading-relaxed flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>This decision will be cryptographically signed and permanently recorded in the Legal Audit Ledger.</span>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDecision}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Record & Seal Decision'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
