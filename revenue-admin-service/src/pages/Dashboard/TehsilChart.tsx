import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TehsilStat } from '../../api/types';
import { Building2, TrendingUp, ArrowUpRight } from 'lucide-react';

interface TehsilChartProps {
  data?: TehsilStat[];
}

export const TehsilChart: React.FC<TehsilChartProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  const safeData = Array.isArray(data) ? data : [];
  const maxTotal = Math.max(...safeData.map((d) => d.total || 0), 1);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Applications by Tehsil / Mandal
          </h3>
        </div>
        <button
          onClick={() => navigate('/revenue/tehsils')}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all cursor-pointer"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Workload</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3.5 pt-2">
        {safeData.map((tehsil) => {
          const total = tehsil.total || 1;
          const approvedPct = ((tehsil.approved || 0) / total) * 100;
          const pendingPct = ((tehsil.pending || 0) / total) * 100;
          const rejectedPct = ((tehsil.rejected || 0) / total) * 100;
          const barWidth = (total / maxTotal) * 100;

          return (
            <div
              key={tehsil.tehsil}
              onClick={() => navigate(`/revenue/review?tehsil=${encodeURIComponent(tehsil.tehsil)}`)}
              className="space-y-1.5 cursor-pointer group p-1.5 rounded-xl hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                  {tehsil.tehsil}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                </span>
                <span className="text-slate-400 font-mono">
                  <span className="text-emerald-400">{tehsil.approved} Appr</span> •{' '}
                  <span className="text-amber-400">{tehsil.pending} Pend</span> •{' '}
                  <span className="text-rose-400">{tehsil.rejected} Rej</span> (
                  <strong className="text-white">{tehsil.total}</strong> total)
                </span>
              </div>

              {/* Progress bar container */}
              <div
                className="h-3 rounded-full bg-slate-800/80 overflow-hidden flex transition-all duration-500"
                style={{ width: `${Math.max(barWidth, 15)}%` }}
              >
                <div
                  style={{ width: `${approvedPct}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`Approved: ${tehsil.approved}`}
                />
                <div
                  style={{ width: `${pendingPct}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`Pending: ${tehsil.pending}`}
                />
                <div
                  style={{ width: `${rejectedPct}%` }}
                  className="bg-rose-500 h-full transition-all"
                  title={`Rejected: ${tehsil.rejected}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Pending Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Rejected</span>
        </div>
      </div>
    </div>
  );
};

