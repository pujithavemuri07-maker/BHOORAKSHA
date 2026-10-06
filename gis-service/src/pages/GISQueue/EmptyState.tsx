import { MapPinOff, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export const EmptyState = ({ onResetFilters }: EmptyStateProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-12 text-center flex flex-col items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800 my-4">
      <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-teal-400 mb-4 border border-slate-700">
        <MapPinOff className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">No Parcels Found</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        No cadastral boundary applications match your current filters or search criteria.
      </p>
      <button
        onClick={onResetFilters}
        className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-teal-400 transition-all shadow-lg"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reset Search & Filters</span>
      </button>
    </div>
  );
};
