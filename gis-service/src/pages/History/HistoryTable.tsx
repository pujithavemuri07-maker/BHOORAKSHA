import { ShieldCheck, Sliders, Flag, XCircle, Search, FileText } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { GISHistoryRecord } from '../../api/types';
import { formatDateTime } from '../../utils/formatters';

interface HistoryTableProps {
  records: GISHistoryRecord[];
}

export const HistoryTable = ({ records }: HistoryTableProps) => {
  const { t } = useTranslation();

  const getActionBadge = (action: string) => {
    const act = (action || '').toUpperCase();
    if (act.includes('CONFIRM')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          CONFIRMED
        </span>
      );
    }
    if (act.includes('ADJUST')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          <Sliders className="w-3 h-3 text-cyan-400" />
          ADJUSTED
        </span>
      );
    }
    if (act.includes('FLAG') || act.includes('SURVEY')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <Flag className="w-3 h-3 text-purple-400" />
          FIELD SURVEY
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
        <XCircle className="w-3 h-3 text-rose-400" />
        REJECTED
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Application ID</th>
              <th className="py-3.5 px-4">Citizen & Location</th>
              <th className="py-3.5 px-4">Survey Details</th>
              <th className="py-3.5 px-4">Action Taken</th>
              <th className="py-3.5 px-4">Overlap %</th>
              <th className="py-3.5 px-4">Officer Remarks</th>
              <th className="py-3.5 px-4">Officer ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {records.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                  {formatDateTime(item.timestamp)}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                  {item.applicationNo || item.applicationId}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100">{item.citizenName}</div>
                  <div className="text-[10px] text-slate-400">{item.village}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  Sy. {item.surveyNumber}
                </td>
                <td className="py-3.5 px-4">
                  {getActionBadge(item.action)}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                  {item.overlapPercentage.toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={item.remarks}>
                  {item.remarks}
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                  {item.performedBy || item.officerName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default HistoryTable;
