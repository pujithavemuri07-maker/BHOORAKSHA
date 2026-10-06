import React from 'react';
import { useTranslation } from '../../i18n';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface QueueFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedTehsil: string;
  onTehsilChange: (tehsil: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  tehsils: string[];
  onReset?: () => void;
}

export const QueueFilters: React.FC<QueueFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedTehsil,
  onTehsilChange,
  selectedPriority,
  onPriorityChange,
  tehsils,
  onReset,
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('Search by Application ID, Citizen, Survey No., Village...')}
          className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">{t('Filters')}:</span>
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="all">{t('All Statuses')}</option>
          <option value="pending">{t('Pending Final Approval')}</option>
          <option value="approved">{t('Approved & Mutated')}</option>
          <option value="rejected">{t('Final Rejected')}</option>
        </select>

        {/* Tehsil Filter */}
        <select
          value={selectedTehsil}
          onChange={(e) => onTehsilChange(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="all">{t('All Tehsils')}</option>
          {tehsils.map((tehsil) => (
            <option key={tehsil} value={tehsil}>
              {tehsil}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="all">{t('All Priorities')}</option>
          <option value="urgent">{t('Urgent')}</option>
          <option value="high">{t('High')}</option>
          <option value="medium">{t('Medium')}</option>
          <option value="normal">{t('Normal')}</option>
        </select>

        {/* Reset Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title={t('Reset Filters')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
