import React, { useState } from 'react';
import {
  Server,
  Activity,
  HardDrive,
  RefreshCw,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';

export const SystemMonitorPage: React.FC = () => {
  const { t } = useTranslation();
  const { services, metrics, queues, restartService } = useAdminStore();
  const [restartingId, setRestartingId] = useState<string | null>(null);

  const handleRestart = async (id: string, name: string) => {
    setRestartingId(id);
    toast.loading(`Gracefully reloading service: ${name}...`, { id: 'restart' });
    await restartService(id);
    toast.success(`Service ${name} rebooted and telemetry normalized.`, { id: 'restart' });
    setRestartingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/40 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            CCLA Infrastructure Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {t('admin.systemMonitor')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Live health verification, response latencies, container replica counts, and distributed task broker pipelines across all 11 Bhooraksha microservices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">Ingress Throughput</span>
            <span className="text-base font-bold text-white font-mono">{metrics.requestsPerMinute} req/min</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">Error Budget</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{metrics.errorRatePercent}% err</span>
          </div>
        </div>
      </div>

      {/* 11 Microservices Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>{t('admin.serviceFleet')}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {services.filter((s) => s.status === 'healthy').length} / {services.length} Healthy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white">{srv.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        Port {srv.port}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{srv.version}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      srv.status === 'healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        srv.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {srv.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                  <div>
                    Latency: <span className="font-bold text-white font-mono">{srv.latencyMs}ms</span>
                  </div>
                  <div>
                    Uptime: <span className="font-bold text-emerald-400 font-mono">{srv.uptimePercent}%</span>
                  </div>
                  <div className="text-right">
                    Replicas: <span className="font-bold text-indigo-400 font-mono">{srv.replicaCount}</span>
                  </div>
                </div>

                {/* CPU / Memory Bars */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>CPU: {srv.cpuPercent}%</span>
                    <span>MEM: {srv.memPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                    <div
                      style={{ width: `${srv.cpuPercent}%` }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Heartbeat: {new Date(srv.lastHeartbeat).toLocaleTimeString()}
                  </span>
                  <button
                    disabled={restartingId === srv.id}
                    onClick={() => handleRestart(srv.id, srv.name)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 text-indigo-400 ${restartingId === srv.id ? 'animate-spin' : ''}`} />
                    <span>Reboot</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Queues & API Performance Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Celery & Redis Queues */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{t('admin.queueTelemetry')}</span>
            </h3>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">
              Celery / Redis / DLQ
            </span>
          </div>

          <div className="space-y-3">
            {queues.map((q) => (
              <div key={q.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white text-xs">{q.name}</div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      q.status === 'normal'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {q.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-400">
                  <div>Pending: <span className="font-bold text-white font-mono">{q.pendingTasks}</span></div>
                  <div>In Flight: <span className="font-bold text-indigo-400 font-mono">{q.processingTasks}</span></div>
                  <div>Failed: <span className="font-bold text-rose-400 font-mono">{q.failedTasks}</span></div>
                  <div className="text-right">Speed: <span className="font-bold text-emerald-400 font-mono">{q.throughputPerMin} /min</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latency Percentiles & Gateway Budgets */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{t('admin.apiTelemetry')}</span>
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
              P99 &lt; 150ms Target
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300">P50 Median Latency</span>
                <p className="text-[11px] text-slate-500">Typical response time for internal state RPCs</p>
              </div>
              <span className="text-lg font-mono font-black text-emerald-400">{metrics.p50Latency} ms</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300">P95 Tail Latency</span>
                <p className="text-[11px] text-slate-500">Complex deed vector query and OCR inferences</p>
              </div>
              <span className="text-lg font-mono font-black text-indigo-400">{metrics.p95Latency} ms</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300">P99 Worst Case Latency</span>
                <p className="text-[11px] text-slate-500">Heavy PostGIS polygon intersection checks</p>
              </div>
              <span className="text-lg font-mono font-black text-purple-400">{metrics.p99Latency} ms</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300">Global Error Rate</span>
                <p className="text-[11px] text-slate-500">HTTP 5xx server exceptions</p>
              </div>
              <span className="text-lg font-mono font-black text-emerald-400">{metrics.errorRatePercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
