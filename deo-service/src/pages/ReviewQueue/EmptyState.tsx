import React from 'react';
import { ListChecks, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
        <ListChecks className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">No Applications Found</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-5">
        No land title applications match your selected filter criteria or search query.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
