import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRevenueStore } from '../../store/revenueStore';
import { useTranslation } from '../../i18n';
import { QueueTable } from './QueueTable';
import { QueueFilters } from './QueueFilters';
import { EmptyState } from './EmptyState';
import { ApproveModal } from '../../components/ApproveModal';
import { RejectModal } from '../../components/RejectModal';
import { BatchActionsBar } from '../../components/BatchActionsBar';
import { RevenueApplication } from '../../api/types';
import toast from 'react-hot-toast';

export const FinalApprovalQueuePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const applications = useRevenueStore((s) => s.applications);
  const approveApplication = useRevenueStore((s) => s.approveApplication);
  const rejectApplication = useRevenueStore((s) => s.rejectApplication);
  const batchApprove = useRevenueStore((s) => s.batchApprove);
  const batchReject = useRevenueStore((s) => s.batchReject);

  // Filters from URL query string if provided
  const initialStatus = searchParams.get('status') || 'all';
  const initialTehsil = searchParams.get('tehsil') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedTehsil, setSelectedTehsil] = useState(initialTehsil);
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setSelectedStatus(s);
    const tParam = searchParams.get('tehsil');
    if (tParam) setSelectedTehsil(tParam);
  }, [searchParams]);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [approveModalApp, setApproveModalApp] = useState<RevenueApplication | null>(null);
  const [rejectModalApp, setRejectModalApp] = useState<RevenueApplication | null>(null);

  const uniqueTehsils = useMemo(() => {
    return Array.from(new Set(applications.map((a) => a.tehsil))).filter(Boolean);
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        searchQuery === '' ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.village.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || app.status === selectedStatus;

      const matchesTehsil =
        selectedTehsil === 'all' || app.tehsil === selectedTehsil;

      const matchesPriority =
        selectedPriority === 'all' || app.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesTehsil && matchesPriority;
    });
  }, [applications, searchQuery, selectedStatus, selectedTehsil, selectedPriority]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map((a) => a.id));
    }
  };

  const handleBatchApprove = async (ids: string[], remarks?: string) => {
    try {
      await batchApprove(ids, remarks);
      toast.success(`Successfully approved ${ids.length} applications and triggered mutations!`);
      setSelectedIds([]);
    } catch {
      toast.error('Failed to execute batch approval');
    }
  };

  const handleBatchReject = async (ids: string[], reason: string, remarks: string) => {
    try {
      await batchReject(ids, reason, remarks);
      toast.success(`Rejected ${ids.length} applications by Executive Order.`);
      setSelectedIds([]);
    } catch {
      toast.error('Failed to execute batch rejection');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t('revenue.queue')}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {filteredApplications.length} In Queue
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Final Adjudication • Final Clearance after DEO, Verifier, Legal &amp; GIS concurrence
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <QueueFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTehsil={selectedTehsil}
        onTehsilChange={setSelectedTehsil}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        tehsils={uniqueTehsils}
        onReset={() => {
          setSearchQuery('');
          setSelectedStatus('all');
          setSelectedTehsil('all');
          setSelectedPriority('all');
        }}
      />

      {/* Table / Empty State */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedStatus('all');
            setSelectedTehsil('all');
            setSelectedPriority('all');
          }}
        />
      ) : (
        <QueueTable
          applications={filteredApplications}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onQuickApprove={(app) => setApproveModalApp(app)}
          onQuickReject={(app) => setRejectModalApp(app)}
        />
      )}

      {/* Batch Floating Bar */}
      <BatchActionsBar
        selectedIds={selectedIds}
        onBatchApprove={handleBatchApprove}
        onBatchReject={handleBatchReject}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* Approve Modal */}
      {approveModalApp && (
        <ApproveModal
          isOpen={true}
          applicationId={approveModalApp.id}
          ulpin={approveModalApp.ulpin}
          onClose={() => setApproveModalApp(null)}
          onConfirm={async (remarks) => {
            await approveApplication(approveModalApp.id, remarks);
            setApproveModalApp(null);
          }}
        />
      )}

      {/* Reject Modal */}
      {rejectModalApp && (
        <RejectModal
          isOpen={true}
          applicationId={rejectModalApp.id}
          onClose={() => setRejectModalApp(null)}
          onConfirm={async (reason, remarks) => {
            await rejectApplication(rejectModalApp.id, reason, remarks);
            setRejectModalApp(null);
          }}
        />
      )}
    </div>
  );
};

export default FinalApprovalQueuePage;
