import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusStat } from '../../api/types';
import { PieChart, ArrowUpRight } from 'lucide-react';

interface StatusPieChartProps {
  data?: StatusStat[];
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  const safeData = Array.isArray(data) ? data : [];
  const total = safeData.reduce((acc, curr) => acc + (curr.count || 0), 0) || 1;

  const getPathForStatus = (statusKey: string) => {
    if (statusKey === 'mutation_completed') return '/revenue/history?action=approved';
    if (statusKey.includes('approved') || statusKey.includes('completed')) return '/revenue/review?status=approved';
    if (statusKey.includes('pending')) return '/revenue/review?status=pending';
    if (statusKey.includes('rejected')) return '/revenue/review?status=rejected';
    return '/revenue/review';
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Applications by Status
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Total: <strong className="text-white">{total}</strong>
        </span>
      </div>

      {/* Segmented Bar Visualizer */}
      <div className="h-4 rounded-xl overflow-hidden flex bg-slate-800 shadow-inner">
        {safeData.map((item) => {
          const pct = ((item.count || 0) / total) * 100;
          return (
            <div
              key={item.status}
              onClick={() => navigate(getPathForStatus(item.status))}
              style={{ width: `${pct}%`, backgroundColor: item.color }}
              className="h-full transition-all hover:opacity-80 relative group cursor-pointer"
              title={`${item.label}: ${item.count} (${pct.toFixed(1)}%) - Click to filter`}
            />
          );
        })}
      </div>

      {/* Breakdown List */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {safeData.map((item) => {
          const pct = (((item.count || 0) / total) * 100).toFixed(1);
          return (
            <div
              key={item.status}
              onClick={() => navigate(getPathForStatus(item.status))}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all group"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">{pct}%</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white font-mono">
                  {item.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

