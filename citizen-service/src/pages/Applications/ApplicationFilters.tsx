import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../i18n';

interface ApplicationFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FILTER_TABS = [
  { id: 'ALL', label: 'All Applications' },
  { id: 'AI_PROCESSING', label: 'In Verification' },
  { id: 'APPROVED', label: 'Approved & Mutation Done' },
  { id: 'CORRECTION_REQUIRED', label: 'Correction Required' },
  { id: 'REJECTED', label: 'Rejected' },
];

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('Search by Application ID (e.g. REQ-2026), Survey Number (e.g. 118/A), or ULPIN...')}
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mr-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('Status:')}</span>
        </div>
        {FILTER_TABS.map((tab) => {
          const active = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0',
                active
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              )}
            >
              {t(tab.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
