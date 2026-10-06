import React from 'react';
import { FileQuestion, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface EmptyStateProps {
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onResetFilters }) => {
  const { t } = useTranslation();

  return (
    <div className="py-16 text-center p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
        <FileQuestion className="w-6 h-6 text-indigo-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-200">
          {t('No Applications Found')}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          {t('No applications match your active search filters or all pending cases in this Tehsil have already been cleared.')}
        </p>
      </div>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t('Reset Search Filters')}
        </button>
      )}
    </div>
  );
};
