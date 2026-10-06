import React from 'react';
import { X, ShieldCheck, Clock, User, HardDrive, Key, AlertTriangle } from 'lucide-react';
import { AuditLogEntry } from '../../api/types';

interface AuditDetailModalProps {
  log: AuditLogEntry | null;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">Audit Record {log.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    log.status === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : log.status === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {log.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">Cryptographically sealed tamper-proof log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Timestamp</span>
              </div>
              <div className="font-mono text-slate-200">{new Date(log.timestamp).toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Initiator / Actor</span>
              </div>
              <div className="font-semibold text-slate-200">{log.userName}</div>
              <div className="text-[10px] text-indigo-400 font-mono uppercase">{log.userRole} ({log.userId})</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                <span>Source IP Address</span>
              </div>
              <div className="font-mono text-slate-200">{log.ipAddress}</div>
            </div>
          </div>

          {/* Action & Resource Details */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Statutory Action Executed
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
              <div className="font-mono font-bold text-indigo-400 mb-1">{log.action}</div>
              <div className="text-slate-300 leading-relaxed">{log.details}</div>
              {log.resourceId && (
                <div className="mt-2 text-[11px] text-slate-400">
                  Target Entity / Resource: <span className="font-mono text-white">{log.resourceId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Value Changes (Previous vs New) */}
          {(log.previousValue || log.newValue) && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                State Transition Difference
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {log.previousValue && (
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
                    <span className="font-bold text-rose-400 block mb-1">Previous State</span>
                    <pre className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap">
                      {log.previousValue}
                    </pre>
                  </div>
                )}
                {log.newValue && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <span className="font-bold text-emerald-400 block mb-1">Committed State</span>
                    <pre className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap">
                      {log.newValue}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statutory Reason */}
          {log.reason && (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recorded Justification
              </span>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 italic">
                "{log.reason}"
              </div>
            </div>
          )}

          {/* Cryptographic Hash Verification */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
              <Key className="w-4 h-4" />
              <span>Immutable Ledger SHA-256 Digest</span>
            </div>
            <div className="font-mono text-[11px] text-slate-300 break-all bg-slate-950/80 p-2 rounded-lg border border-slate-800">
              {log.sha256Hash}
            </div>
            <p className="text-[10px] text-slate-400">
              This signature is anchored to the state revenue block-ledger and cannot be retroactively modified or purged.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
