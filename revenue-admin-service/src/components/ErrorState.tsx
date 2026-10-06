import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Failed to load data', onRetry }: ErrorStateProps) => {
  return (
    <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
      <AlertCircle className="w-10 h-10 text-rose-400 mb-2" />
      <h3 className="text-sm font-bold text-white mb-1">Administrative Service Error</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
