import React from 'react';
import { Shield, Check, X, ShieldAlert, AlertCircle } from 'lucide-react';

export const DecisionAuthoritySection: React.FC = () => {
  const permissions = [
    { name: 'Legal Case Review & Scrutiny', allowed: true, category: 'Core Review' },
    { name: 'Review AI Findings & Risk Flags', allowed: true, category: 'Core Review' },
    { name: 'Verify Legal Evidence & Deeds', allowed: true, category: 'Core Review' },
    { name: 'Request Document Correction / Notice', allowed: true, category: 'Action' },
    { name: 'Place Statutory Legal Hold / Block', allowed: true, category: 'Action' },
    { name: 'Escalate Case to Tehsildar / RDO', allowed: true, category: 'Action' },
    { name: 'Record Final Quasi-Judicial Decision', allowed: true, category: 'Determination' },
    { name: 'View & Search Audit History Ledger', allowed: true, category: 'Audit' },
    { name: 'Modify Citizen Application Records Directly', allowed: false, category: 'Security Boundary' },
    { name: 'Modify Master Government Land Records Directly', allowed: false, category: 'Security Boundary' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Decision & Authorization</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configured role-based system permissions and operational authorization boundaries
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold">
          Role: Legal Officer
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
        {permissions.map((p, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
              p.allowed
                ? 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                : 'bg-rose-950/15 border-rose-500/20 text-rose-300/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`p-1 rounded-md ${
                  p.allowed
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-rose-500/15 text-rose-400'
                }`}
              >
                {p.allowed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              </span>
              <span className="font-semibold">{p.name}</span>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                p.allowed
                  ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/30'
                  : 'bg-rose-950/50 text-rose-400 border border-rose-800/30'
              }`}
            >
              {p.allowed ? 'YES (Authorized)' : 'NO (Restricted)'}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-500 italic">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Permissions reflect configured system security roles in Bhooraksha; master revenue record modifications are restricted to authorized Revenue Divisional Officers.</span>
      </div>
    </div>
  );
};
