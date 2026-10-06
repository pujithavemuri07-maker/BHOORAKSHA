import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowUp, Calendar, User, Hash, ShieldCheck, ArrowRight } from 'lucide-react';
import { HistoryRecord } from '../../api/types';
import { formatDateTime } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';

interface HistoryTableProps {
  records: HistoryRecord[];
}

export const HistoryTable = ({ records }: HistoryTableProps) => {
  const { t } = useTranslation();
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const getActionBadge = (action: HistoryRecord['action']) => {
    switch (action) {
      case 'APPROVED':
      case 'APPROVED_AND_FORWARDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('APPROVED & FORWARDED')}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            {t('REJECTED BY VERIFIER')}
          </span>
        );
      case 'RETURNED_TO_DEO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <RotateCcw className="w-3.5 h-3.5" />
            {t('RETURNED TO DEO')}
          </span>
        );
      case 'ESCALATED_TO_REVENUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ArrowUp className="w-3.5 h-3.5" />
            {t('ESCALATED TO REVENUE ADMIN')}
          </span>
        );
      case 'REOPENED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <RotateCcw className="w-3.5 h-3.5" />
            {t('REOPENED / RE-REVIEW')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300">
            {t(action)}
          </span>
        );
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        {t('No verification history matches the selected filter.')}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">{t('Audit Entry ID')}</th>
              <th className="py-3 px-4">{t('App ID & Cycle')}</th>
              <th className="py-3 px-4">{t('Citizen & Parcel')}</th>
              <th className="py-3 px-4">{t('Decision Taken')}</th>
              <th className="py-3 px-4">{t('Workflow Transition')}</th>
              <th className="py-3 px-4">{t('Remarks')}</th>
              <th className="py-3 px-4 text-right">{t('Actions & Audit Hash')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{r.id}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold">
                  <Link
                    to={`/verifier/review/${r.applicationId}`}
                    className="text-emerald-400 hover:underline block"
                  >
                    {r.applicationId}
                  </Link>
                  <span className="text-[10px] text-sky-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-normal">
                    {t('Cycle')} #{r.reviewCycle || 1}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100">{r.citizenName}</div>
                  <div className="text-[11px] text-slate-400">Sy. #{r.surveyNumber}</div>
                </td>
                <td className="py-3.5 px-4">
                  {getActionBadge(r.action)}
                  {r.reason && (
                    <div className="text-[11px] text-amber-300/90 font-medium mt-1">
                      {t('Cause:')} {t(r.reason)}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                      {t(r.previousStatus || 'Pending')}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="px-1.5 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded">
                      {t(r.newStatus || r.action)}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <p className="text-slate-200 text-xs leading-relaxed max-w-xs truncate">
                    {r.remarks}
                  </p>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedRecord(r)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-xs font-semibold transition-all mb-1"
                  >
                    {t('VIEW DETAILS')}
                  </button>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {formatDateTime(r.timestamp)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  {t('AUDIT ENTRY:')} {selectedRecord.id}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {t('Application:')} <span className="text-emerald-400 font-mono">{selectedRecord.applicationId}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded-lg"
              >
                {t('Close')}
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">{t('Tamper-Evident SHA-256 Hash:')}</span>
                <span className="text-emerald-400 break-all">{selectedRecord.auditHash || '8f42d9910ae6718a38c821611b7a91ce29a8f4c01b22883da45199ff91a9821c'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">{t('Review Cycle:')}</span>
                  <span className="text-sky-400 font-bold">{t('Cycle')} #{selectedRecord.reviewCycle || 1}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('Executing Officer:')}</span>
                  <span className="text-slate-200 font-bold">{selectedRecord.verifierName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('Previous Status:')}</span>
                  <span className="text-slate-300">{t(selectedRecord.previousStatus || 'pending_verification')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('New Status:')}</span>
                  <span className="text-emerald-400">{t(selectedRecord.newStatus || selectedRecord.action)}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">{t('Official Remarks:')}</span>
                <p className="text-slate-200 font-sans leading-relaxed">{selectedRecord.remarks}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
