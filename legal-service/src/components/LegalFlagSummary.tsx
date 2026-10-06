import React from 'react';
import { LegalFlag } from '../api/types';
import { ShieldAlert, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

interface LegalFlagSummaryProps {
  flags: LegalFlag[];
  riskScore: number;
}

export const LegalFlagSummary: React.FC<LegalFlagSummaryProps> = ({ flags, riskScore }) => {
  const highCount = flags.filter((f) => f.severity === 'high').length;
  const mediumCount = flags.filter((f) => f.severity === 'medium').length;
  const lowCount = flags.filter((f) => f.severity === 'low').length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            AI Legal Title Due Diligence Assessment
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithmic scan across 11 statutory risk dimensions, encumbrance indexes, and civil court caveats
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] uppercase font-bold text-slate-400">Legal Review Priority</div>
            <div
              className={`text-xl font-black font-mono ${
                riskScore > 65
                  ? 'text-red-400'
                  : riskScore > 35
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {riskScore}/100
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-xs font-mono"
            style={{
              borderColor: riskScore > 65 ? '#f87171' : riskScore > 35 ? '#fbbf24' : '#34d399',
              backgroundColor: riskScore > 65 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            }}
          >
            {riskScore > 65 ? 'HIGH' : riskScore > 35 ? 'MED' : 'LOW'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="text-xs text-slate-400">Total Legal Flags</div>
          <div className="text-xl font-bold text-white mt-1">{flags.length}</div>
        </div>

        <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40">
          <div className="text-xs text-red-300 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> High Severity
          </div>
          <div className="text-xl font-bold text-red-400 mt-1">{highCount}</div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
          <div className="text-xs text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Medium Severity
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1">{mediumCount}</div>
        </div>

        <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40">
          <div className="text-xs text-blue-300 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Low Severity
          </div>
          <div className="text-xl font-bold text-blue-400 mt-1">{lowCount}</div>
        </div>
      </div>
    </div>
  );
};
