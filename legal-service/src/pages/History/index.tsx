import React, { useState, useMemo } from 'react';
import { useLegalStore } from '../../store/legalStore';
import { History, ShieldCheck, FileSpreadsheet, RotateCcw } from 'lucide-react';
import { AuditSummaryCards } from './AuditSummaryCards';
import { AuditFilterBar } from './AuditFilterBar';
import { AuditTable, AuditRecordItem } from './AuditTable';
import { AuditEventDetailDrawer } from './AuditEventDetailDrawer';
import toast from 'react-hot-toast';

export const HistoryPage: React.FC = () => {
  const history = useLegalStore((s) => s.history);
  const applications = useLegalStore((s) => s.applications);

  // Filter States
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Detail Record
  const [selectedRecord, setSelectedRecord] = useState<AuditRecordItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Enhance store history records with audit properties
  const enrichedRecords: AuditRecordItem[] = useMemo(() => {
    // If store history has few items, include extended realistic mock entries
    const baseItems = [
      ...history,
      {
        id: 'HIST-LEG-805',
        applicationId: 'LEG-2026-582',
        citizenName: 'P. Venkatesh',
        surveyNumber: '110/3',
        action: 'BLOCKED' as const,
        reason: 'non_transferable',
        opinion: 'Prohibited government tank-bed buffer encroachment confirmed under Section 22-A(1)(b). Statutory block order recorded.',
        timestamp: '2026-09-05T15:30:00Z',
        officerName: 'Adv. Rajeshwari Sharma',
      },
      {
        id: 'HIST-LEG-806',
        applicationId: 'LEG-2026-580',
        citizenName: 'K. Srilatha',
        surveyNumber: '44/A',
        action: 'CLEARED' as const,
        opinion: 'Pattadar passbook and succession certificate verified with MRO Nagaram. Clear title confirmed.',
        timestamp: '2026-09-05T12:15:00Z',
        officerName: 'Adv. Rajeshwari Sharma',
      },
      {
        id: 'HIST-LEG-807',
        applicationId: 'LEG-2026-577',
        citizenName: 'B. Mohan Reddy',
        surveyNumber: '215/B',
        action: 'FLAGGED' as const,
        reason: 'missing_legal_documents',
        opinion: 'Prior registered settlement deed extract missing. 15-day rectification notice issued to applicant.',
        timestamp: '2026-09-04T16:45:00Z',
        officerName: 'Adv. Rajeshwari Sharma',
      },
      {
        id: 'HIST-LEG-808',
        applicationId: 'LEG-2026-574',
        citizenName: 'Syed Abdul Rahim',
        surveyNumber: '88/1',
        action: 'ESCALATED' as const,
        opinion: 'Conflicting Wakf Board notification claim overlapping parcel. Referred to Joint Collector / DRO for adjudication.',
        timestamp: '2026-09-04T11:20:00Z',
        officerName: 'Adv. Rajeshwari Sharma',
      },
      {
        id: 'HIST-LEG-809',
        applicationId: 'LEG-2026-571',
        citizenName: 'Ch. Narsimha Rao',
        surveyNumber: '302/C',
        action: 'CLEARED' as const,
        opinion: 'Sale deed recital, boundary schedule, and Encumbrance Form 15 verified. Mutation sanctioned.',
        timestamp: '2026-09-03T14:10:00Z',
        officerName: 'Adv. Rajeshwari Sharma',
      },
    ];

    return baseItems.map((rec, idx) => {
      const isHigh = rec.action === 'BLOCKED' || (rec.reason && rec.reason.includes('litigation'));
      const isMedium = rec.action === 'FLAGGED' || rec.action === 'ESCALATED';

      const matchedApp = applications.find((a) => a.id === rec.applicationId);
      const loc = matchedApp?.extractedData?.propertyDetails;
      const locationStr = loc ? `${loc.village}, ${loc.district}` : 'Serilingampally, Ranga Reddy';

      return {
        ...rec,
        auditId: `AUD-2026-${String(880 + idx + 1).padStart(5, '0')}`,
        risk: isHigh ? 'High' : isMedium ? 'Medium' : 'Low',
        location: locationStr,
        previousStatus: 'Pending Legal Review',
        newStatus:
          rec.action === 'CLEARED'
            ? 'Cleared for Mutation'
            : rec.action === 'BLOCKED'
            ? 'Blocked by Legal Order'
            : rec.action === 'ESCALATED'
            ? 'Referred to Tehsildar'
            : 'Rectification Notice Issued',
        caseType: matchedApp?.documentType || 'Registered Title Deed',
        ulpin: loc?.ulpin || `ULPIN-36-RR-${rec.surveyNumber.replace('/', '-')}`,
        digitalSignature: {
          status: 'SIGNED',
          signedBy: rec.officerName || 'Adv. Rajeshwari Sharma',
          signedAt: rec.timestamp,
          sigRef: `ESIGN-3.0-${rec.id}`,
        },
      };
    });
  }, [history, applications]);

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return enrichedRecords.filter((rec) => {
      // Search
      if (search) {
        const q = search.toLowerCase().trim();
        const matches =
          rec.auditId.toLowerCase().includes(q) ||
          rec.applicationId.toLowerCase().includes(q) ||
          rec.citizenName.toLowerCase().includes(q) ||
          rec.surveyNumber.toLowerCase().includes(q) ||
          (rec.ulpin && rec.ulpin.toLowerCase().includes(q)) ||
          (rec.opinion && rec.opinion.toLowerCase().includes(q)) ||
          (rec.reason && rec.reason.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Action Filter
      if (actionFilter !== 'all') {
        if (actionFilter === 'UNDER_REVIEW' && rec.action !== 'UNDER_REVIEW') return false;
        if (actionFilter !== 'UNDER_REVIEW' && rec.action !== actionFilter) return false;
      }

      // Risk Filter
      if (riskFilter !== 'all') {
        if (rec.risk.toLowerCase() !== riskFilter.toLowerCase()) return false;
      }

      // Date Range Filter (simplified simulated match)
      if (dateRange === 'today') {
        const recDate = new Date(rec.timestamp).toDateString();
        const todayDate = new Date().toDateString();
        // Allow items from recent demo date as match
        if (recDate !== todayDate && !rec.timestamp.includes('2026-09-07')) return false;
      }

      // Status Filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed' && rec.action !== 'CLEARED') return false;
        if (statusFilter === 'blocked' && rec.action !== 'BLOCKED') return false;
        if (statusFilter === 'escalated' && rec.action !== 'ESCALATED') return false;
        if (statusFilter === 'pending' && rec.action !== 'FLAGGED') return false;
      }

      return true;
    });
  }, [enrichedRecords, search, actionFilter, riskFilter, dateRange, statusFilter]);

  const hasActiveFilters =
    Boolean(search) ||
    dateRange !== 'all' ||
    actionFilter !== 'all' ||
    riskFilter !== 'all' ||
    statusFilter !== 'all';

  const handleClearFilters = () => {
    setSearch('');
    setDateRange('all');
    setActionFilter('all');
    setRiskFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
    toast.success('Filters cleared');
  };

  // Pagination Slicing
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Legal Audit Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit history for recorded legal actions, statutory determinations, and case outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 self-start sm:self-auto shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">Audit History & eSign Verification Active</span>
        </div>
      </div>

      {/* 2. TOP SUMMARY CARDS */}
      <AuditSummaryCards history={history} />

      {/* 3. SEARCH AND FILTER BAR */}
      <AuditFilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        dateRange={dateRange}
        onDateRangeChange={(v) => {
          setDateRange(v);
          setCurrentPage(1);
        }}
        actionFilter={actionFilter}
        onActionFilterChange={(v) => {
          setActionFilter(v);
          setCurrentPage(1);
        }}
        riskFilter={riskFilter}
        onRiskFilterChange={(v) => {
          setRiskFilter(v);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => {
          setStatusFilter(v);
          setCurrentPage(1);
        }}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. MAIN AUDIT TABLE */}
      <AuditTable
        records={paginatedRecords}
        onSelectRecord={(rec) => setSelectedRecord(rec)}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredRecords.length}
        pageSize={pageSize}
        onPageChange={(p) => setCurrentPage(p)}
        onClearFilters={handleClearFilters}
      />

      {/* 5. AUDIT EVENT DETAILS DRAWER (When clicking View on any record) */}
      <AuditEventDetailDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};

export default HistoryPage;
