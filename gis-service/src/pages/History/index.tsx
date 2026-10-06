import { useState, useMemo } from 'react';
import { History, Search, Filter, Download, FileSpreadsheet } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useGISStore } from '../../store/gisStore';
import { HistoryTable } from './HistoryTable';
import { toast } from 'react-hot-toast';

export const HistoryPage = () => {
  const { t } = useTranslation();
  const historyRecords = useGISStore((s) => s.history);

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredRecords = useMemo(() => {
    return historyRecords.filter((record) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          record.applicationNo.toLowerCase().includes(q) ||
          record.citizenName.toLowerCase().includes(q) ||
          record.surveyNumber.toLowerCase().includes(q) ||
          record.village.toLowerCase().includes(q) ||
          record.remarks.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (actionFilter !== 'all' && record.action !== actionFilter) {
        return false;
      }

      return true;
    });
  }, [historyRecords, searchQuery, actionFilter]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,AppNo,Citizen,SurveyNo,Village,Action,Overlap%,Remarks,Officer']
        .concat(
          filteredRecords.map(
            (r) =>
              `"${r.timestamp}","${r.applicationNo}","${r.citizenName}","${r.surveyNumber}","${r.village}","${r.action}","${r.overlapPercentage}","${r.remarks.replace(/"/g, '""')}","${r.performedBy}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gis_spatial_audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Audit ledger exported to CSV successfully!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-teal-400" />
            <span>{t('gis.history')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable 30-day PostGIS spatial audit trail and boundary ratification ledger
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-700 hover:border-teal-500/40 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Ledger (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by App No, Survey, Citizen..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-slate-400 text-xs font-medium">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Actions ({historyRecords.length})</option>
            <option value="confirm">Confirmed</option>
            <option value="adjust">Adjusted</option>
            <option value="flag_field_survey">Field Survey</option>
            <option value="reject">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <FileSpreadsheet className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No Audit Records Found</h3>
          <p className="text-xs text-slate-400">No actions match your search query.</p>
        </div>
      ) : (
        <HistoryTable records={filteredRecords} />
      )}
    </div>
  );
};
export default HistoryPage;
