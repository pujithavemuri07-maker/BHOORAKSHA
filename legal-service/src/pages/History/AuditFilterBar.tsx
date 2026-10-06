import React from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';

interface AuditFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  actionFilter: string;
  onActionFilterChange: (val: string) => void;
  riskFilter: string;
  onRiskFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const AuditFilterBar: React.FC<AuditFilterBarProps> = ({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  actionFilter,
  onActionFilterChange,
  riskFilter,
  onRiskFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
      {/* Top row: Search input & Clear Button */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Case ID, citizen, survey number, ULPIN, or audit reference..."
            className="w-full pl-9 pr-8 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0 self-end md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Bottom row: Filter Select dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Date Range */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
          </select>
        </div>

        {/* Action / Determination */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Action / Decision
          </label>
          <select
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="CLEARED">Cleared</option>
            <option value="FLAGGED">Correction Required</option>
            <option value="BLOCKED">Legal Hold</option>
            <option value="ESCALATED">Escalated</option>
            <option value="UNDER_REVIEW">Under Review</option>
          </select>
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Risk Level
          </label>
          <select
            value={riskFilter}
            onChange={(e) => onRiskFilterChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        {/* Case Status */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Case Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="completed">Completed / Cleared</option>
            <option value="escalated">Escalated</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>
    </div>
  );
};
