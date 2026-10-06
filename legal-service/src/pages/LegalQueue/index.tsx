import React, { useState } from 'react';
import { useLegalQueue } from '../../hooks/useLegalQueue';
import { useLegalStore } from '../../store/legalStore';
import { useBatchActions } from '../../hooks/useBatchActions';
import { QueueFilters } from './QueueFilters';
import { QueueTable } from './QueueTable';
import { EmptyState } from './EmptyState';
import { BatchActionsBar } from '../../components/BatchActionsBar';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Scale } from 'lucide-react';

export const LegalQueuePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  const { data: applications, isLoading } = useLegalQueue({
    search,
    severity,
    status,
    priority,
  });

  const selectedIds = useLegalStore((s) => s.selectedApplicationIds);
  const toggleSelect = useLegalStore((s) => s.toggleSelectApplication);
  const selectAll = useLegalStore((s) => s.selectAllApplications);
  const clearSelection = useLegalStore((s) => s.clearSelection);

  const { batchClear, batchFlag, batchBlock, isLoading: isBatchLoading } = useBatchActions();

  const handleReset = () => {
    setSearch('');
    setSeverity('all');
    setStatus('all');
    setPriority('all');
  };

  return (
    <div className="space-y-5 pb-16 animate-in fade-in duration-200">
      {/* Page Title & Count Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            Legal Review & Title Scrutiny Queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Examine high-risk conveyances, title defects, civil caveats, and statutory prohibitions
          </p>
        </div>

        <div className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
          Showing <span className="font-bold text-indigo-400">{applications?.length || 0}</span> cases
        </div>
      </div>

      {/* Filter Controls */}
      <QueueFilters
        search={search}
        onSearchChange={setSearch}
        severity={severity}
        onSeverityChange={setSeverity}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        onReset={handleReset}
      />

      {/* Table / Loader / Empty */}
      {isLoading ? (
        <SkeletonLoader type="table" rows={5} />
      ) : !applications || applications.length === 0 ? (
        <EmptyState onReset={handleReset} />
      ) : (
        <QueueTable
          applications={applications}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      )}

      {/* Floating Batch Actions Bar */}
      <BatchActionsBar
        selectedIds={selectedIds}
        onClearSelection={clearSelection}
        onBatchClear={(ids, opinion) => batchClear.mutate({ ids, opinion })}
        onBatchFlag={(ids, reason, opinion) => batchFlag.mutate({ ids, reason, opinion })}
        onBatchBlock={(ids, reason, opinion, citations) =>
          batchBlock.mutate({ ids, reason, opinion, legalReferences: citations })
        }
        isLoading={isBatchLoading}
      />
    </div>
  );
};

export default LegalQueuePage;
