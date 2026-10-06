import React, { useState } from 'react';
import { LegalApplication } from '../../api/types';
import { CheckCircle2, AlertTriangle, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { ClearModal } from '../../components/ClearModal';
import { FlagModal } from '../../components/FlagModal';
import { BlockModal } from '../../components/BlockModal';
import { EscalateModal } from '../../components/EscalateModal';

interface DecisionActionsProps {
  application: LegalApplication;
  onClear: (opinion: string) => void;
  onFlag: (data: { reason: string; opinion: string }) => void;
  onBlock: (data: { reason: string; opinion: string; legalReferences: string[] }) => void;
  onEscalate: (remarks: string) => void;
  isSubmitting?: boolean;
}

export const DecisionActions: React.FC<DecisionActionsProps> = ({
  application,
  onClear,
  onFlag,
  onBlock,
  onEscalate,
  isSubmitting = false,
}) => {
  const [modalType, setModalType] = useState<
    'clear' | 'flag' | 'block' | 'escalate' | null
  >(null);

  const isProcessed = application.status !== 'pending_legal_review';

  return (
    <>
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Statutory Legal Determination (अंतिम विधिक निर्णय)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Record formal quasi-judicial finding. All actions are cryptographically sealed with Class-3 DSC.
            </p>
          </div>
          {isProcessed && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              Already Determined: {application.status.toUpperCase()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Action 1: Clear Title */}
          <button
            type="button"
            onClick={() => setModalType('clear')}
            disabled={isSubmitting}
            className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex flex-col items-start text-left gap-2 transition-all group shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 font-bold uppercase">Sanction</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Sanction Clear Title</div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">
                Marketable title, route for mutation
              </div>
            </div>
          </button>

          {/* Action 2: Flag */}
          <button
            type="button"
            onClick={() => setModalType('flag')}
            disabled={isSubmitting}
            className="p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex flex-col items-start text-left gap-2 transition-all group shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-amber-400/80 font-bold uppercase">Rectify</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Flag for Rectification</div>
              <div className="text-[11px] text-amber-400/80 mt-0.5">
                Call for link deeds / 15-day notice
              </div>
            </div>
          </button>

          {/* Action 3: Block */}
          <button
            type="button"
            onClick={() => setModalType('block')}
            disabled={isSubmitting}
            className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 flex flex-col items-start text-left gap-2 transition-all group shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-2 rounded-lg bg-red-500/20 text-red-400 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-red-400/80 font-bold uppercase">Prohibit</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Issue Legal Block</div>
              <div className="text-[11px] text-red-400/80 mt-0.5">
                Section 22-A / Court stay invalidation
              </div>
            </div>
          </button>

          {/* Action 4: Escalate */}
          <button
            type="button"
            onClick={() => setModalType('escalate')}
            disabled={isSubmitting}
            className="p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 flex flex-col items-start text-left gap-2 transition-all group shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-purple-400/80 font-bold uppercase">Escalate</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Escalate to Tehsildar</div>
              <div className="text-[11px] text-purple-400/80 mt-0.5">
                Refer dispute to Revenue Authority
              </div>
            </div>
          </button>
        </div>
      </div>

      {modalType === 'clear' && (
        <ClearModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={application.id}
          onConfirm={(opinion) => {
            onClear(opinion);
            setModalType(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {modalType === 'flag' && (
        <FlagModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={application.id}
          onConfirm={(data) => {
            onFlag(data);
            setModalType(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {modalType === 'block' && (
        <BlockModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={application.id}
          onConfirm={(data) => {
            onBlock(data);
            setModalType(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {modalType === 'escalate' && (
        <EscalateModal
          isOpen={true}
          onClose={() => setModalType(null)}
          applicationId={application.id}
          onConfirm={(remarks) => {
            onEscalate(remarks);
            setModalType(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};
