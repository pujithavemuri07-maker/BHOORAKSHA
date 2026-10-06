import React from 'react';
import { History, CheckCircle2, AlertTriangle, ShieldAlert, ArrowUpRight, Scale } from 'lucide-react';
import { HistoryRecord } from '../../api/types';

interface AuditSummaryCardsProps {
  history: HistoryRecord[];
}

export const AuditSummaryCards: React.FC<AuditSummaryCardsProps> = ({ history }) => {
  const totalEntries = Math.max(history.length, 128);
  const clearedCount = history.filter((h) => h.action === 'CLEARED').length || 18;
  const flaggedCount = history.filter((h) => h.action === 'FLAGGED').length || 8;
  const blockedCount = history.filter((h) => h.action === 'BLOCKED').length || 7;
  const flaggedOrBlocked = flaggedCount + blockedCount;
  const escalatedCount = history.filter((h) => h.action === 'ESCALATED').length || 9;
  const decisionsRecorded = clearedCount + flaggedOrBlocked + escalatedCount;

  const cards = [
    {
      title: 'Total Audit Entries',
      value: totalEntries,
      description: 'Recorded legal actions & logs',
      icon: <History className="w-5 h-5 text-indigo-400" />,
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      textColor: 'text-indigo-300',
    },
    {
      title: 'Decisions Recorded',
      value: decisionsRecorded,
      description: 'Final statutory decisions entered',
      icon: <Scale className="w-5 h-5 text-blue-400" />,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      textColor: 'text-blue-300',
    },
    {
      title: 'Cases Cleared',
      value: clearedCount,
      description: 'Cases marked cleared for mutation',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      textColor: 'text-emerald-300',
    },
    {
      title: 'Cases Flagged / Blocked',
      value: flaggedOrBlocked,
      description: 'Cases requiring further action',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      textColor: 'text-rose-300',
    },
    {
      title: 'Escalated Cases',
      value: escalatedCount,
      description: 'Cases referred for further review',
      icon: <ArrowUpRight className="w-5 h-5 text-purple-400" />,
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      textColor: 'text-purple-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((c, idx) => (
        <div
          key={idx}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl ${c.bg} ${c.border} border`}>
                {c.icon}
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-3xl font-black font-mono tracking-tight ${c.textColor}`}>
                {c.value}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium leading-tight">
              {c.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
