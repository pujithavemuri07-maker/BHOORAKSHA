import React from 'react';
import { useTranslation } from '../../i18n';
import { ValidationItem } from '../../api/types';
import { ValidationResultBadge } from '../../components/ValidationResultBadge';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ValidationResultsProps {
  results: ValidationItem[];
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({ results }) => {
  const { t } = useTranslation();

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'MATCH':
        return 'border-l-emerald-500 bg-emerald-500/5';
      case 'PARTIAL':
        return 'border-l-amber-500 bg-amber-500/5';
      case 'MISMATCH':
        return 'border-l-rose-500 bg-rose-500/5';
      default:
        return 'border-l-slate-600 bg-slate-800/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'MATCH':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'PARTIAL':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'MISMATCH':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t('deo.aiValidationResults')}
          </h3>
          <p className="text-xs text-slate-400">
            Comparison between citizen deed and official state master land registry (Dharani/Bhoomi)
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={cn(
              'p-4 rounded-2xl border border-slate-800 border-l-4 transition-all space-y-2',
              getBorderColor(result.status)
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {getStatusIcon(result.status)}
                <span className="font-bold text-xs text-white tracking-wide">
                  {result.field}
                </span>
              </div>
              <ValidationResultBadge status={result.status} />
            </div>

            {/* Comparison Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  {t('deo.document')}:
                </span>
                <span className="font-mono text-slate-200 font-semibold">{result.documentValue || 'N/A'}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  {t('deo.government')}:
                </span>
                <span className="font-mono text-slate-200 font-semibold">{result.govtValue || 'N/A'}</span>
              </div>
            </div>

            {/* AI Explanation */}
            {result.explanation && (
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed italic">
                Reasoning: {result.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
