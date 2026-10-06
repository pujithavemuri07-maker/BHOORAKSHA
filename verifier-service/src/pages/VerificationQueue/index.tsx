import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useVerifierQueue } from '../../hooks/useVerifierQueue';
import { useVerifierStore } from '../../store/verifierStore';
import { useBatchActions } from '../../hooks/useBatchActions';
import { QueueFilters } from './QueueFilters';
import { QueueTable } from './QueueTable';
import { EmptyState } from './EmptyState';
import { BatchActions } from './BatchActions';
import { SkeletonLoader } from '../../components/SkeletonLoader';

export default function VerificationQueuePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [source, setSource] = useState('all');

  const { data, isLoading } = useVerifierQueue({
    filter: initialFilter !== 'all' ? initialFilter : undefined,
    status,
    priority,
    source,
    search,
  });

  const selectedIds = useVerifierStore((s) => s.selectedApplicationIds);
  const toggleSelect = useVerifierStore((s) => s.toggleSelectApplication);
  const selectAll = useVerifierStore((s) => s.selectAllApplications);
  const clearSelection = useVerifierStore((s) => s.clearSelection);

  const { batchApprove, isBatchApproving, batchReject, isBatchRejecting } = useBatchActions();

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setSource('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight">
            {t('verifier.queue')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('Review and cross-verify medium & high-risk land mutation records against original cadastral registers')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
            {t('Total Assigned:')} <span className="text-emerald-400 font-bold">{data?.total ?? 0}</span>
          </span>
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
            {t('Pending:')} <span className="text-amber-400 font-bold">{data?.pending ?? 0}</span>
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <QueueFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        source={source}
        onSourceChange={setSource}
        onReset={handleResetFilters}
      />

      {/* Queue Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        {isLoading ? (
          <SkeletonLoader type="table" rows={6} />
        ) : !data || data.data.length === 0 ? (
          <EmptyState />
        ) : (
          <QueueTable
            applications={data.data}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
          />
        )}
      </div>

      {/* Batch Floating Action Bar */}
      <BatchActions
        selectedIds={selectedIds}
        onClear={clearSelection}
        onBatchApprove={(ids, remarks) => batchApprove({ ids, remarks })}
        onBatchReject={(ids, reason, remarks) => batchReject({ ids, reason, remarks })}
        isApproving={isBatchApproving}
        isRejecting={isBatchRejecting}
      />
    </div>
  );
}
