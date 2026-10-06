import { MapPin, AlertTriangle, CheckCircle2, ShieldCheck, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { GISStatsResponse } from '../../api/types';

interface MetricsCardsProps {
  stats: GISStatsResponse;
}

export const MetricsCards = ({ stats }: MetricsCardsProps) => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('gis.pendingGISReview', 'Pending GIS Review'),
      value: stats.pendingReview,
      subtitle: `${stats.pendingReview} ${t('parcels awaiting inspection')}`,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      bg: 'from-amber-500/10 to-amber-950/20 border-amber-500/20 text-amber-300',
      badge: t('Urgent Action'),
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      title: t('gis.overlapsDetected', 'Overlaps Detected'),
      value: stats.overlapsDetected,
      subtitle: `${stats.overlapsDetected} ${t('spatial boundary conflicts')}`,
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
      bg: 'from-rose-500/10 to-rose-950/20 border-rose-500/20 text-rose-300',
      badge: t('Spatial Mismatch'),
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      title: t('gis.resolvedToday', 'Resolved Today'),
      value: stats.resolvedToday,
      subtitle: t('Processed in current shift'),
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />,
      bg: 'from-cyan-500/10 to-cyan-950/20 border-cyan-500/20 text-cyan-300',
      badge: t('Current Shift'),
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      title: t('gis.totalVerified', 'Total Verified'),
      value: stats.totalVerified,
      subtitle: t('Cadastral parcels ratified'),
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      bg: 'from-emerald-500/10 to-emerald-950/20 border-emerald-500/20 text-emerald-300',
      badge: t('Master Cadastre'),
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-2xl bg-gradient-to-br ${card.bg} border backdrop-blur-sm transition-all hover:scale-[1.01] shadow-lg`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              {card.icon}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{card.value}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400 inline" />
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};
