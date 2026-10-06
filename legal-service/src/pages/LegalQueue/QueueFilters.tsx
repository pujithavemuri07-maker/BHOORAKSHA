import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface QueueFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  severity: string;
  onSeverityChange: (severity: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  priority: string;
  onPriorityChange: (priority: string) => void;
  onReset: () => void;
}

export const QueueFilters: React.FC<QueueFiltersProps> = ({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const severityOptions = [
    { value: 'all', label: t('All Severities') },
    { value: 'high', label: t('High Severity') },
    { value: 'medium', label: t('Medium Severity') },
    { value: 'low', label: t('Low Severity') },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('Search by Case ID (LEG-2026-...), Citizen Name, Survey No...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('All Legal Statuses')}</option>
          <option value="pending_legal_review">{t('Pending Legal Review')}</option>
          <option value="cleared_by_legal">{t('Cleared by Legal')}</option>
          <option value="flagged_by_legal">{t('Flagged for Rectification')}</option>
          <option value="blocked_by_legal">{t('Legally Blocked')}</option>
          <option value="escalated_by_legal">{t('Escalated to Tehsildar')}</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('All Priorities')}</option>
          <option value="urgent">{t('Urgent')}</option>
          <option value="normal">{t('Normal')}</option>
          <option value="low">{t('Low')}</option>
        </select>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          title={t('Reset Filters')}
          className="p-2 bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <span className="text-[11px] font-semibold text-slate-400 mr-1 uppercase tracking-wider">
          {t('Severity Filter')}:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {severityOptions.map((opt) => {
            const active = severity === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSeverityChange(opt.value)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
