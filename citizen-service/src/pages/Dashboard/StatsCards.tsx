import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ApplicationStats } from '../../api/types';
import { useTranslation } from '../../i18n';

interface StatsCardsProps {
  stats: ApplicationStats;
  isLoading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  const { t } = useTranslation();

  const cards = [
    {
      label: t('Total Applications'),
      value: stats.total,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      tag: t('All Submissions'),
    },
    {
      label: t('Under Active Review'),
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      tag: t('In Pipeline'),
    },
    {
      label: t('Approved & Mutation Done'),
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      tag: t('Sanctioned'),
    },
    {
      label: t('Action / Correction'),
      value: stats.correctionRequired || stats.rejected,
      icon: XCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      tag: t('Attention Needed'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {card.tag}
              </span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {isLoading ? '...' : card.value}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-1">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
