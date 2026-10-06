import React from 'react';
import { AuditLogEntry } from '../../api/types';
import { History, Shield, User, Bot, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../i18n';

interface AuditHistoryProps {
  auditLog: AuditLogEntry[];
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({ auditLog }) => {
  const { t } = useTranslation();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'AI_AGENT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'DEO':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'VERIFIER':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'REVENUE_ADMIN':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            {t('Tamper-Evident Audit Ledger')}
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-500">{t('Immutable Ledger')}</span>
      </div>

      <div className="space-y-4">
        {auditLog.map((entry, index) => (
          <div
            key={entry.id || index}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                {entry.role === 'AI_AGENT' ? (
                  <Bot className="w-4 h-4 text-blue-400" />
                ) : (
                  <User className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-white">{entry.actor}</span>
                  <span
                    className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                      getRoleBadge(entry.role)
                    )}
                  >
                    {entry.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 font-medium">{entry.action}</p>
                {entry.remarks && (
                  <p className="text-xs text-slate-400 mt-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 italic">
                    "{entry.remarks}"
                  </p>
                )}
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
              {new Date(entry.timestamp).toLocaleString('en-IN', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
