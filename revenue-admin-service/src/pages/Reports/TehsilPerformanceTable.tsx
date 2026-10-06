import React from 'react';
import { TehsilStat } from '../../api/types';
import { Building2 } from 'lucide-react';

interface TehsilPerformanceTableProps {
  tehsils: TehsilStat[];
}

export const TehsilPerformanceTable: React.FC<TehsilPerformanceTableProps> = ({
  tehsils = [],
}) => {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Mandal / Tehsil Revenue SLA &amp; Clearance Rates
          </h3>
        </div>
        <span className="text-xs text-slate-400">Target SLA: &lt; 48 Hours</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3.5 font-semibold">Tehsil Name</th>
              <th className="p-3.5 font-semibold">Total Cases</th>
              <th className="p-3.5 font-semibold">Approved</th>
              <th className="p-3.5 font-semibold">Pending</th>
              <th className="p-3.5 font-semibold">Rejected</th>
              <th className="p-3.5 font-semibold">Clearance Rate</th>
              <th className="p-3.5 font-semibold">Avg SLA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tehsils.map((t) => {
              const rate = t.approvalRate || ((t.approved / (t.total || 1)) * 100).toFixed(1);
              return (
                <tr key={t.tehsil} className="hover:bg-slate-850/40 transition">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    {t.tehsil}
                  </td>
                  <td className="p-3.5 font-mono text-slate-300 font-semibold">
                    {t.total}
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 font-bold">
                    {t.approved}
                  </td>
                  <td className="p-3.5 font-mono text-amber-400 font-bold">
                    {t.pending}
                  </td>
                  <td className="p-3.5 font-mono text-rose-400 font-bold">
                    {t.rejected}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-300">
                        {rate}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                      {t.avgProcessingHours ? `${t.avgProcessingHours} hrs` : '18.4 hrs'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
