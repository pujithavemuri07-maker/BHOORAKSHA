import React from 'react';
import { RevenueHistoryRecord } from '../../api/types';
import { formatDateTime } from '../../utils/formatters';
import { useTranslation } from '../../i18n';
import {
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface HistoryTableProps {
  records: RevenueHistoryRecord[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  const { t } = useTranslation();

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {t('history.approvedMutated')}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            {t('history.statutoryRejection')}
          </span>
        );
      case 'certificate_generated':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            {t('history.certificateIssued')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Layers className="w-3.5 h-3.5" />
            {t('history.mutationTriggered')}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 font-semibold">{t('history.colTimestamp')}</th>
              <th className="p-4 font-semibold">{t('history.colAppId')}</th>
              <th className="p-4 font-semibold">{t('history.colAction')}</th>
              <th className="p-4 font-semibold">{t('history.colCitizen')}</th>
              <th className="p-4 font-semibold">{t('history.colRef')}</th>
              <th className="p-4 font-semibold">{t('history.colOfficer')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-850/40 transition">
                {/* Timestamp */}
                <td className="p-4 whitespace-nowrap font-mono text-slate-400">
                  {formatDateTime(r.timestamp)}
                </td>

                {/* Application ID */}
                <td className="p-4 whitespace-nowrap font-mono font-bold text-indigo-400">
                  {r.applicationId}
                </td>

                {/* Action */}
                <td className="p-4 whitespace-nowrap">{getActionBadge(r.action)}</td>

                {/* Citizen */}
                <td className="p-4 whitespace-nowrap">
                  <span className="font-semibold text-white">{r.citizenName}</span>
                </td>

                {/* Mutation / Certificate Ref */}
                <td className="p-4 whitespace-nowrap font-mono text-emerald-400">
                  {r.mutationId ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      MUT: {r.mutationId}
                    </span>
                  ) : r.certificateId ? (
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      CERT: {r.certificateId}
                    </span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                {/* Remarks & Officer */}
                <td className="p-4 max-w-xs">
                  <p className="font-medium text-slate-200 truncate">{r.remarks}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t('history.by')} {r.officerName}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
