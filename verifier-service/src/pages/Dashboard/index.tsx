import { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';
import { useVerifierQueue } from '../../hooks/useVerifierQueue';
import { useVerifierStore } from '../../store/verifierStore';
import { MetricsCards } from './MetricsCards';
import { AttentionSummaryCard } from './AttentionSummaryCard';
import { VerificationQueue } from './VerificationQueue';
import { QueueFilters } from './QueueFilters';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ListChecks, AlertTriangle, ShieldCheck, ArrowRight, Activity, CheckCircle, XCircle, RotateCcw, AlertOctagon } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const { data, isLoading } = useVerifierQueue({ filter: activeFilter });
  const applications = useVerifierStore((s) => s.applications);
  const history = useVerifierStore((s) => s.history);
  const getStats = useVerifierStore((s) => s.getStats);

  const liveStats = useMemo(() => getStats(), [applications, history, getStats]);

  const metrics = {
    pending: liveStats.pending,
    verifiedToday: liveStats.completedReviewsToday,
    completedReviewsToday: liveStats.completedReviewsToday,
    approvedToday: liveStats.approvedToday,
    rejectedToday: liveStats.rejectedToday,
    returnedToday: liveStats.returnedToday,
    escalatedToday: liveStats.escalatedToday,
    approvalRate: liveStats.approvalRate,
    highRisk: liveStats.highRisk,
    attentionSummary: liveStats.attentionSummary,
  };

  return (
    <div className="space-y-6">
      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCards metrics={metrics} isLoading={isLoading} />
      </div>

      {/* VERIFICATION ATTENTION SUMMARY */}
      <AttentionSummaryCard attentionSummary={metrics.attentionSummary} />

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/verifier/review"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-950"
        >
          <ListChecks className="w-4 h-4" />
          <span>{t('verifier.viewQueue')} ({metrics.pending})</span>
        </Link>
        <Link
          to="/verifier/review?filter=high"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-rose-950"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{t('High Risk Verification')} ({metrics.highRisk})</span>
        </Link>
        <Link
          to="/verifier/history"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
        >
          <Activity className="w-4 h-4" />
          <span>{t('Verification History')}</span>
        </Link>
        <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t('Pahani / Dharani Cadastral Sync: Active')}</span>
        </div>
      </div>

      {/* Verification Queue Section with Filters */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {t('verifier.verificationQueue')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('verifier.priorityOrder')}
            </p>
          </div>

          <QueueFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {isLoading ? (
          <SkeletonLoader type="table" rows={4} />
        ) : (
          <VerificationQueue applications={data?.data || []} />
        )}

        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
          <span className="text-slate-400">
            {t('Showing {count} applications assigned to this desk', { count: data?.data?.length || 0 })}
          </span>
          <Link
            to="/verifier/review"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            {t('common.viewAll')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Today's Decision Breakdown Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          {t("Today's Verification Breakdown")}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {t('Approved Today')}
            </span>
            <span className="font-mono font-extrabold text-emerald-400 text-sm">{metrics.approvedToday}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              {t('Rejected Today')}
            </span>
            <span className="font-mono font-extrabold text-rose-400 text-sm">{metrics.rejectedToday}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              {t('Returned Today')}
            </span>
            <span className="font-mono font-extrabold text-amber-400 text-sm">{metrics.returnedToday}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-purple-400" />
              {t('Escalated Today')}
            </span>
            <span className="font-mono font-extrabold text-purple-400 text-sm">{metrics.escalatedToday}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
