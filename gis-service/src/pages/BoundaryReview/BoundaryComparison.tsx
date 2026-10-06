import { CheckCircle2, AlertCircle, XCircle, Table } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { BoundaryComparisonItem } from '../../api/types';

interface BoundaryComparisonProps {
  comparisons: BoundaryComparisonItem[];
}

export const BoundaryComparison = ({ comparisons }: BoundaryComparisonProps) => {
  const { t } = useTranslation();

  const getStatusBadge = (status: 'match' | 'partial' | 'mismatch') => {
    switch (status) {
      case 'match':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {t('MATCH')}
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            {t('PARTIAL')}
          </span>
        );
      case 'mismatch':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3 h-3 text-rose-400" />
            {t('MISMATCH')}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Table className="w-4 h-4 text-teal-400" />
          <span>{t('gis.boundaryComparison')}</span>
        </h3>
        <span className="text-xs text-slate-400">{t('Document Deed vs BhooNaksha Cadastre')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
              <th className="py-2.5 px-3">{t('Boundary Parameter')}</th>
              <th className="py-2.5 px-3 text-red-300">{t('Document Deed Claim')}</th>
              <th className="py-2.5 px-3 text-blue-300">{t('Govt BhooNaksha Record')}</th>
              <th className="py-2.5 px-3">{t('Variance')}</th>
              <th className="py-2.5 px-3 text-right">{t('Verification')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {comparisons.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-200">
                  {item.parameter}
                </td>
                <td className="py-3 px-3 font-mono text-slate-300">
                  {item.documentValue}
                </td>
                <td className="py-3 px-3 font-mono text-slate-300">
                  {item.govtValue}
                </td>
                <td className="py-3 px-3 font-mono text-slate-400">
                  {item.variance}
                </td>
                <td className="py-3 px-3 text-right">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
