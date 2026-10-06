import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { ClearModal } from './ClearModal';
import { FlagModal } from './FlagModal';
import { BlockModal } from './BlockModal';

interface BatchActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBatchClear: (ids: string[], opinion: string) => void;
  onBatchFlag: (ids: string[], reason: string, opinion: string) => void;
  onBatchBlock: (ids: string[], reason: string, opinion: string, citations: string[]) => void;
  isLoading?: boolean;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedIds,
  onClearSelection,
  onBatchClear,
  onBatchFlag,
  onBatchBlock,
  isLoading = false,
}) => {
  const [modalType, setModalType] = useState<'clear' | 'flag' | 'block' | null>(null);

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl px-6 py-3.5 flex items-center gap-6 animate-in slide-in-from-bottom-5 duration-200">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <div className="text-sm font-semibold text-white">
            <span className="font-mono text-indigo-400 font-bold text-base mr-1.5">
              {selectedIds.length}
            </span>
            {selectedIds.length === 1 ? 'case selected' : 'cases selected'}
          </div>
        </div>

        <div className="h-6 w-px bg-slate-700" />

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setModalType('clear')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Bulk Clear Title</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType('flag')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Bulk Flag</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType('block')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Bulk Block</span>
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

      {modalType === 'clear' && (
        <ClearModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={`${selectedIds.length} Selected Applications`}
          onConfirm={(opinion) => {
            onBatchClear(selectedIds, opinion);
            setModalType(null);
          }}
          isSubmitting={isLoading}
        />
      )}

      {modalType === 'flag' && (
        <FlagModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={`${selectedIds.length} Selected Applications`}
          onConfirm={({ reason, opinion }) => {
            onBatchFlag(selectedIds, reason, opinion);
            setModalType(null);
          }}
          isSubmitting={isLoading}
        />
      )}

      {modalType === 'block' && (
        <BlockModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={`${selectedIds.length} Selected Applications`}
          onConfirm={({ reason, opinion, legalReferences }) => {
            onBatchBlock(selectedIds, reason, opinion, legalReferences);
            setModalType(null);
          }}
          isSubmitting={isLoading}
        />
      )}
    </>
  );
};
