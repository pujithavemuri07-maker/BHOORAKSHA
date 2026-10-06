import React, { useMemo } from 'react';
import { useRevenueStore } from '../../store/revenueStore';
import { useTranslation } from '../../i18n';
import { getRegionalConfig } from '@shared/i18n';
import { MapPin, Building2, TrendingUp, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const TehsilsPage: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);
  const getTehsilStats = useRevenueStore((s) => s.getTehsilStats);
  const applications = useRevenueStore((s) => s.applications);

  const tehsilStats = useMemo(() => getTehsilStats(), [getTehsilStats, applications]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t('tehsils.title')}
          </h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {regionalConfig.districts[0]} ({regionalConfig.state})
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {t('tehsils.subtitle')}
        </p>
      </div>

      {/* Tehsil Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tehsilStats.map((tehsil, idx) => {
          const clearanceRate = tehsil.approvalRate || ((tehsil.approved / (tehsil.total || 1)) * 100).toFixed(1);
          const localizedName = regionalConfig.districts[idx % regionalConfig.districts.length] || tehsil.tehsil;

          return (
            <div
              key={tehsil.tehsil}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-5 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {localizedName}
                    </h3>
                    <p className="text-xs text-slate-400">{t('tehsils.subDivision')} {regionalConfig.districts[0]}</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                  {tehsil.total} {t('tehsils.total')}
                </span>
              </div>

              {/* Clearance Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{t('tehsils.clearanceEfficiency')}</span>
                  <span className="font-bold text-emerald-400">{clearanceRate}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${clearanceRate}%` }}
                  />
                </div>
              </div>

              {/* Statistics Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <p className="text-[10px] uppercase font-semibold text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('common.completed')}
                  </p>
                  <p className="text-lg font-mono font-bold text-white mt-1">
                    {tehsil.approved}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <p className="text-[10px] uppercase font-semibold text-amber-400 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t('common.pending')}
                  </p>
                  <p className="text-lg font-mono font-bold text-white mt-1">
                    {tehsil.pending}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <p className="text-[10px] uppercase font-semibold text-rose-400 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {t('common.rejected')}
                  </p>
                  <p className="text-lg font-mono font-bold text-white mt-1">
                    {tehsil.rejected}
                  </p>
                </div>
              </div>

              {/* Revenue Magistrate Tag */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {t('tehsils.officerInCharge')}
                </span>
                <span className="font-mono text-indigo-300">{t('tehsils.activeDuty')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TehsilsPage;

