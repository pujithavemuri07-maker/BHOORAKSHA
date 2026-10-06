import React from 'react';
import { TrendingUp } from 'lucide-react';

export const MonthlyTrendChart: React.FC = () => {
  const months = [
    { month: 'Oct 2025', approved: 78, rejected: 4, mutationRate: 95 },
    { month: 'Nov 2025', approved: 86, rejected: 5, mutationRate: 96 },
    { month: 'Dec 2025', approved: 94, rejected: 3, mutationRate: 98 },
    { month: 'Jan 2026', approved: 104, rejected: 6, mutationRate: 97 },
    { month: 'Feb 2026', approved: 112, rejected: 5, mutationRate: 98 },
    { month: 'Mar 2026 (MTD)', approved: 118, rejected: 4, mutationRate: 99 },
  ];

  const maxVal = 130;

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            6-Month Adjudication &amp; Mutation Trajectory
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          +24.2% Mutation Throughput
        </span>
      </div>

      {/* Bar Chart Visualization */}
      <div className="pt-4 grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 border-b border-slate-800 pb-2">
        {months.map((m) => {
          const approvedHeight = (m.approved / maxVal) * 100;
          const rejectedHeight = (m.rejected / maxVal) * 100;

          return (
            <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {m.approved}
              </span>
              <div className="w-full max-w-[36px] flex flex-col items-center gap-0.5 justify-end h-full">
                <div
                  style={{ height: `${rejectedHeight}%` }}
                  className="w-full bg-rose-500/80 rounded-t-sm"
                  title={`Rejected: ${m.rejected}`}
                />
                <div
                  style={{ height: `${approvedHeight}%` }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-emerald-500 rounded-t-md transition-all group-hover:brightness-110 shadow-lg shadow-indigo-500/10"
                  title={`Approved & Mutated: ${m.approved}`}
                />
              </div>
              <span className="text-[11px] text-slate-400 truncate w-full text-center">
                {m.month.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-indigo-600 to-emerald-500" />
          <span>Approved &amp; Mutation Packets Prepared</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-rose-500" />
          <span>Final Rejected</span>
        </div>
      </div>
    </div>
  );
};
