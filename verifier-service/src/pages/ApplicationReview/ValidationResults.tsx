import { useTranslation } from '../../i18n';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import { ValidationItem } from '../../api/types';

interface ValidationResultsProps {
  results: ValidationItem[];
  onViewSource?: (docTypeKey: string, pageNumber?: number) => void;
}

export const ValidationResults = ({ results, onViewSource }: ValidationResultsProps) => {
  const { t } = useTranslation();

  const getStatusBadge = (status: ValidationItem['status']) => {
    switch (status) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            MATCH
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            PARTIAL MATCH
          </span>
        );
      case 'MISMATCH':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            POTENTIAL DISCREPANCY
          </span>
        );
    }
  };

  return (
    <div id="section-validation" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Cross-Document Validation & Discrepancy Scrutiny
            </h3>
            <p className="text-xs text-slate-400">
              Field-by-field cross-matching with source document references & confidence scoring
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-200">
                {item.label}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-mono">
                  Confidence: {Math.round((item.confidence || 0.95) * 100)}%
                </span>
                {getStatusBadge(item.status)}
                {onViewSource && (
                  <button
                    onClick={() => onViewSource(item.sourceDoc || 'Registered Sale Deed', item.sourcePage || 1)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px] font-semibold transition-all flex items-center gap-1"
                  >
                    VIEW SOURCE
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/80">
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                  Extracted Instrument Value:
                </span>
                <span className="font-mono text-slate-200 font-medium">{item.documentValue}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                  Government Record Cross-Check:
                </span>
                <span className="font-mono text-slate-200 font-medium">{item.govtValue}</span>
              </div>
            </div>

            {item.explanation && (
              <p className="text-[11px] text-amber-400/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 leading-relaxed">
                <strong>Discrepancy Detail:</strong> {item.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
