import React from 'react';
import { HistoryRecord } from '../../api/types';
import { formatDate, formatTime } from '../../utils/formatters';
import { PriorityBadge } from '../../components/PriorityBadge';
import { History, UserCheck, AlertTriangle, Send, FileSpreadsheet } from 'lucide-react';

interface HistoryTableProps {
  records: HistoryRecord[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="p-10 text-center text-slate-500 text-xs">
        No completed reviews logged in the past 30 days.
      </div>
    );
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'ROUTED_TO_VERIFIER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Send className="w-3 h-3" />
            Forwarded to Verifier
          </span>
        );
      case 'CORRECTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" />
            Correction Flagged
          </span>
        );
      case 'MANUAL_ENTRY_SAVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileSpreadsheet className="w-3 h-3" />
            Manual Fallback Saved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-4">Application & Date</th>
            <th className="py-3.5 px-4">Citizen Applicant</th>
            <th className="py-3.5 px-4">Survey Reference</th>
            <th className="py-3.5 px-4">Action Taken</th>
            <th className="py-3.5 px-4">Designated Officer</th>
            <th className="py-3.5 px-4">Inspection Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-medium">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="py-3.5 px-4">
                <span className="font-mono font-bold text-white">{record.applicationId}</span>
                <p className="text-[11px] text-slate-500">
                  {formatDate(record.timestamp)} {formatTime(record.timestamp)}
                </p>
              </td>

              <td className="py-3.5 px-4 text-slate-200 font-bold">
                {record.citizenName}
              </td>

              <td className="py-3.5 px-4 font-mono text-slate-300">
                Sy. #{record.surveyNumber}
              </td>

              <td className="py-3.5 px-4">
                {getActionBadge(record.action)}
              </td>

              <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                {record.targetOfficer || 'System Auto-Assigned'}
              </td>

              <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                {record.remarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
