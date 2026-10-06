import React, { useMemo } from 'react';
import { useRevenueStore } from '../../store/revenueStore';
import { useTranslation } from '../../i18n';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { TehsilPerformanceTable } from './TehsilPerformanceTable';
import { OfficerPerformanceTable } from './OfficerPerformanceTable';
import { BarChart3, Download, FileSpreadsheet, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const getTehsilStats = useRevenueStore((s) => s.getTehsilStats);
  const applications = useRevenueStore((s) => s.applications);

  const tehsilStats = useMemo(() => getTehsilStats(), [getTehsilStats, applications]);

  const handleExportCSV = () => {
    const csvRows = [
      ['Tehsil', 'Total Applications', 'Approved', 'Pending', 'Rejected'],
      ...tehsilStats.map((t) => [t.tehsil, t.total, t.approved, t.pending, t.rejected]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `revenue_reports_district_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('District Revenue Analytics report exported successfully!');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t('revenue.reports')}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {t('reports.districtAnalytics')}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {t('reports.subtitleDesc')}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{t('reports.exportMis')}</span>
        </button>
      </div>

      {/* Trajectory Bar Chart */}
      <MonthlyTrendChart />

      {/* Tehsil Performance Grid */}
      <TehsilPerformanceTable tehsils={tehsilStats} />

      {/* Officer Desk SLA Performance */}
      <OfficerPerformanceTable />
    </div>
  );
};

export default ReportsPage;
