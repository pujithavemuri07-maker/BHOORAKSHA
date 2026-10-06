import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRevenueStore } from '../../store/revenueStore';
import { useTranslation } from '../../i18n';
import { HistoryTable } from './HistoryTable';
import { History, Download, Search, Filter, Eye, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const HistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const history = useRevenueStore((s) => s.history);

  const initialAction = searchParams.get('action') || searchParams.get('status') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState(initialAction);

  useEffect(() => {
    const act = searchParams.get('action') || searchParams.get('status');
    if (act) {
      setFilterAction(act.toLowerCase());
    }
  }, [searchParams]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.mutationId && item.mutationId.toLowerCase().includes(searchQuery.toLowerCase()));

      const itemActionLower = (item.action || '').toLowerCase();
      const matchesAction =
        filterAction === 'all' ||
        itemActionLower === filterAction.toLowerCase() ||
        (filterAction === 'approved' && itemActionLower.includes('approved')) ||
        (filterAction === 'rejected' && itemActionLower.includes('rejected'));

      return matchesSearch && matchesAction;
    });
  }, [history, searchQuery, filterAction]);

  const handleExportCSV = () => {
    const csvRows = [
      ['Timestamp', 'Application ID', 'Action', 'Citizen Name', 'Mutation ID', 'Certificate ID', 'Officer', 'Remarks'],
      ...filteredHistory.map((h) => [
        h.timestamp,
        h.applicationId,
        h.action,
        `"${h.citizenName}"`,
        h.mutationId || '',
        h.certificateId || '',
        `"${h.officerName}"`,
        `"${h.remarks.replace(/"/g, '""')}"`,
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `revenue_audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Tamper-Evident Audit Ledger exported to CSV!');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t('revenue.history')}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('history.cryptographicLedger')}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {t('history.subtitle')}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{t('history.exportCsv')}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('history.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="all">{t('history.allActions')}</option>
            <option value="approved">{t('history.approvedMutated')}</option>
            <option value="rejected">{t('history.statutoryRejection')}</option>
            <option value="certificate_generated">{t('history.certificateIssued')}</option>
            <option value="mutation_triggered">{t('history.mutationTriggered')}</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <HistoryTable records={filteredHistory} />
    </div>
  );
};

export default HistoryPage;
