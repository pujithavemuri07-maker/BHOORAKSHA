import React, { useState } from 'react';
import { LegalApplication, LegalFlag } from '../../api/types';
import {
  Scale,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Info,
  BookOpen,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AILegalAssessmentProps {
  application: LegalApplication;
  onQuoteCitation?: (citation: string) => void;
}

export const AILegalAssessment: React.FC<AILegalAssessmentProps> = ({
  application,
  onQuoteCitation,
}) => {
  // Local verification status state per flag
  const [verificationMap, setVerificationMap] = useState<
    Record<string, 'AI_DETECTED' | 'OFFICER_CONFIRMED' | 'OFFICER_REJECTED' | 'PENDING_VERIFICATION'>
  >({});

  const getStatus = (flagId: string) => {
    return verificationMap[flagId] || 'PENDING_VERIFICATION';
  };

  const handleConfirmFinding = (flag: LegalFlag) => {
    setVerificationMap((prev) => ({
      ...prev,
      [flag.id]: 'OFFICER_CONFIRMED',
    }));
    toast.success(`Finding confirmed by Officer: ${flag.title}`);
  };

  const handleRejectFinding = (flag: LegalFlag) => {
    setVerificationMap((prev) => ({
      ...prev,
      [flag.id]: 'OFFICER_REJECTED',
    }));
    toast.success(`Finding marked as Not Applicable: ${flag.title}`);
  };

  const highSeverityCount = application.legalFlags.filter((f) => f.severity === 'high').length;
  const medSeverityCount = application.legalFlags.filter((f) => f.severity === 'medium').length;
  const lowSeverityCount = application.legalFlags.filter((f) => f.severity === 'low').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OFFICER_CONFIRMED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Officer Confirmed
          </span>
        );
      case 'OFFICER_REJECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-slate-400" />
            Officer Rejected / N/A
          </span>
        );
      case 'AI_DETECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Scale className="w-3 h-3 text-purple-400" />
            AI Detected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Pending Officer Verification
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Assessment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            AI Legal Title Due Diligence Assessment
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-assisted review of potential legal risks, statutory encumbrances, and record inconsistencies
          </p>
        </div>

        {/* Severity Count Summary Chips */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono font-bold">
            {highSeverityCount} High Severity
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold">
            {medSeverityCount} Medium Severity
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
            {lowSeverityCount} Low Severity
          </span>
        </div>
      </div>

      {/* Statutory Disclaimer Box */}
      <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200/90 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Statutory Role of AI Assessment: </span>
          AI analysis identifies potential legal issues for officer verification. It does not replace the Legal Officer's review or final decision.
        </div>
      </div>

      {/* Findings & Evidence Stack */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Detailed Legal Findings & Statutory Evidence ({application.legalFlags.length})</span>
          <span className="text-[11px] text-slate-500">Verify each finding below</span>
        </div>

        {application.legalFlags.map((flag, idx) => {
          const currentStatus = getStatus(flag.id);
          const isHigh = flag.severity === 'high';
          const isMedium = flag.severity === 'medium';

          return (
            <div
              key={flag.id || idx}
              className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                currentStatus === 'OFFICER_CONFIRMED'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : currentStatus === 'OFFICER_REJECTED'
                  ? 'bg-slate-950/40 border-slate-800 opacity-70'
                  : isHigh
                  ? 'bg-slate-950/80 border-rose-500/30 hover:border-rose-500/50'
                  : isMedium
                  ? 'bg-slate-950/80 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Finding Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono border ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : isMedium
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {flag.severity} Severity
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {flag.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Category: <span className="text-slate-300 font-semibold uppercase">{flag.type.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(currentStatus)}
                </div>
              </div>

              {/* What was detected */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  What Was Detected:
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {flag.description}
                </p>
              </div>

              {/* Evidence & References Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Source Document & Page:</span>
                  <span className="text-slate-200 font-mono text-[11px]">
                    {flag.type === 'ownership_inconsistency'
                      ? 'Presented Deed (Page 1 vs Page 3)'
                      : flag.type === 'under_litigation'
                      ? 'Senior Civil Court Sangareddy Registry'
                      : flag.type === 'non_transferable'
                      ? 'Section 22-A Prohibited Database'
                      : 'Deed Instrument & RoR Schedule'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Statutory Reference / Rule:</span>
                  <span className="text-indigo-300 font-semibold text-[11px]">
                    {flag.citation || (isHigh ? 'Section 52 T.P. Act / Sec 22-A Reg. Act' : 'Rule 26 Revenue Standing Orders')}
                  </span>
                </div>
              </div>

              {/* Why it may require review */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Why It May Require Officer Review:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {flag.recommendation}
                </p>
              </div>

              {/* Action Buttons: Confirm / Reject / Quote */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmFinding(flag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentStatus === 'OFFICER_CONFIRMED'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Finding</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRejectFinding(flag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentStatus === 'OFFICER_REJECTED'
                        ? 'bg-slate-700 text-white shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Mark as Not Applicable</span>
                  </button>
                </div>

                {onQuoteCitation && (
                  <button
                    type="button"
                    onClick={() => onQuoteCitation(flag.citation || `${flag.title} (${flag.description})`)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Quote in Officer Notes</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
