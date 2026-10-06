import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface QueueFiltersProps {
  status: string;
  onStatusChange: (status: string) => void;
  priority: string;
  onPriorityChange: (priority: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export const QueueFilters: React.FC<QueueFiltersProps> = ({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  search,
  onSearchChange,
  onReset,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID (DEO-2026-...), Citizen Name, Survey No, Village..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="NEEDS_ATTENTION">Needs Attention (Exceptions)</option>
            <option value="READY_TO_FORWARD">Ready to Forward</option>
            <option value="MISSING_DOCUMENTS">Missing Documents</option>
            <option value="PENDING_DEO_REVIEW">Pending Review</option>
            <option value="API_FAILURE_MANUAL_ENTRY">API Failure (Manual Entry)</option>
            <option value="ROUTED_TO_VERIFIER">Forwarded to Verifier</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low / Routine</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="p-2.5 text-slate-400 hover:text-white rounded-2xl bg-slate-950 border border-slate-800 hover:bg-slate-800 transition-colors"
          title="Reset Filters"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
