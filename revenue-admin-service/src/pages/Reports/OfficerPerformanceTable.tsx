import React from 'react';
import { UserCheck } from 'lucide-react';

export const OfficerPerformanceTable: React.FC = () => {
  const officers = [
    {
      role: 'Data Entry Operator (DEO)',
      desk: 'OCR & Data Intake',
      officer: 'S. N. Sharma',
      processed: 142,
      accuracy: '99.2%',
      avgTime: '4.2 hrs',
      status: 'On Target',
    },
    {
      role: 'Revenue Verifier',
      desk: 'Girdawar Field Inspections',
      officer: 'K. Venkateswarlu',
      processed: 126,
      accuracy: '98.8%',
      avgTime: '8.6 hrs',
      status: 'On Target',
    },
    {
      role: 'Legal Officer',
      desk: 'Title & Encumbrance Opinion',
      officer: 'Adv. M. S. Reddy',
      processed: 98,
      accuracy: '99.5%',
      avgTime: '6.1 hrs',
      status: 'On Target',
    },
    {
      role: 'GIS Cadastral Specialist',
      desk: 'Geospatial & Boundary Verification',
      officer: 'P. Ananya',
      processed: 114,
      accuracy: '99.8%',
      avgTime: '3.8 hrs',
      status: 'Exceptional',
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Subordinate Revenue Officers &amp; Desk Performance
          </h3>
        </div>
        <span className="text-xs text-slate-400">Quarterly Administrative Audit</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3.5 font-semibold">Desk / Function</th>
              <th className="p-3.5 font-semibold">Assigned Officer</th>
              <th className="p-3.5 font-semibold">Cases Processed</th>
              <th className="p-3.5 font-semibold">Audit Accuracy</th>
              <th className="p-3.5 font-semibold">Avg Turnaround</th>
              <th className="p-3.5 font-semibold">Performance Band</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {officers.map((o) => (
              <tr key={o.role} className="hover:bg-slate-850/40 transition">
                <td className="p-3.5">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{o.role}</p>
                    <p className="text-[11px] text-slate-400">{o.desk}</p>
                  </div>
                </td>
                <td className="p-3.5 font-medium text-slate-300">{o.officer}</td>
                <td className="p-3.5 font-mono text-white font-bold">{o.processed}</td>
                <td className="p-3.5 font-mono text-emerald-400 font-bold">{o.accuracy}</td>
                <td className="p-3.5 font-mono text-slate-300">{o.avgTime}</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
