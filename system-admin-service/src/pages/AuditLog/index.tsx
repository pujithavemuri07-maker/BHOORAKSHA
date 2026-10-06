import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  FileDown,
  ShieldCheck,
  Clock,
  Key,
  Calendar,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useTranslation } from '../../i18n';
import { AuditLogEntry } from '../../api/types';
import { AuditDetailModal } from '../../components/Modals/AuditDetailModal';
import toast from 'react-hot-toast';

export const AuditLogPage: React.FC = () => {
  const { t } = useTranslation();
  const { auditLogs } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.sha256Hash.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || log.userRole === selectedRole;
      const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
      return matchesSearch && matchesRole && matchesStatus && matchesCategory;
    });
  }, [auditLogs, searchQuery, selectedRole, selectedStatus, selectedCategory]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Timestamp,Actor,Role,Action,Category,Status,Details,SHA256\n' +
      filteredLogs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.category}","${l.status}","${l.details.replace(/"/g, '""')}","${l.sha256Hash}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhooraksha_audit_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredLogs.length} audit records.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/40 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Statutory Cryptographic Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {t('admin.auditLog')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Immutable, append-only audit trail recording every deed ratification, mutation trigger, boundary adjustment, and administrative intervention.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <FileDown className="w-4 h-4" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by action, officer, keyword, or SHA-256 hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">System Admin</option>
          <option value="revenue">Tahsildar</option>
          <option value="legal">Legal Officer</option>
          <option value="gis">GIS Specialist</option>
          <option value="verifier">Verifier</option>
          <option value="deo">DEO</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          <option value="application">Application / Deed</option>
          <option value="security">Security & Policies</option>
          <option value="auth">Authentication & RBAC</option>
          <option value="system">System & Infra</option>
          <option value="ai">AI Pipeline</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Outcomes</option>
          <option value="success">Success</option>
          <option value="warning">Warning / Flagged</option>
          <option value="failure">Failure / Blocked</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/40">
                <th className="py-3 px-3 font-semibold">Audit ID & Time</th>
                <th className="py-3 px-3 font-semibold">Actor / Officer</th>
                <th className="py-3 px-3 font-semibold">Role</th>
                <th className="py-3 px-3 font-semibold">Action & Details</th>
                <th className="py-3 px-3 font-semibold">SHA-256 Digest</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white font-mono">{log.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-200">{log.userName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.ipAddress}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {log.userRole}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-300">
                    <div className="font-semibold text-white">{log.action}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-sm">{log.details}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 max-w-[130px] truncate block">
                      {log.sha256Hash}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold transition-colors"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};
