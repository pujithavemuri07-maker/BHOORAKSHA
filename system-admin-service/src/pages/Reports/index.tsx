import React, { useState } from 'react';
import {
  BarChart3,
  FileDown,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
  Download,
  FileText,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { getRegionalConfig } from '@shared/i18n';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);
  const [reportType, setReportType] = useState('application_volume');
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [district, setDistrict] = useState('all');

  const handleGenerateCSV = () => {
    toast.loading(`Compiling statewide ${reportType} report...`, { id: 'rep' });

    const headers = ['Report ID', 'State', 'District Scope', 'Time Window', 'Dataset Focus', 'Metric Name', 'Value', 'Status', 'Generated Timestamp'];
    const timestamp = new Date().toISOString();

    const sampleRows = [
      ['REP-2026-801', regionalConfig.state, district === 'all' ? 'All 33 Districts' : district, timeRange, reportType, 'Total Deeds Registered', '48920', 'Ratified', timestamp],
      ['REP-2026-802', regionalConfig.state, district === 'all' ? 'All 33 Districts' : district, timeRange, reportType, 'AI OCR/NER Accuracy Rate', '96.8%', 'Validated', timestamp],
      ['REP-2026-803', regionalConfig.state, district === 'all' ? 'All 33 Districts' : district, timeRange, reportType, 'Average Adjudication Latency', '1.84s', 'Normal', timestamp],
      ['REP-2026-804', regionalConfig.state, district === 'all' ? 'All 33 Districts' : district, timeRange, reportType, 'Active Officer Sessions', '342', 'Active', timestamp],
      ['REP-2026-805', regionalConfig.state, district === 'all' ? 'All 33 Districts' : district, timeRange, reportType, 'Cryptographic Ledger Status', '100% Tamper-Proof', 'Verified', timestamp],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...sampleRows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhooraksha_report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`CSV report generated and downloaded successfully!`, { id: 'rep' });
  };

  const handleGeneratePDF = () => {
    toast.loading(`Generating Executive PDF Report...`, { id: 'rep' });

    const content = `================================================================================
BHOORAKSHA - EXECUTIVE GOVERNANCE & TELEMETRY REPORT
Chief Commissioner of Land Administration (CCLA) • State of ${regionalConfig.state}
Generated Date: ${new Date().toLocaleString()}
================================================================================

1. REPORT METADATA:
   - Report Type: ${reportType.toUpperCase()}
   - Time Window: ${timeRange.replace(/_/g, ' ').toUpperCase()}
   - Jurisdiction Scope: ${district === 'all' ? 'Statewide (All Districts)' : district}
   - Security Clearance: CCLA Superuser Level-1

2. EXECUTIVE SUMMARY STATISTICAL OVERVIEW:
   - Total Processed Land Deeds: 48,920 Applications
   - System Uptime Metric: 99.98% SLA Compliance
   - Neural AI Accuracy (Chitrapathak OCR / MuRIL NER): 96.8% Average Accuracy
   - Microservice Fleet Status: 11 / 11 Services Healthy
   - Audit Trail Ledger Integrity: SHA-256 Cryptographically Signed & Verified

3. KEY DISTRICT ADJUDICATION BREAKDOWN:
   - Ranga Reddy: 48 Applications (90% Ratified)
   - Medchal-Malkajgiri: 34 Applications (95% Ratified)
   - Hyderabad HQ: 26 Applications (93% Ratified)
   - Sangareddy: 20 Applications (94% Ratified)

4. COMPLIANCE & TAMPER-PROOF CERTIFICATION:
   - Section 40 Revenue Act Certified
   - ISO/IEC 27001 Information Security Management Compliant
   - Digital India Land Records Modernization Programme (DILRMP) Standardized

--------------------------------================--------------------------------
Official CCLA Telemetry Directorate • Confidential Executive Summary Document
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bhooraksha_executive_report_${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Executive PDF report generated and downloaded successfully!`, { id: 'rep' });
  };

  const handleDownloadArchived = (title: string, type: string) => {
    toast.loading(`Downloading ${title}...`, { id: 'rep' });

    const content = `================================================================================
BHOORAKSHA ARCHIVED DEPARTMENTAL REPORT
Title: ${title}
Category: ${type}
State Jurisdiction: ${regionalConfig.state}
Generated Date: ${new Date().toISOString().slice(0, 10)}
================================================================================

This document contains official archived telemetry and audit records for state land administration.

1. Summary of Operations & Auditing Metrics.
2. Verified ledger entries and Officer Resolution Latency Benchmarks.
3. Cryptographically signed audit trail timestamp log.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Report "${title}" downloaded successfully!`, { id: 'rep' });
  };

  const reportsList = [
    {
      title: 'Statewide Deed Registration & Mutation Throughput (August 2026)',
      type: 'Volume & SLA',
      size: '2.4 MB',
      date: '2026-09-01',
      author: 'CCLA Automated Telemetry',
    },
    {
      title: 'AI OCR & NER Entity Accuracy Compliance Audit Q2-2026',
      type: 'AI Performance',
      size: '4.8 MB',
      date: '2026-08-15',
      author: 'AI Governance Board',
    },
    {
      title: 'Inter-District Revenue Officer Resolution Latency Benchmark',
      type: 'Officer Performance',
      size: '1.9 MB',
      date: '2026-08-01',
      author: 'Directorate of Land Records',
    },
    {
      title: 'Cadastral Boundary Overlap & Discrepancy Reconciliation Summary',
      type: 'GIS Auditing',
      size: '6.1 MB',
      date: '2026-07-28',
      author: 'Survey Settlement Wing',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/40 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Executive Intelligence & BI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {t('admin.reports')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Generate customized statistical datasets, district performance matrices, and model governance summaries for departmental cabinet reviews.
          </p>
        </div>
      </div>

      {/* Report Generator Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Custom Report Parameter Builder</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Report Dataset Focus</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="application_volume">Application Volume & Pipeline Ingress</option>
              <option value="user_growth">Citizen & Officer Onboarding Velocity</option>
              <option value="approval_rates">District Ratification & Rejection Rates</option>
              <option value="ai_accuracy">Chitrapathak / MuRIL Accuracy Over Time</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Time Window</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days (Monthly)</option>
              <option value="last_quarter">Last Quarter (Q2 2026)</option>
              <option value="year_to_date">Year to Date (CY 2026)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">District Scope</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Districts ({regionalConfig.state})</option>
              {regionalConfig.districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleGenerateCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Compile CSV</span>
          </button>
          <button
            type="button"
            onClick={handleGeneratePDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Generate Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Historical Published Reports */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileDown className="w-4 h-4 text-indigo-400" />
            <span>Archived Departmental Reports</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">4 Documents</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {reportsList.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div
                  onClick={() => handleDownloadArchived(item.title, item.type)}
                  className="text-xs font-bold text-white hover:text-indigo-400 cursor-pointer"
                >
                  {item.title}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                  <span className="text-indigo-400 font-medium">{item.type}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.size}</span>
                  <span>•</span>
                  <span className="text-slate-500 font-mono">{item.author}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadArchived(item.title, item.type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
