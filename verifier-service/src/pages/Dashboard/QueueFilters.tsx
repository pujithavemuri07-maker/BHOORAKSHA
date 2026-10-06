import { Filter, AlertTriangle, ShieldCheck, Clock, UserCheck, Cpu } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface QueueFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const QueueFilters = ({ activeFilter, onFilterChange }: QueueFiltersProps) => {
  const { t } = useTranslation();
  const filters = [
    { id: 'all', label: 'All Applications', icon: Filter },
    { id: 'high', label: 'High Risk', icon: AlertTriangle, color: 'text-rose-400' },
    { id: 'medium', label: 'Medium Risk', icon: Clock, color: 'text-amber-400' },
    { id: 'low', label: 'Routine / Low', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'deo', label: 'DEO Forwarded', icon: UserCheck, color: 'text-sky-400' },
    { id: 'ai', label: 'AI Direct', icon: Cpu, color: 'text-purple-400' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) => {
        const Icon = f.icon;
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${f.color || ''}`} />
            {t(f.label)}
          </button>
        );
      })}
    </div>
  );
};
