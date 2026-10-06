import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';
import { useDEOStore } from '../../store/deoStore';
import { MetricsCards } from './MetricsCards';
import { PendingQueue } from './PendingQueue';
import { BulkUploadModal } from '../../components/BulkUploadModal';
import {
  UploadCloud,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  History,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const applications = useDEOStore((state) => state.applications);
  const getStats = useDEOStore((state) => state.getStats);
  const metrics = getStats();

  // Queue prioritization:
  // FIRST: Missing Documents / High Risk (< 50)
  // SECOND: Needs Attention / Medium Risk (50-74)
  // THIRD: Ready to Forward / Low Risk (>= 75)
  const sortedApplications = [...applications].sort((a, b) => {
    const getRiskRank = (score: number, status: string) => {
      if (status === 'MISSING_DOCUMENTS' || score < 50) return 3;
      if (status === 'NEEDS_ATTENTION' || (score >= 50 && score < 75)) return 2;
      return 1;
    };

    const rankA = getRiskRank(a.riskScore, a.status);
    const rankB = getRiskRank(b.riskScore, b.status);

    if (rankB !== rankA) {
      return rankB - rankA;
    }
    return a.riskScore - b.riskScore;
  });

  const filteredApplications = sortedApplications.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'ai_processed') return app.documentsDossier && app.documentsDossier.length > 0;
    if (filter === 'attention') return (app.riskScore >= 50 && app.riskScore < 75) || app.status === 'NEEDS_ATTENTION';
    if (filter === 'missing_docs') return app.riskScore < 50 || app.status === 'MISSING_DOCUMENTS';
    if (filter === 'ready') return app.riskScore >= 75 || app.status === 'READY_TO_FORWARD' || app.status === 'READY_FOR_VERIFIER';
    if (filter === 'returned') return app.status === 'CORRECTION_REQUIRED';
    if (filter === 'manual') return app.status === 'API_FAILURE_MANUAL_ENTRY' || app.govtApiStatus === 'failed';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* 1. 6 Actionable Workload Cards + Land Records API Status */}
      <MetricsCards
        metrics={metrics}
        totalApplicationsCount={applications.length}
        apiFailureCount={metrics.apiFailures}
        onFilterSelect={(f) => setFilter(f)}
        activeFilter={filter}
      />

      {/* 2. Main Dashboard Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* BULK UPLOAD Action */}
          <Link
            to="/deo/manual-entry/bulk-upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-2xl font-bold text-xs shadow-lg shadow-amber-600/30 transition-all hover:scale-105"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t('deoDashboard.bulkUpload')}</span>
          </Link>

          {/* NEEDS DEO REVIEW Action */}
          <button
            type="button"
            onClick={() => setFilter('attention')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              filter === 'attention'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{t('deoDashboard.needsDeoReview')}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
              {metrics.needsAttention}
            </span>
          </button>

          {/* REVIEW QUEUE Link */}
          <Link
            to="/deo/review"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl font-bold text-xs transition-all"
          >
            <ListChecks className="w-4 h-4 text-slate-400" />
            <span>{t('deoDashboard.reviewQueue')}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-700 text-[10px] font-mono">
              {applications.length}
            </span>
          </Link>

          {/* READY TO FORWARD Action */}
          <button
            type="button"
            onClick={() => setFilter('ready')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              filter === 'ready'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('deoDashboard.readyToForward')}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              {metrics.readyToForward}
            </span>
          </button>

          {/* HISTORY Link */}
          <Link
            to="/deo/history"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 rounded-2xl font-bold text-xs transition-all"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>{t('deoDashboard.history')}</span>
          </Link>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t('deoDashboard.aiExtractsData')}</span>
        </div>
      </div>

      {/* 3. Statutory Classification Rules Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {t('deoDashboard.statutoryClassification')}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {t('deoDashboard.orderMissingDocs')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* 75-100 */}
          <div
            onClick={() => setFilter('ready')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              filter === 'ready'
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-black text-emerald-400 text-sm">75–100</span>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                {t('deoDashboard.lowRisk')}
              </span>
            </div>
            <p className="font-bold text-white text-xs">{t('deoDashboard.readyToForward')}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('deoDashboard.zeroExceptions')}
            </p>
          </div>

          {/* 50-74 */}
          <div
            onClick={() => setFilter('attention')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              filter === 'attention'
                ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-black text-amber-400 text-sm">50–74</span>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                {t('deoDashboard.mediumRisk')}
              </span>
            </div>
            <p className="font-bold text-white text-xs">{t('deoDashboard.needsDeoReview')}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('deoDashboard.spellingDateVariation')}
            </p>
          </div>

          {/* 0-49 */}
          <div
            onClick={() => setFilter('missing_docs')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              filter === 'missing_docs'
                ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-black text-rose-400 text-sm">0–49</span>
              <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
                {t('deoDashboard.highRisk')}
              </span>
            </div>
            <p className="font-bold text-white text-xs">{t('deoDashboard.missingDocuments')}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('deoDashboard.requiredDeedMissing')}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Prioritized {t('deoDashboard.deoWorkloadQueue')} Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {t('deoDashboard.deoWorkloadQueue')}
              </h3>
              <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {filter === 'all'
                  ? t('deoDashboard.allApplications')
                  : filter === 'ai_processed'
                  ? t('deoDashboard.aiProcessed')
                  : filter === 'attention'
                  ? t('deoDashboard.needsDeoReview')
                  : filter === 'missing_docs'
                  ? t('deoDashboard.missingDocuments')
                  : filter === 'ready'
                  ? t('deoDashboard.readyToForward')
                  : filter === 'returned'
                  ? t('deoDashboard.returnedForCorrection')
                  : t('deoDashboard.apiFallback')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Focus on exceptions first: check pre-filled AI values against source document, correct only discrepancies, and forward.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  filter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('missing_docs')}
                className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  filter === 'missing_docs'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <FileQuestion className="w-3.5 h-3.5" />
                Missing Docs ({metrics.missingDocuments})
              </button>
              <button
                type="button"
                onClick={() => setFilter('attention')}
                className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  filter === 'attention'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Needs Review ({metrics.needsAttention})
              </button>
              <button
                type="button"
                onClick={() => setFilter('ready')}
                className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  filter === 'ready'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready ({metrics.readyToForward})
              </button>
              <button
                type="button"
                onClick={() => setFilter('returned')}
                className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  filter === 'returned'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Returned ({ (metrics as any).returnedForCorrection || 1 })
              </button>
            </div>

            <Link
              to="/deo/review"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors ml-2"
            >
              <span>{t('common.viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <PendingQueue applications={filteredApplications} />
      </div>

      {/* 5. Shift Processing Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t('deoDashboard.shiftActivity')}
              </h3>
              <p className="text-[11px] text-slate-400">{t('deoDashboard.liveSummary')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">{t('deoDashboard.forwardedVerifier')}</span>
              <span className="font-bold text-emerald-400 text-sm">{metrics.sentToVerifier} {t('deoDashboard.applications')}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">{t('deoDashboard.exceptionsCorrected')}</span>
              <span className="font-bold text-blue-400 text-sm">{metrics.reviewedToday} {t('deoDashboard.dossiers')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
      />
    </div>
  );
}
