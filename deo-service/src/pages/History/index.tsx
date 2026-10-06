import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useDEOStore } from '../../store/deoStore';
import { HistoryTable } from './HistoryTable';
import { History, Search, Download, ShieldCheck } from 'lucide-react';

export default function HistoryPage() {
  const { t } = useTranslation();
  const history = useDEOStore((state) => state.history);
  const [search, setSearch] = useState('');

  const filteredHistory = history.filter(
    (h) =>
      h.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      h.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      h.surveyNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-amber-500" />
            <span>{t('deo.history')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit ledger of applications reviewed, forwarded, and flagged by Patwari desk (Past 30 Days)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history records..."
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-2xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => alert('Exporting signed audit ledger CSV...')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-2xl transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* History Ledger Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Showing <strong className="text-white">{filteredHistory.length}</strong> logged transactions
          </span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Immutable PostgreSQL Audit Log
          </span>
        </div>
        <HistoryTable records={filteredHistory} />
      </div>
    </div>
  );
}
