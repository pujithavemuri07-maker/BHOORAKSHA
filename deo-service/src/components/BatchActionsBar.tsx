import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { CheckSquare, AlertTriangle, Send, X } from 'lucide-react';

interface BatchActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onBatchApprove: (remarks?: string) => void;
  onBatchCorrection: (reason: string, remarks?: string) => void;
  isProcessing?: boolean;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedCount,
  onClear,
  onBatchApprove,
  onBatchCorrection,
  isProcessing = false,
}) => {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState<'approve' | 'correction' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [reason, setReason] = useState('Missing / Incomplete Required Schedules');

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 animate-slide-up">
      <div className="bg-slate-900 border border-amber-500/30 text-white rounded-2xl shadow-2xl p-4 max-w-2xl w-full flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              {selectedCount} Application{selectedCount > 1 ? 's' : ''} Selected
            </p>
            <p className="text-[11px] text-slate-400">Apply batch actions across selection</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onBatchApprove('Batch verified and forwarded by DEO')}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Batch Forward
          </button>

          <button
            onClick={() => onBatchCorrection(reason, 'Batch correction requested by DEO')}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Batch Flag
          </button>

          <button
            onClick={onClear}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
