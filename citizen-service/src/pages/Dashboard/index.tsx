import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApplications, useApplicationStats } from '../../hooks/useApplications';
import { StatsCards } from './StatsCards';
import { RecentApplications } from './RecentApplications';
import { QuickActions } from './QuickActions';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { UploadCloud, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: appData, isLoading: appsLoading } = useApplications({ limit: 5 });
  const { data: statsData, isLoading: statsLoading } = useApplicationStats();

  const stats = statsData || {
    total: appData?.total || 4,
    pending: 2,
    approved: 1,
    rejected: 0,
    correctionRequired: 1,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900/50 via-slate-900 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('Digital Public Infrastructure for Land Records')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('Protect Your Land With AI Verification')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {t('Upload your Registered Sale Deed or Passbook to check for boundary overlap, court caveats, and title chain authenticity across 13 Indian languages.')}
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3">
            <Link
              to="/citizen/upload"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="w-5 h-5" />
              <span>{t('Upload Land Document')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t('Verification Metrics')}
          </h3>
          <span className="text-xs text-slate-400">{t('Updated in real-time')}</span>
        </div>
        <StatsCards stats={stats} isLoading={statsLoading} />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t('Quick Actions')}
          </h3>
          <Link
            to="/citizen/help"
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            {t('How it works')} &rarr;
          </Link>
        </div>
        <QuickActions />
      </div>

      {/* Recent Applications Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">{t('Recent Land Applications')}</h3>
            <p className="text-xs text-slate-400">
              {t('Track multi-agent verification pipeline status and review priority')}
            </p>
          </div>
          <Link
            to="/citizen/applications"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>{t('View All')} ({appData?.total || 4})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {appsLoading ? (
          <SkeletonLoader type="table" rows={4} />
        ) : (
          <RecentApplications applications={appData?.data || []} />
        )}
      </div>
    </div>
  );
};
export default Dashboard;
