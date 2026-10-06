import { useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { ApproveModal } from './ApproveModal';
import { RejectModal } from './RejectModal';

interface BatchActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBatchApprove: (ids: string[], remarks?: string) => void;
  onBatchReject: (ids: string[], reason: string, remarks: string) => void;
  isLoading?: boolean;
}

export const BatchActionsBar = ({
  selectedIds,
  onClearSelection,
  onBatchApprove,
  onBatchReject,
  isLoading = false,
}: BatchActionsBarProps) => {
  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl px-6 py-3.5 flex items-center gap-6 animate-in slide-in-from-bottom-5 duration-200">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <div className="text-sm font-semibold text-white">
            <span className="font-mono text-amber-400 font-bold text-base mr-1.5">
              {selectedIds.length}
            </span>
            {selectedIds.length === 1 ? 'case selected' : 'cases selected'}
          </div>
        </div>

        <div className="h-6 w-px bg-slate-700" />

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setModalType('approve')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Bulk Approve & Mutation</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType('reject')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>Bulk Reject</span>
          </button>
        </div>

        <div className="h-6 w-px bg-slate-700" />

        <button
          type="button"
          onClick={onClearSelection}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {modalType === 'approve' && (
        <ApproveModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={`${selectedIds.length} Selected Cases`}
          onConfirm={(remarks) => {
            onBatchApprove(selectedIds, remarks);
            setModalType(null);
          }}
          isSubmitting={isLoading}
        />
      )}

      {modalType === 'reject' && (
        <RejectModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={`${selectedIds.length} Selected Cases`}
          onConfirm={(reason, remarks) => {
            onBatchReject(selectedIds, reason, remarks);
            setModalType(null);
          }}
          isSubmitting={isLoading}
        />
      )}
    </>
  );
};
