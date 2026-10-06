import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useDEOApplications } from '../../hooks/useDEOApplications';
import { useBatchActions } from '../../hooks/useBatchActions';
import { QueueFilters } from './QueueFilters';
import { QueueTable } from './QueueTable';
import { EmptyState } from './EmptyState';
import { BatchActionsBar } from '../../components/BatchActionsBar';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ListChecks, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewQueue() {
  const { t } = useTranslation();
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading } = useDEOApplications({
    status,
    priority,
    search,
  });

  const { batchApprove, isBatchApproving, batchCorrection, isBatchCorrecting } = useBatchActions();

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const apps = data?.data || [];
    if (selectedIds.length === apps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(apps.map((a) => a.id));
    }
  };

  const handleBatchApprove = (remarks?: string) => {
    batchApprove(
      { ids: selectedIds, remarks },
      {
        onSuccess: () => {
          toast.success(`Successfully forwarded ${selectedIds.length} applications to Verifier queue.`);
          setSelectedIds([]);
        },
      }
    );
  };

  const handleBatchCorrection = (reason: string, remarks?: string) => {
    batchCorrection(
      { ids: selectedIds, reason, remarks },
      {
        onSuccess: () => {
          toast.success(`Flagged ${selectedIds.length} applications for citizen correction.`);
          setSelectedIds([]);
        },
      }
    );
  };

  const handleResetFilters = () => {
    setStatus('all');
    setPriority('all');
    setSearch('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ListChecks className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl font-black text-white">
              {t('deo.queue')}
            </h1>
            <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Maker Desk
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AI-extracted deed applications ready for exception verification and revenue forwarding
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl">
            <span className="text-slate-400">Total in Queue:</span>
            <span className="text-amber-400 font-mono font-bold text-sm">{data?.total || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <QueueFilters
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        search={search}
        onSearchChange={setSearch}
        onReset={handleResetFilters}
      />

      {/* Table / Empty State */}
      {isLoading ? (
        <SkeletonLoader type="table" rows={6} />
      ) : data?.data && data.data.length > 0 ? (
        <QueueTable
          applications={data.data}
          selectedIds={selectedIds}
          onSelectToggle={handleSelectToggle}
          onSelectAll={handleSelectAll}
        />
      ) : (
        <EmptyState onReset={handleResetFilters} />
      )}

      {/* Floating Batch Action Toolbar */}
      <BatchActionsBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onBatchApprove={handleBatchApprove}
        onBatchCorrection={handleBatchCorrection}
        isProcessing={isBatchApproving || isBatchCorrecting}
      />
    </div>
  );
}
