import React from 'react';
import { LegalFlag } from '../api/types';
import { SeverityBadge } from './SeverityBadge';
import { Scale, AlertTriangle, BookOpen, ShieldAlert, Sparkles } from 'lucide-react';
import { LEGAL_FLAG_TYPES } from '../utils/constants';

interface LegalFlagCardProps {
  flag: LegalFlag;
  onSelect?: (flag: LegalFlag) => void;
  onQuoteCitation?: (citation: string) => void;
}

export const LegalFlagCard: React.FC<LegalFlagCardProps> = ({
  flag,
  onSelect,
  onQuoteCitation,
}) => {
  const meta = LEGAL_FLAG_TYPES.find((t) => t.type === flag.type);
  const statutoryAct = flag.citation || meta?.act || 'Transfer of Property Act, 1882';

  return (
    <div
      onClick={() => onSelect?.(flag)}
      className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden group shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 text-amber-400 group-hover:bg-amber-500/10 transition-colors">
            {flag.severity === 'high' ? (
              <ShieldAlert className="w-4 h-4 text-red-400" />
            ) : (
              <Scale className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              {flag.title}
              {flag.source === 'ai' && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-purple-300 bg-purple-950/40 border border-purple-800/40 px-1.5 py-0.2 rounded font-mono font-medium">
                  <Sparkles className="w-2.5 h-2.5" /> AI Detected
                </span>
              )}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="font-mono text-slate-500">ID: {flag.id}</span>
              <span>•</span>
              <span className="text-indigo-300 font-medium flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {statutoryAct}
              </span>
            </div>
          </div>
        </div>
        <SeverityBadge severity={flag.severity} size="sm" />
      </div>

      <p className="text-xs text-slate-300 leading-relaxed pl-10">
        {flag.description}
      </p>

      {flag.recommendation && (
        <div className="ml-10 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-300">Legal Advisory Recommendation: </span>
            <span>{flag.recommendation}</span>
          </div>
        </div>
      )}

      {onQuoteCitation && (
        <div className="ml-10 flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuoteCitation(`Pursuant to ${statutoryAct}, regarding "${flag.title}": ${flag.description}`);
            }}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
          >
            Insert into Legal Opinion &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
