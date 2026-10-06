import React from 'react';
import { UserCheck, Shield } from 'lucide-react';

export const UserTable: React.FC = () => {
  const users = [
    { email: 'citizen@bhooraksha.gov.in', name: 'Rajesh Sharma', role: 'citizen', status: 'Active' },
    { email: 'deo@bhooraksha.gov.in', name: 'Anand Verma', role: 'deo', status: 'Active' },
    { email: 'verifier@bhooraksha.gov.in', name: 'Pooja Iyer', role: 'verifier', status: 'Active' },
    { email: 'legal@bhooraksha.gov.in', name: 'Adv. Vikram Deshmukh', role: 'legal', status: 'Active' },
    { email: 'gis@bhooraksha.gov.in', name: 'Suresh Reddy', role: 'gis', status: 'Active' },
    { email: 'revenue@bhooraksha.gov.in', name: 'Meera Nair', role: 'revenue', status: 'Active' },
    { email: 'admin@bhooraksha.gov.in', name: 'System Administrator (CCLA)', role: 'admin', status: 'Active' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span>Active Role Access & RBAC Directory (7 Service Roles)</span>
        </h3>
        <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
          {users.length} Seed Accounts
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">User Identity</th>
              <th className="py-3 px-4 font-semibold">Role Code</th>
              <th className="py-3 px-4 font-semibold">Service Port</th>
              <th className="py-3 px-4 font-semibold text-right">Access Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-slate-800/30">
                <td className="py-3 px-4">
                  <div className="font-bold text-white">{u.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                </td>
                <td className="py-3 px-4 font-mono font-bold uppercase text-indigo-400">
                  {u.role}
                </td>
                <td className="py-3 px-4 font-mono text-slate-300">
                  Port {3000 + i <= 3006 ? 3000 + i : 8000}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {u.status}
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
