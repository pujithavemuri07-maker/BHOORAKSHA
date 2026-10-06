import React from 'react';
import { Scale, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="py-16 text-center flex flex-col items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800 my-6">
      <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-4 border border-indigo-500/20">
        <Scale className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">No Legal Cases Found</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
        No applications match the specified criteria or all pending legal scrutiny cases have been completed.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
