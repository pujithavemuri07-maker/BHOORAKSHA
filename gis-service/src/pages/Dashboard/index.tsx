import { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n';
import { useGISStore } from '../../store/gisStore';
import { MetricsCards } from './MetricsCards';
import { QueueFilters } from './QueueFilters';
import { GISQueue } from './GISQueue';
import {
  MapPin,
  Layers,
  CheckCircle2,
  Sliders,
  Flag,
  XCircle,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Compass,
} from 'lucide-react';

export const Dashboard = () => {
  const { t } = useTranslation();
  const applications = useGISStore((s) => s.applications);
  const history = useGISStore((s) => s.history);
  const getStats = useGISStore((s) => s.getStats);

  const [activeFilter, setActiveFilter] = useState('all');

  const stats = useMemo(() => getStats(), [applications]);

  const counts = useMemo(() => {
    return {
      all: applications.length,
      green: applications.filter((a) => a.trafficLight === 'green').length,
      yellow: applications.filter((a) => a.trafficLight === 'yellow').length,
      red: applications.filter((a) => a.trafficLight === 'red').length,
      pending: applications.filter((a) => a.status === 'pending_gis_review').length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'pending') return app.status === 'pending_gis_review';
      if (activeFilter === 'green') return app.trafficLight === 'green';
      if (activeFilter === 'yellow') return app.trafficLight === 'yellow';
      if (activeFilter === 'red') return app.trafficLight === 'red';
      return true;
    });
  }, [applications, activeFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-cyan-950/70 border border-teal-500/30 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Cadastral Survey & Geospatial Directorate • Port 3004
              </span>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                BhooNaksha Engine v4.2
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('gis.dashboard.title', 'Parcel Boundary & Spatial Overlap Analysis')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t('gis.dashboard.subtitle', 'Verify cadastral boundaries, identify sub-meter polygon overlaps against BhooNaksha GIS, adjust boundary coordinates, or schedule DGPS field surveys.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-right">
              <div className="text-[11px] text-slate-400">{t('Total Parcel Area')}</div>
              <div className="text-lg font-bold font-mono text-teal-300">
                {stats.totalAreaAcres.toFixed(2)} {t('Ac')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards stats={stats} />

      {/* Quick Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <QueueFilters
          currentFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
        <div className="text-xs text-slate-400">
          {t('Showing {shown} of {total} parcels', { shown: filteredApplications.length, total: applications.length })}
        </div>
      </div>

      {/* Queue Preview */}
      <GISQueue applications={filteredApplications} />

      {/* Today's Activity & Audit Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{t("Today's Spatial Ratification Activity")}</span>
            </h3>
            <span className="text-xs text-slate-400">{t('Shift: 09:00 - 18:00 IST')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {t('Verified')}
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">12</div>
              <div className="text-[10px] text-slate-500">{t('Boundaries ratified')}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-cyan-400" />
                {t('Adjusted')}
              </div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1">4</div>
              <div className="text-[10px] text-slate-500">{t('Vertices corrected')}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Flag className="w-3 h-3 text-amber-400" />
                {t('Field Surveys')}
              </div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">2</div>
              <div className="text-[10px] text-slate-500">{t('Mandal teams tasked')}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <XCircle className="w-3 h-3 text-rose-400" />
                {t('Rejected')}
              </div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1">1</div>
              <div className="text-[10px] text-slate-500">{t('Encroachment alarm')}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">{t('Recent Action Log')}</div>
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-teal-400 mr-2">{item.applicationNo}</span>
                  <span className="text-slate-300">{item.remarks}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cadastral Layer Status */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{t('BhooNaksha Map Services')}</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">{t('WMS Parcel Boundaries')}</div>
                  <div className="text-[10px] text-slate-400">{t('Server: bnaksha.tg.gov.in')}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  {t('ACTIVE')}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">{t('DGPS Base Station Link')}</div>
                  <div className="text-[10px] text-slate-400">{t('Station: HYD-NORTH-04')}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  {t('SYNCED')}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">{t('Survey No. Cadastral Index')}</div>
                  <div className="text-[10px] text-slate-400">{t('32 Mandals Cached')}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
                  {t('UPDATED')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <div className="text-[11px] text-slate-400">
              {t('Spatial Reference')}: <span className="text-teal-400 font-mono font-bold">EPSG:4326 (WGS 84)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
