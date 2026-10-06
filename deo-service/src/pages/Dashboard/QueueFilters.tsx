import React from 'react';

interface QueueFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export const QueueFilters: React.FC<QueueFiltersProps> = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Applications' },
    { id: 'pending', label: 'Pending Review' },
    { id: 'api_failure', label: 'API Failures' },
    { id: 'correction', label: 'Correction Required' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentFilter === f.id
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};
