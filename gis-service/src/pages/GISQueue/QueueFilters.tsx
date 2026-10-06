import { Search, Filter, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { TrafficLight, GISApplicationStatus } from '../../api/types';

interface QueueFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTrafficLight: string;
  onTrafficLightChange: (tl: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPriority: string;
  onPriorityChange: (p: string) => void;
  onReset: () => void;
  counts: {
    all: number;
    green: number;
    yellow: number;
    red: number;
  };
}

export const QueueFilters = ({
  searchQuery,
  onSearchChange,
  selectedTrafficLight,
  onTrafficLightChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  onReset,
  counts,
}: QueueFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('Search App No, Survey No, Citizen...')}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Traffic Light Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => onTrafficLightChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedTrafficLight === 'all'
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {t('All')} ({counts.all})
          </button>
          <button
            onClick={() => onTrafficLightChange('green')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              selectedTrafficLight === 'green'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-emerald-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {t('Green')} ({counts.green})
          </button>
          <button
            onClick={() => onTrafficLightChange('yellow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              selectedTrafficLight === 'yellow'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {t('Yellow')} ({counts.yellow})
          </button>
          <button
            onClick={() => onTrafficLightChange('red')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              selectedTrafficLight === 'red'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            {t('Red')} ({counts.red})
          </button>
        </div>
      </div>

      {/* Second Row: Detailed Dropdowns & Reset */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-medium">{t('Status')}:</span>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="all">{t('All Statuses')}</option>
            <option value="pending_gis_review">{t('Pending GIS Review')}</option>
            <option value="gis_verified">{t('Verified')}</option>
            <option value="gis_adjusted">{t('Adjusted')}</option>
            <option value="gis_flagged_field_survey">{t('Flagged for Field Survey')}</option>
            <option value="gis_rejected">{t('Rejected')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-medium">{t('Priority')}:</span>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="all">{t('All Priorities')}</option>
            <option value="urgent">{t('URGENT')}</option>
            <option value="high">{t('HIGH')}</option>
            <option value="normal">{t('NORMAL')}</option>
          </select>
        </div>

        <button
          onClick={onReset}
          className="ml-auto px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('Reset Filters')}</span>
        </button>
      </div>
    </div>
  );
};
