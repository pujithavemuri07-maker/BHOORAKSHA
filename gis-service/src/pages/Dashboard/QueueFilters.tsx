import { Filter } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface QueueFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    green: number;
    yellow: number;
    red: number;
    pending: number;
  };
}

export const QueueFilters = ({
  currentFilter,
  onFilterChange,
  counts,
}: QueueFiltersProps) => {
  const { t } = useTranslation();

  const filterButtons = [
    { id: 'all', label: t('All'), count: counts.all, color: 'text-slate-300' },
    { id: 'pending', label: t('Pending GIS Review'), count: counts.pending, color: 'text-cyan-400' },
    { id: 'green', label: t('Green'), count: counts.green, color: 'text-emerald-400' },
    { id: 'yellow', label: t('Yellow'), count: counts.yellow, color: 'text-amber-400' },
    { id: 'red', label: t('Red'), count: counts.red, color: 'text-rose-400' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <div className="flex items-center gap-1.5 text-slate-400 mr-2 shrink-0">
        <Filter className="w-3.5 h-3.5 text-teal-400" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">{t('Filter')}:</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {filterButtons.map((btn) => {
          const isActive = currentFilter === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => onFilterChange(btn.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 border text-xs ${
                isActive
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className={btn.color}>{btn.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {btn.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
