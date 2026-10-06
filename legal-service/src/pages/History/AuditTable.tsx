import React from 'react';
import { HistoryRecord } from '../../api/types';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileText,
  Scale,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export interface AuditRecordItem extends HistoryRecord {
  auditId: string;
  risk: 'High' | 'Medium' | 'Low';
  location?: string;
  previousStatus?: string;
  newStatus?: string;
  submissionDate?: string;
  caseType?: string;
  ulpin?: string;
  digitalSignature?: {
    status: 'SIGNED' | 'PENDING';
    signedBy: string;
    signedAt: string;
    sigRef: string;
  };
  supportingEvidence?: Array<{
    name: string;
    type: string;
    ref?: string;
    status: string;
  }>;
}

interface AuditTableProps {
  records: AuditRecordItem[];
  onSelectRecord: (record: AuditRecordItem) => void;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export const AuditTable: React.FC<AuditTableProps> = ({
  records,
  onSelectRecord,
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onClearFilters,
}) => {
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CLEARED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            CLEARED
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            CORRECTION REQUIRED
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            LEGAL HOLD
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-purple-400" />
            ESCALATED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <Scale className="w-3 h-3 text-slate-400" />
            UNDER REVIEW
          </span>
        );
    }
  };

  const getRiskBadge = (risk: 'High' | 'Medium' | 'Low') => {
    switch (risk) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950/60 text-rose-300 border border-rose-500/30">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-950/60 text-amber-300 border border-amber-500/30">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
            Low
          </span>
        );
    }
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
      {/* Empty State */}
      {records.length === 0 ? (
        <div className="py-16 px-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">No audit records found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try changing the search terms or filters to locate specific recorded legal actions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md inline-flex items-center gap-1.5"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-3">Date & Time</th>
                  <th className="py-3.5 px-3">Audit ID</th>
                  <th className="py-3.5 px-3">Case ID</th>
                  <th className="py-3.5 px-3">Party / Citizen</th>
                  <th className="py-3.5 px-3">Land / Parcel</th>
                  <th className="py-3.5 px-3">Action</th>
                  <th className="py-3.5 px-2">Risk</th>
                  <th className="py-3.5 px-3">Reason / Summary</th>
                  <th className="py-3.5 px-3">Officer</th>
                  <th className="py-3.5 px-2">Signature</th>
                  <th className="py-3.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {records.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => onSelectRecord(rec)}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  >
                    {/* TIMESTAMP */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      {formatDateTime(rec.timestamp)}
                    </td>

                    {/* AUDIT REFERENCE ID */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                        {rec.auditId}
                      </span>
                    </td>

                    {/* CASE ID */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-indigo-300">
                        {rec.applicationId}
                      </span>
                    </td>

                    {/* PARTY / CITIZEN */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-semibold text-slate-100">
                      {rec.citizenName}
                    </td>

                    {/* LAND / PARCEL */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-slate-300 text-[11px]">
                      Sy. {rec.surveyNumber}
                    </td>

                    {/* ACTION */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getActionBadge(rec.action)}
                    </td>

                    {/* RISK */}
                    <td className="py-3.5 px-2 whitespace-nowrap">
                      {getRiskBadge(rec.risk)}
                    </td>

                    {/* REASON / SUMMARY */}
                    <td className="py-3.5 px-3 max-w-[240px]">
                      <p className="text-slate-300 text-[11px] truncate" title={rec.opinion}>
                        {rec.opinion}
                      </p>
                      {rec.reason && (
                        <span className="text-[10px] text-slate-500 block truncate">
                          {rec.reason.replace(/_/g, ' ')}
                        </span>
                      )}
                    </td>

                    {/* OFFICER */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-200 font-medium">
                      {rec.officerName || 'Adv. Rajeshwari Sharma'}
                    </td>

                    {/* SIGNATURE */}
                    <td className="py-3.5 px-2 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>eSign Signed</span>
                      </div>
                    </td>

                    {/* VIEW ACTION */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(rec);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                      >
                        <span>View</span>
                        <Eye className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Showing <span className="font-bold text-white font-mono">{startIndex}–{endIndex}</span> of{' '}
              <span className="font-bold text-white font-mono">{totalRecords}</span> audit entries
            </div>

            <div className="flex items-center gap-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                    currentPage === p
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
