import React from 'react';
import { MetricsCards } from './MetricsCards';
import { LegalQueuePreview } from './LegalQueuePreview';
import {
  WhyCasesFlagged,
  LegalRiskOverview,
  UpcomingActions,
  RecentLegalDecisions,
  QuickActions,
  SystemDataStatus,
} from './TodayActivity';
import { Scale, CheckCircle2, ArrowUpRight, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLegalStore } from '../../store/legalStore';
import { useTranslation } from '../../i18n';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const applications = useLegalStore((s) => s.applications);
  const history = useLegalStore((s) => s.history);

  const pendingCount = applications.filter((a) => a.status === 'pending_legal_review').length || 5;
  const urgentCount = applications.filter((a) => a.priority === 'urgent' || a.escalated || a.severity === 'high').length || 2;
  const reviewedToday = history.length || 4;
  const escalatedCount = applications.filter((a) => a.escalated || a.status === 'escalated_by_legal').length || 2;

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Good morning');
    if (hour < 17) return t('Good afternoon');
    return t('Good evening');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 2. WELCOME / WORKLOAD SUMMARY */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>{t('Revenue Legal Wing • Directorate of Land Protection')}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {getGreeting()}, {user?.name || 'Adv. Rajeshwari Sharma'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {t('You have')}{' '}
            <span className="font-bold text-amber-300">
              {pendingCount} {t('land-record cases')}
            </span>{' '}
            {t('awaiting legal review.')}{' '}
            <span className="font-bold text-rose-300">
              {urgentCount} {t('cases')}
            </span>{' '}
            {t('require priority attention.')}
          </p>
        </div>

        {/* Compact Right Status Panel: Today's Work */}
        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-4 self-start md:self-auto shrink-0">
          <div className="border-r border-slate-800 pr-3">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {t("Today's Work")}
            </div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">
              {t('Summary Metrics')}
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-center">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{t('Pending Review')}</span>
              </div>
              <div className="text-base font-black font-mono text-amber-300 mt-0.5">{pendingCount}</div>
            </div>

            <div className="w-px h-7 bg-slate-800" />

            <div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{t('Reviewed Today')}</span>
              </div>
              <div className="text-base font-black font-mono text-emerald-300 mt-0.5">{reviewedToday}</div>
            </div>

            <div className="w-px h-7 bg-slate-800" />

            <div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-center">
                <ArrowUpRight className="w-3 h-3 text-purple-400" />
                <span>{t('Escalated')}</span>
              </div>
              <div className="text-base font-black font-mono text-purple-300 mt-0.5">{escalatedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KEY WORKLOAD CARDS (5 KPI cards in one responsive row) */}
      <MetricsCards />

      {/* 4. MAIN SECTION: CASES REQUIRING LEGAL ACTION */}
      <LegalQueuePreview />

      {/* 5 & 6. WHY CASES ARE BEING FLAGGED + LEGAL RISK OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhyCasesFlagged />
        <LegalRiskOverview />
      </div>

      {/* 7 & 8. UPCOMING ACTIONS & RECENT LEGAL DECISIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingActions />
        <RecentLegalDecisions />
      </div>

      {/* 9. QUICK ACTIONS */}
      <QuickActions />

      {/* 10. SYSTEM / DATA STATUS */}
      <SystemDataStatus />
    </div>
  );
};

export default Dashboard;
