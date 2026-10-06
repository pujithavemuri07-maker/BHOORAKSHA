import { Search, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface QueueFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  priority: string;
  onPriorityChange: (priority: string) => void;
  source: string;
  onSourceChange: (source: string) => void;
  reviewCycle?: string;
  onReviewCycleChange?: (cycle: string) => void;
  missingDocs?: string;
  onMissingDocsChange?: (val: string) => void;
  gisConflict?: string;
  onGisConflictChange?: (val: string) => void;
  onReset: () => void;
}

export const QueueFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  source,
  onSourceChange,
  reviewCycle = 'all',
  onReviewCycleChange,
  missingDocs = 'all',
  onMissingDocsChange,
  gisConflict = 'all',
  onGisConflictChange,
  onReset,
}: QueueFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('Search App ID, Citizen, Survey, Hissa, Village, Reg No...')}
          className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
      >
        <option value="all">{t('All Verification Statuses')}</option>
        <option value="pending_verification">{t('Pending Verification')}</option>
        <option value="approved">{t('Verified & Approved')}</option>
        <option value="rejected">{t('Rejected')}</option>
        <option value="returned_to_deo">{t('Returned to DEO')}</option>
        <option value="escalated_to_revenue">{t('Escalated to Tehsildar')}</option>
      </select>

      {/* Priority Filter */}
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
      >
        <option value="all">{t('All Priorities')}</option>
        <option value="high">{t('High Priority (<50)')}</option>
        <option value="medium">{t('Medium Priority (50-75)')}</option>
        <option value="low">{t('Low Priority (>75)')}</option>
      </select>

      {/* Ingestion Source Filter */}
      <select
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
      >
        <option value="all">{t('All Ingestion Sources')}</option>
        <option value="deo">{t('DEO Forwarded')}</option>
        <option value="ai">{t('AI-ROUTED Ingestion')}</option>
      </select>

      {/* Review Cycle Filter */}
      {onReviewCycleChange && (
        <select
          value={reviewCycle}
          onChange={(e) => onReviewCycleChange(e.target.value)}
          className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">{t('All Review Cycles')}</option>
          <option value="1">{t('Cycle 1 (First Review)')}</option>
          <option value="2">{t('Cycle 2 (Resubmitted)')}</option>
        </select>
      )}

      {/* Missing Docs Filter */}
      {onMissingDocsChange && (
        <select
          value={missingDocs}
          onChange={(e) => onMissingDocsChange(e.target.value)}
          className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">{t('All Document Statuses')}</option>
          <option value="missing">{t('Missing Documents ⚠')}</option>
          <option value="complete">{t('Complete Documents ✓')}</option>
        </select>
      )}

      {/* GIS Conflict Filter */}
      {onGisConflictChange && (
        <select
          value={gisConflict}
          onChange={(e) => onGisConflictChange(e.target.value)}
          className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">{t('All GIS Results')}</option>
          <option value="mismatch">{t('GIS Area Mismatch ⚠')}</option>
          <option value="tolerance">{t('Within Tolerance ✓')}</option>
        </select>
      )}

      {/* Reset Filter Button */}
      <button
        onClick={onReset}
        title={t('Reset Filters')}
        className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
