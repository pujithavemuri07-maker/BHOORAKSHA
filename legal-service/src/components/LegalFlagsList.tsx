import React from 'react';
import { AlertCircle, Scale, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface LegalFlagItem {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVED' | 'WAIVED';
}

interface LegalFlagsListProps {
  flags: LegalFlagItem[];
  onSelectFlag?: (flag: LegalFlagItem) => void;
}

export const LegalFlagsList: React.FC<LegalFlagsListProps> = ({ flags, onSelectFlag }) => {
  return (
    <div className="space-y-3">
      {flags.map((flag) => {
        const severityClass =
          flag.severity === 'CRITICAL'
            ? 'border-red-500/40 bg-red-950/20 text-red-400'
            : flag.severity === 'HIGH'
            ? 'border-orange-500/40 bg-orange-950/20 text-orange-400'
            : 'border-amber-500/40 bg-amber-950/20 text-amber-400';

        return (
          <div
            key={flag.id}
            onClick={() => onSelectFlag?.(flag)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${severityClass}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-white text-xs">{flag.title}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-black/30">
                {flag.severity}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {flag.description}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span className="font-mono">Flag Code: {flag.code}</span>
              <span className="font-semibold text-amber-300">Status: {flag.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
