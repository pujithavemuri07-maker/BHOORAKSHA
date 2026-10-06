import { useTranslation } from '../../i18n';
import { Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatsResponse } from '../../api/types';

interface MetricsCardsProps {
  metrics: StatsResponse;
  isLoading?: boolean;
}

export const MetricsCards = ({ metrics, isLoading }: MetricsCardsProps) => {
  const { t } = useTranslation();

  const cards = [
    {
      label: t('verifier.pendingVerification'),
      sublabel: t('Awaiting Girdawar review'),
      value: metrics.pending,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      label: t('COMPLETED REVIEWS TODAY'),
      sublabel: t('Total verification decisions today'),
      value: metrics.verifiedToday,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: t('verifier.approvalRate'),
      sublabel: t('Approved decisions / Total decisions'),
      value: `${metrics.approvalRate}%`,
      icon: TrendingUp,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
    },
    {
      label: t('verifier.highRisk'),
      sublabel: t('High Review Priority pending action'),
      value: metrics.highRisk,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
    },
  ];

  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`bg-slate-900/90 border ${card.border} rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all hover:translate-y-[-2px]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <div className="text-3xl font-extrabold text-white mt-2 tracking-tight font-mono">
                  {isLoading ? '...' : card.value}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{card.sublabel}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
