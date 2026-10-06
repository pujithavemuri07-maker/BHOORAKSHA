import React from 'react';
import { Scale, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck, ExternalLink, Info, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LegalEncumbranceStatusProps {
  onRequestLegal: () => void;
}

export const LegalEncumbranceStatus: React.FC<LegalEncumbranceStatusProps> = ({ onRequestLegal }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Legal & Encumbrance Status (30-Year Search)
            </h3>
            <p className="text-xs text-slate-400">
              Automated encumbrance certificate (EC) ledger analysis and civil litigation cross-checks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Encumbrance: Review Required
          </span>

          <button
            type="button"
            onClick={onRequestLegal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>REQUEST LEGAL REVIEW</span>
          </button>
        </div>
      </div>

      {/* Grid of Legal Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Encumbrance Status</span>
          <p className="text-sm font-bold text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Review Required
          </p>
          <span className="text-[11px] text-slate-400 block">EC 1996 - 2026</span>
        </div>

        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Mortgage / Bank Charge</span>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            None Found
          </p>
          <span className="text-[11px] text-slate-400 block">Discharged 14-Nov-2025</span>
        </div>

        <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Court Case / Injunction</span>
          <p className="text-sm font-bold text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Pending Verification
          </p>
          <span className="text-[11px] text-slate-400 block">O.S. 44/2023 Advisory</span>
        </div>

        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Prohibited (Sec 22A)</span>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            None Detected
          </p>
          <span className="text-[11px] text-slate-400 block">Non-Waqf / Non-Govt</span>
        </div>

        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Third-Party Claim</span>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            None Found
          </p>
          <span className="text-[11px] text-slate-400 block">0 Active Caveats</span>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-purple-300 font-semibold block">
            Statutory Legal Decision Boundary
          </strong>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            AI checks available digitised registration and encumbrance records. Final legal and administrative title decisions remain exclusively with the authorized statutory revenue and registration officers. The AI engine does not independently certify legal ownership or guarantee title validity.
          </p>
        </div>
      </div>
    </div>
  );
};
