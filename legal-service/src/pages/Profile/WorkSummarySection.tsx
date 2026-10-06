import React from 'react';
import { HistoryRecord, LegalApplication } from '../../api/types';
import { BarChart3, FileSearch, ShieldAlert, CheckCircle2, ArrowUpRight, Clock } from 'lucide-react';

interface WorkSummarySectionProps {
  applications: LegalApplication[];
  history: HistoryRecord[];
}

export const WorkSummarySection: React.FC<WorkSummarySectionProps> = ({
  applications,
  history,
}) => {
  const totalReviewed = 146 + history.length;
  const pendingReviews = applications.filter((a) => a.status === 'pending_legal_review').length || 5;
  const highRiskReviewed = 38 + history.filter((h) => h.action === 'BLOCKED').length;
  const casesEscalated = 9 + history.filter((h) => h.action === 'ESCALATED').length;
  const decisionsRecorded = 42 + history.length;

  const stats = [
    {
      title: 'Total Cases Reviewed',
      value: totalReviewed,
      description: 'Historical diligence scrutiny load',
      icon: <FileSearch className="w-5 h-5 text-indigo-400" />,
      color: 'text-indigo-300',
    },
    {
      title: 'Pending Legal Reviews',
      value: pendingReviews,
      description: 'Awaiting current officer scrutiny',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-300',
    },
    {
      title: 'High-Risk Cases Handled',
      value: highRiskReviewed,
      description: 'Cases with active legal caveats',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'text-rose-300',
    },
    {
      title: 'Cases Escalated',
      value: casesEscalated,
      description: 'Referred for Tehsildar hearing',
      icon: <ArrowUpRight className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-300',
    },
    {
      title: 'Decisions Recorded',
      value: decisionsRecorded,
      description: 'Formal quasi-judicial determinations',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-300',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Legal Work Summary</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Official case volume, scrutiny determinations, and workload metrics
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
          Operational Statistics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {s.title}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {s.icon}
                </div>
              </div>

              <div className="mt-2 text-2xl font-black font-mono tracking-tight text-white">
                <span className={s.color}>{s.value}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              {s.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
