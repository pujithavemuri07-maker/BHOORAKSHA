import React from 'react';
import { GitFork, CheckCircle2, Clock, ArrowRight, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MutationStatusWorkflow: React.FC = () => {
  const steps = [
    { label: 'Registration SRO', sub: 'Completed at Sub-Registrar', status: 'COMPLETED' },
    { label: 'DEO Verification', sub: 'Current Patwari Scrutiny', status: 'CURRENT' },
    { label: 'Revenue Verifier', sub: 'Girdawar / RI Scrutiny', status: 'PENDING' },
    { label: 'Revenue Approval', sub: 'Tahsildar Digital Sign', status: 'PENDING' },
    { label: 'RoR Record Update', sub: 'Passbook / 1B Dispatch', status: 'PENDING' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mutation Status & Statutory Lifecycle
            </h3>
            <p className="text-xs text-slate-400">
              State revenue administration workflow (Dakhil Kharij / Namantaran / RoR Mutation)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Ref: <strong className="text-amber-400">MUT-2026-0091</strong>
          </span>
          <span className="text-[11px] font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            Stage 2 of 5
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Transaction Type</span>
          <p className="text-sm font-bold font-mono text-white">CONVEYANCE / SALE</p>
          <span className="text-[11px] text-slate-400">Deed #SD-2025-045</span>
        </div>

        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">SRO Registration</span>
          <p className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </p>
          <span className="text-[11px] text-slate-400">Doc REG-2025-789</span>
        </div>

        <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Stage</span>
          <p className="text-sm font-bold text-amber-400">DEO Verification</p>
          <span className="text-[11px] text-amber-500/80 font-mono">Awaiting DEO Forward</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Next Stage</span>
          <p className="text-sm font-bold text-slate-300">Revenue Verifier</p>
          <span className="text-[11px] text-slate-500">Girdawar / RI Queue</span>
        </div>
      </div>

      {/* Horizontal / Responsive Step Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
        {steps.map((st, idx) => {
          const isDone = st.status === 'COMPLETED';
          const isCurr = st.status === 'CURRENT';

          return (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-2xl border text-xs space-y-1 relative transition-all',
                isDone
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : isCurr
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-60'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold">Step 0{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurr ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <p className={cn('font-bold', isCurr ? 'text-amber-400' : isDone ? 'text-white' : 'text-slate-400')}>
                {st.label}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {st.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
