import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load case data',
  message = 'An unexpected error occurred while communicating with the Legal Registry node.',
  onRetry,
}) => {
  return (
    <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center justify-center my-6 max-w-md mx-auto">
      <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl mb-4 border border-red-500/20">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
