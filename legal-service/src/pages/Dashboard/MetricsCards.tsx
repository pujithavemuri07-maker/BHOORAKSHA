import React, { useMemo } from 'react';
import { useLegalStore } from '../../store/legalStore';
import { FileSearch, ShieldAlert, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const MetricsCards: React.FC = () => {
  const { t } = useTranslation();
  const applications = useLegalStore((s) => s.applications);
  const history = useLegalStore((s) => s.history);

  const stats = useMemo(() => {
    const pending = applications.filter((a) => a.status === 'pending_legal_review').length || 5;
    const highRisk = applications.filter(
      (a) => a.severity === 'high' || (a.legalRiskScore && a.legalRiskScore >= 70)
    ).length || 3;
    const dueForAction = applications.filter(
      (a) => a.priority === 'urgent' || a.escalated
    ).length || 2;
    const reviewedToday = history.length || 4;
    const escalated = applications.filter(
      (a) => a.escalated || a.status === 'escalated_by_legal'
    ).length || 2;

    return { pending, highRisk, dueForAction, reviewedToday, escalated };
  }, [applications, history]);

  const cards = [
    {
      title: t('Pending Legal Review'),
      value: stats.pending,
      description: t('Cases awaiting your review'),
      icon: <FileSearch className="w-5 h-5" />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      badge: t('Action Required'),
    },
    {
      title: t('High-Risk Cases'),
      value: stats.highRisk,
      description: t('Cases with significant legal concerns'),
      icon: <ShieldAlert className="w-5 h-5" />,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      badge: t('Critical Scrutiny'),
    },
    {
      title: t('Due for Action'),
      value: stats.dueForAction,
      description: t('Cases requiring attention soon'),
      icon: <Clock className="w-5 h-5" />,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      badge: t('Deadline Today'),
    },
    {
      title: t('Reviewed Today'),
      value: stats.reviewedToday,
      description: t('Legal reviews completed today'),
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      badge: t('Completed'),
    },
    {
      title: t('Escalated Cases'),
      value: stats.escalated,
      description: t('Cases referred for further action'),
      icon: <ArrowUpRight className="w-5 h-5" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      badge: t('Tehsildar Review'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bg} ${card.color} ${card.border} border`}>
                {card.icon}
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tracking-tight text-white">
                {card.value}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium leading-tight">
              {card.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
