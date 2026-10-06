import React from 'react';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

interface LegalDecisionActionsProps {
  onBack: () => void;
  onClearTitle: () => void;
  onRejectTitle: () => void;
}

export const LegalDecisionActions: React.FC<LegalDecisionActionsProps> = ({
  onBack,
  onClearTitle,
  onRejectTitle,
}) => {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-800">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Queue</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={onRejectTitle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
        >
          <XCircle className="w-4 h-4" />
          <span>Title Disputed - Reject</span>
        </button>

        <button
          onClick={onClearTitle}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Record Legal Clearance (Return to Workflow)</span>
        </button>
      </div>
    </div>
  );
};
