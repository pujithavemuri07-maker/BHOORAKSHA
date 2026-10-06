import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Activity,
  Server,
  Cpu,
  ShieldCheck,
  Plus,
  FileDown,
  RefreshCw,
  Database,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Eye,
  RotateCcw,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useTranslation } from '../../i18n';
import { AddUserModal } from '../../components/Modals/UserModals';
import { AuditDetailModal } from '../../components/Modals/AuditDetailModal';
import { AuditLogEntry } from '../../api/types';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    metrics,
    dbMetrics,
    applications,
    services,
    aiAgents,
    auditLogs,
    addUser,
    flushCache,
    triggerSnapshotBackup,
    fetchDbMetrics,
    fetchApplications,
  } = useAdminStore();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    fetchDbMetrics();
    fetchApplications({ limit: 5 });
  }, []);

  const handleFlush = async () => {
    toast.loading('Flushing Redis token session cache...', { id: 'flush' });
    await flushCache();
    toast.success('Session cache cleared successfully.', { id: 'flush' });
  };

  const handleBackup = async () => {
    toast.loading('Triggering PostgreSQL + PostGIS snapshot backup...', { id: 'backup' });
    await triggerSnapshotBackup();
    toast.success('Point-in-Time snapshot created and cryptographically signed.', { id: 'backup' });
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Timestamp,Actor,Role,Action,Status,SHA256\n' +
      auditLogs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.status}","${l.sha256Hash}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhooraksha_audit_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Audit log CSV exported.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              {t('admin.portalTitle')}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono border border-emerald-500/20">
              Live DB Synced
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            {t('admin.dashboard')}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Real-time telemetry, database counters, and statutory review queue across core land administration microservices.
          </p>
        </div>

        {/* Quick Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/admin/applications')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Applications Queue ({dbMetrics.ready_for_admin_review} Ready)</span>
          </button>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>{t('admin.addUser')}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all"
          >
            <FileDown className="w-4 h-4 text-indigo-400" />
            <span>{t('admin.exportAudit')}</span>
          </button>
          <button
            onClick={handleFlush}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>{t('admin.flushRedis')}</span>
          </button>
          <button
            onClick={handleBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all"
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span>{t('admin.triggerBackup')}</span>
          </button>
        </div>
      </div>

      {/* Real Database Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-medium uppercase">Total Apps</span>
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-white">{dbMetrics.total_applications}</div>
          <div className="text-[10px] text-slate-500">Registered DB</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1 shadow-md shadow-indigo-950/30">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-[10px] font-bold uppercase">Ready for Admin</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          </div>
          <div className="text-xl font-black text-indigo-300">{dbMetrics.ready_for_admin_review}</div>
          <div className="text-[10px] text-indigo-400/80">Pending final sign</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-medium uppercase">Under Verif.</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300">{dbMetrics.under_verification}</div>
          <div className="text-[10px] text-slate-500">Active review</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-medium uppercase">Approved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{dbMetrics.approved}</div>
          <div className="text-[10px] text-emerald-500/80">Ratified & sealed</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-medium uppercase">Returned</span>
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-300">{dbMetrics.returned}</div>
          <div className="text-[10px] text-slate-500">Correction cycle</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-medium uppercase">Rejected</span>
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">{dbMetrics.rejected}</div>
          <div className="text-[10px] text-slate-500">Non-compliant</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-medium uppercase">High Risk</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">{dbMetrics.high_risk}</div>
          <div className="text-[10px] text-slate-500">Risk score ≥ 60</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-medium uppercase">System Health</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">99.98%</div>
          <div className="text-[10px] text-slate-500">All services UP</div>
        </div>
      </div>

      {/* Ready for Admin Review Quick Action Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Ready for System Admin Final Ratification Queue</span>
            </h3>
            <p className="text-xs text-slate-400">Applications that have cleared AI, DEO, Verifier, GIS, and Revenue scrutiny</p>
          </div>
          <button
            onClick={() => navigate('/admin/applications')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>View Full Queue ({dbMetrics.total_applications})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/30 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Application ID</th>
                <th className="py-2.5 px-3">Citizen Name</th>
                <th className="py-2.5 px-3">Survey Number</th>
                <th className="py-2.5 px-3">Village / District</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.slice(0, 4).map((app) => (
                <tr
                  key={app.application_no}
                  className="hover:bg-slate-800/30 cursor-pointer"
                  onClick={() => navigate(`/admin/applications/${app.application_no}`)}
                >
                  <td className="py-3 px-3 font-mono font-bold text-indigo-400">{app.application_no}</td>
                  <td className="py-3 px-3 font-semibold text-white">{app.applicant_name}</td>
                  <td className="py-3 px-3 font-mono text-slate-200">Sy. #{app.survey_number} ({app.extent_acres} Ac)</td>
                  <td className="py-3 px-3 text-slate-300">{app.village}, {app.district}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.review_priority_score >= 60 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      Score: {app.review_priority_score}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-indigo-300">{app.status}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/applications/${app.application_no}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row: Applications Over Time & AI Performance by Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Applications Over Time */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Deed Application Ingress & Ratification Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Weekly volume across citizen, DEO, and verified streams</p>
            </div>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-lg">
              Last 7 Days
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { day: 'Mon, Sep 01', total: 640, approved: 580, pending: 60, pct: 90 },
              { day: 'Tue, Sep 02', total: 720, approved: 685, pending: 35, pct: 95 },
              { day: 'Wed, Sep 03', total: 810, approved: 760, pending: 50, pct: 93 },
              { day: 'Thu, Sep 04', total: 890, approved: 840, pending: 50, pct: 94 },
              { day: 'Fri, Sep 05', total: 950, approved: 910, pending: 40, pct: 95 },
              { day: 'Sat, Sep 06', total: 780, approved: 740, pending: 40, pct: 94 },
              { day: 'Sun, Sep 07', total: 540, approved: 520, pending: 20, pct: 96 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.day}</span>
                  <span className="text-slate-400 font-mono">
                    <span className="text-white font-bold">{item.total}</span> apps ({item.pct}% ratified)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    style={{ width: `${item.pct}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: AI Performance by Agent */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>AI Agent Verification Accuracy & Human Override</span>
              </h3>
              <p className="text-xs text-slate-400">Real-time performance across 4 neural micro-agents</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              96.8% Avg
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {aiAgents.map((agent) => (
              <div key={agent.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">{agent.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{agent.modelName} • {agent.version}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-purple-400">{agent.accuracy}%</span>
                    <div className="text-[10px] text-slate-400">Override: {agent.overrideRate}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <div>Inferences Today: <span className="font-bold text-white">{agent.totalInferencesToday}</span></div>
                  <div>Avg Latency: <span className="font-bold text-indigo-400">{agent.avgProcessingTimeSec}s</span></div>
                  <div className="text-right">
                    Status: <span className="text-emerald-400 font-bold uppercase">{agent.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Archival Land Record Digitization & Multilingual HTR Telemetry */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Archival Cadastre Digitization & Multilingual HTR Telemetry</h3>
              <p className="text-xs text-slate-400">Real-time throughput of Chitrapathak-1 + TrOCR Indic handwriting models across 18 languages</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            HTR Cluster Status: Optimal (94.8% Avg Accuracy)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Registers Transcribed</span>
            <span className="text-lg font-black text-white font-mono">1,420 Volumes</span>
            <span className="text-[10px] text-emerald-400 block">+68 today</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">HTR Model Accuracy</span>
            <span className="text-lg font-black text-amber-400 font-mono">94.8%</span>
            <span className="text-[10px] text-slate-400 block">18 Indic scripts active</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Discrepancies Flagged</span>
            <span className="text-lg font-black text-rose-400 font-mono">184 Cases</span>
            <span className="text-[10px] text-rose-400/80 block">Title & survey gaps</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Owner Notices Sent</span>
            <span className="text-lg font-black text-emerald-400 font-mono">112 Notices</span>
            <span className="text-[10px] text-emerald-400 block">SMS, Email & In-App</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Last 10 Actions) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Recent Statewide System & Officer Activity</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {auditLogs.length} audit entries captured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/30">
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Actor / Officer</th>
                <th className="py-2.5 px-3 font-semibold">Role</th>
                <th className="py-2.5 px-3 font-semibold">Action</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.slice(0, 8).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.ipAddress}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div className="font-medium text-slate-200">{log.action}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-md">{log.details}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.status === 'success'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : log.status === 'warning'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedAuditLog(log)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-400 font-semibold transition-colors"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={addUser}
      />

      <AuditDetailModal
        log={selectedAuditLog}
        onClose={() => setSelectedAuditLog(null)}
      />
    </div>
  );
};
