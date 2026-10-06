import { AlertCircle, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Failed to load data', onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
      <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">Unable to Fetch Record</h3>
      <p className="text-sm text-slate-400 max-w-md mt-1 mb-6">{message}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Operation
          </button>
        )}
        <Link
          to="/verifier/dashboard"
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
