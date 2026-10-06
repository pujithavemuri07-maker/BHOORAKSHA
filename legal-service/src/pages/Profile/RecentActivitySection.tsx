import React from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, ArrowUpRight, Clock } from 'lucide-react';
import { HistoryRecord } from '../../api/types';
import { formatDateTime } from '../../utils/formatters';

interface RecentActivitySectionProps {
  history: HistoryRecord[];
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ history }) => {
  const activities = [
    {
      caseId: 'LEG-2026-602',
      party: 'B. Venkatswamy Goud',
      actionTitle: 'Reviewed partition deed and active civil litigation caveat',
      timeText: 'Today, 10:05 AM',
      actionType: 'Review',
      badge: 'Active Scrutiny',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    },
    {
      caseId: 'LEG-2026-590',
      party: 'Prashant K. Rao',
      actionTitle: 'Recorded statutory legal block order under Sec 52 Lis Pendens',
      timeText: 'Today, 09:50 AM',
      actionType: 'Decision',
      badge: 'Blocked',
      badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    },
    {
      caseId: 'LEG-2026-591',
      party: 'K. Someshwar Rao',
      actionTitle: 'Escalated multi-party testamentary dispute to Tehsildar',
      timeText: 'Yesterday, 05:35 PM',
      actionType: 'Escalation',
      badge: 'Escalated',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    },
    {
      caseId: 'LEG-2026-588',
      party: 'G. Harish Kumar',
      actionTitle: 'Sanctioned clear title following Gazetted name verification',
      timeText: 'Yesterday, 11:45 AM',
      actionType: 'Decision',
      badge: 'Cleared',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Recent Official Activity</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological ledger of recent legal reviews, determinations, and case interactions
            </p>
          </div>
        </div>

        <Link
          to="/legal/history"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>View Full Audit Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5 pt-1">
        {activities.map((act, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-300 text-xs">
                  {act.caseId}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-semibold text-white">{act.party}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${act.badgeColor}`}>
                  {act.badge}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {act.actionTitle}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
              <span className="text-[11px] font-mono text-slate-400">
                {act.timeText}
              </span>
              <Link
                to={`/legal/review/${act.caseId}`}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Open Case"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
