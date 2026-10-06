import React from 'react';
import { ShieldCheck, User } from 'lucide-react';

export const AuditLogTable: React.FC = () => {
  const logs = [
    { time: '14:22:10', user: 'meera.nair@bhooraksha.gov.in', action: 'MUTATION_SANCTION', entity: 'Application #BR-2026-KA-09412', ip: '10.0.4.18' },
    { time: '14:15:02', user: 'suresh.reddy@bhooraksha.gov.in', action: 'GIS_OVERLAP_RESOLVED', entity: 'Parcel #142/2A', ip: '10.0.4.22' },
    { time: '13:50:44', user: 'pooja.iyer@bhooraksha.gov.in', action: 'CHECKER_VERIFIED', entity: 'Application #BR-2026-TS-04721', ip: '10.0.3.11' },
    { time: '12:30:19', user: 'anand.verma@bhooraksha.gov.in', action: 'MAKER_TRANSCRIPTION_SAVED', entity: 'Application #BR-2026-MH-08194', ip: '10.0.2.8' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Immutable Cryptographic Audit Trail (SHA-256)</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">Live Event Stream</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Officer Identity</th>
              <th className="py-3 px-4 font-semibold">Action Executed</th>
              <th className="py-3 px-4 font-semibold">Target Entity</th>
              <th className="py-3 px-4 font-semibold text-right">IP Origin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {logs.map((l, i) => (
              <tr key={i} className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-400">{l.time}</td>
                <td className="py-3 px-4 text-white font-sans">{l.user}</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{l.action}</td>
                <td className="py-3 px-4 text-slate-300 font-sans">{l.entity}</td>
                <td className="py-3 px-4 text-right text-slate-400">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
