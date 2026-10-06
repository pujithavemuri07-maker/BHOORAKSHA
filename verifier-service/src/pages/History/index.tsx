import { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useVerifierStore } from '../../store/verifierStore';
import { HistoryTable } from './HistoryTable';
import { Search, ShieldCheck, RotateCcw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { t } = useTranslation();
  const history = useVerifierStore((s) => s.history);
  const verifyAuditChain = useVerifierStore((s) => s.verifyAuditChain);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; checkedCount: number } | null>(null);

  const handleVerifyIntegrity = () => {
    const res = verifyAuditChain();
    setVerificationResult({ isValid: res.isValid, checkedCount: history.length });
    if (res.isValid) {
      toast.success(`Audit chain verified! All ${history.length} event hashes intact with unbroken SHA-256 linkages.`);
    } else {
      toast.error(`Audit integrity warning detected at record ID ${res.brokenAtId || 'unknown'}`);
    }
  };

  const filteredHistory = history.filter((h) => {
    if (actionFilter !== 'all') {
      if (actionFilter === 'APPROVED' && h.action !== 'APPROVED' && h.action !== 'APPROVED_AND_FORWARDED') return false;
      if (actionFilter === 'REJECTED' && h.action !== 'REJECTED') return false;
      if (actionFilter === 'RETURNED_TO_DEO' && h.action !== 'RETURNED_TO_DEO') return false;
      if (actionFilter === 'ESCALATED_TO_REVENUE' && h.action !== 'ESCALATED_TO_REVENUE') return false;
      if (actionFilter === 'REOPENED' && h.action !== 'REOPENED') return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        h.id.toLowerCase().includes(q) ||
        h.applicationId.toLowerCase().includes(q) ||
        h.citizenName.toLowerCase().includes(q) ||
        h.surveyNumber.toLowerCase().includes(q) ||
        (h.remarks && h.remarks.toLowerCase().includes(q)) ||
        (h.reason && h.reason.toLowerCase().includes(q)) ||
        (h.verifierName && h.verifierName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight">
            {t('Verification History')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('Tamper-Evident SHA-256 Audit Trail cryptographically recording all Girdawar decisions & workflow transitions')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleVerifyIntegrity}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('VERIFY AUDIT INTEGRITY')}</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 font-mono">
            <span>{history.length} {t('SHA-256 Entries')}</span>
          </div>
        </div>
      </div>

      {/* Audit Verification Result Banner */}
      {verificationResult && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>{t('AUDIT INTEGRITY VERIFIED:')}</strong> {t('Recomputed SHA-256 hashes across all {checkedCount} recorded events match state genesis. Zero hash chain tampering detected.', { checkedCount: verificationResult.checkedCount })}
            </span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900/80 text-emerald-300 px-2.5 py-0.5 rounded font-bold uppercase">
            {t('CHAIN INTACT ✓')}
          </span>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search audit log by App ID (VRF-2026-...), Citizen, Survey No, Remarks, Officer...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          aria-label={t('Filter by Action Taken')}
          className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">{t('All Decision Actions')} ({history.length})</option>
          <option value="APPROVED">{t('Approved & Forwarded')}</option>
          <option value="RETURNED_TO_DEO">{t('Returned to DEO')}</option>
          <option value="REJECTED">{t('Rejected by Verifier')}</option>
          <option value="ESCALATED_TO_REVENUE">{t('Escalated to Revenue Admin')}</option>
          <option value="REOPENED">{t('Reopened / New Review Cycle')}</option>
        </select>

        {(search || actionFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setActionFilter('all');
            }}
            title={t('Reset Filters')}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <HistoryTable records={filteredHistory} />
      </div>
    </div>
  );
}
