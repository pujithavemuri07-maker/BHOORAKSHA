import { useState } from 'react';
import { useTranslation } from '../i18n';
import { CheckSquare, CheckCircle, XCircle, X } from 'lucide-react';
import { REJECT_REASONS } from '../utils/constants';

interface BatchActionsBarProps {
  selectedIds: string[];
  onClear: () => void;
  onBatchApprove: (ids: string[], remarks: string) => void;
  onBatchReject: (ids: string[], reason: string, remarks: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export const BatchActionsBar = ({
  selectedIds,
  onClear,
  onBatchApprove,
  onBatchReject,
  isApproving = false,
  isRejecting = false,
}: BatchActionsBarProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'idle' | 'approve' | 'reject'>('idle');
  const [remarks, setRemarks] = useState('');
  const [rejectReason, setRejectReason] = useState('survey_mismatch');

  if (selectedIds.length === 0) return null;

  const handleApproveSubmit = () => {
    onBatchApprove(selectedIds, remarks || 'Batch approved by Verifier after queue inspection.');
    setMode('idle');
    setRemarks('');
  };

  const handleRejectSubmit = () => {
    onBatchReject(selectedIds, rejectReason, remarks || 'Batch rejected by Verifier.');
    setMode('idle');
    setRemarks('');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom duration-200">
      <div className="bg-slate-900/95 border border-slate-700 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              {selectedIds.length}
            </span>
            <span className="text-sm font-semibold text-slate-200">
              Applications Selected for Batch Action
            </span>
          </div>
          <button
            onClick={onClear}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {mode === 'idle' && (
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setMode('approve')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle className="w-4 h-4" />
              Batch Approve ({selectedIds.length})
            </button>
            <button
              onClick={() => setMode('reject')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-rose-900/30"
            >
              <XCircle className="w-4 h-4" />
              Batch Reject ({selectedIds.length})
            </button>
          </div>
        )}

        {mode === 'approve' && (
          <div className="space-y-3 pt-1 border-t border-slate-800">
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Bulk approval endorsement remarks (optional)..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleApproveSubmit}
                disabled={isApproving}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                {isApproving ? 'Approving...' : `Confirm Bulk Approve (${selectedIds.length})`}
              </button>
              <button
                onClick={() => setMode('idle')}
                className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-xs rounded-lg text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {mode === 'reject' && (
          <div className="space-y-3 pt-1 border-t border-slate-800">
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 outline-none focus:ring-1 focus:ring-rose-500"
            >
              {REJECT_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Required bulk rejection reason..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 outline-none focus:ring-1 focus:ring-rose-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleRejectSubmit}
                disabled={isRejecting}
                className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                {isRejecting ? 'Rejecting...' : `Confirm Bulk Reject (${selectedIds.length})`}
              </button>
              <button
                onClick={() => setMode('idle')}
                className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-xs rounded-lg text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
