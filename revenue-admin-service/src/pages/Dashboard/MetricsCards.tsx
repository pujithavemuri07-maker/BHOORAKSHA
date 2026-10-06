import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  ArrowUpRight,
} from 'lucide-react';

interface MetricsCardsProps {
  stats: {
    totalApplications: number;
    pendingFinalApproval: number;
    approvedThisMonth: number;
    rejectedThisMonth: number;
    mutationTriggered: number;
    certificatesGenerated: number;
  };
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ stats }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cards = [
    {
      label: t('revenue.totalApplications'),
      value: stats.totalApplications,
      icon: FileText,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
      badge: '+12% this wk',
      badgeColor: 'text-blue-400 bg-blue-500/10',
      path: '/revenue/review?status=all',
    },
    {
      label: t('revenue.pendingFinalApproval'),
      value: stats.pendingFinalApproval,
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      badge: 'Needs Action',
      badgeColor: 'text-amber-400 bg-amber-500/10 animate-pulse',
      path: '/revenue/review?status=pending',
    },
    {
      label: t('revenue.approvedThisMonth'),
      value: stats.approvedThisMonth,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      badge: '+18% MoM',
      badgeColor: 'text-emerald-400 bg-emerald-500/10',
      path: '/revenue/history?action=approved',
    },
    {
      label: t('revenue.rejectedThisMonth'),
      value: stats.rejectedThisMonth,
      icon: XCircle,
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
      badge: '3.4% rate',
      badgeColor: 'text-rose-400 bg-rose-500/10',
      path: '/revenue/history?action=rejected',
    },
    {
      label: t('revenue.mutationsTriggered'),
      value: stats.mutationTriggered,
      icon: TrendingUp,
      color: 'from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30',
      badge: 'Dharani Sync',
      badgeColor: 'text-purple-400 bg-purple-500/10',
      path: '/revenue/history',
    },
    {
      label: t('revenue.certificatesGenerated'),
      value: stats.certificatesGenerated,
      icon: Award,
      color: 'from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30',
      badge: 'QR Signed',
      badgeColor: 'text-cyan-400 bg-cyan-500/10',
      path: '/revenue/reports',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group relative overflow-hidden cursor-pointer active:scale-95"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.path);
                }}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${card.badgeColor} flex items-center gap-0.5 group-hover:scale-105 transition-transform cursor-pointer`}
              >
                {card.badge}
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                {card.value.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                {card.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

