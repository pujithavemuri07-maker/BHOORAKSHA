import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, BrainCircuit, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

import { classifyRisk } from '../../utils/riskClassification';

interface AIRiskBreakdownProps {
  score: number;
}

export const AIRiskBreakdown: React.FC<AIRiskBreakdownProps> = ({ score }) => {
  const [showReasoning, setShowReasoning] = useState(false);
  const risk = classifyRisk(score);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Risk Breakdown & Explainability
              </h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                ChitraPathak-1 Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic statutory risk decomposition computed across land record rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowReasoning(!showReasoning)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showReasoning ? 'Hide AI Reasoning' : 'View AI Reasoning'}</span>
            {showReasoning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Score and Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Score Summary */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Review Priority
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={cn('text-3xl font-black font-mono', risk.textClass)}>{risk.riskScore}</span>
              <span className="text-slate-500 font-mono text-sm">/ 100</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Risk Level:</span>
              <span className={cn('font-bold font-mono px-2 py-0.5 rounded border text-[11px]', risk.badgeClass)}>
                {risk.riskLabel}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status:</span>
              <span className={cn('font-bold font-mono px-2 py-0.5 rounded border text-[11px]', risk.badgeClass)}>
                {risk.statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Positive Checks (+ Points) */}
        <div className="bg-slate-950/70 border border-emerald-950/40 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Positive Checks
            </span>
            <span className="text-[11px] font-bold font-mono text-emerald-400">+50 Pts</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-slate-300">✓ Survey Number Match</span>
              <span className="font-mono font-bold text-emerald-400">+25</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-slate-300">✓ Land Area Match</span>
              <span className="font-mono font-bold text-emerald-400">+20</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-slate-300">✓ Document Quality (&gt;300 DPI)</span>
              <span className="font-mono font-bold text-emerald-400">+5</span>
            </div>
          </div>
        </div>

        {/* Risk Factors (- Points) */}
        <div className="bg-slate-950/70 border border-rose-950/40 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Risk Factors (Penalties)
            </span>
            <span className="text-[11px] font-bold font-mono text-rose-400">-32 Pts</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <span className="text-slate-300">⚠ Owner Name Partial Match</span>
              <span className="font-mono font-bold text-amber-400">-12</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <span className="text-slate-300">✕ Registration Date Mismatch</span>
              <span className="font-mono font-bold text-rose-400">-20</span>
            </div>
            <div className="text-[11px] text-slate-500 italic pt-0.5">
              Base score 50 + 50 (Positive) - 32 (Risks) = 68 / 100
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Explainable AI Reasoning Panel */}
      {showReasoning && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <BrainCircuit className="w-4 h-4" />
            <span>AI Decision Reasoning & Audit Explanation (Explainable AI Engine)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Survey Number Verification
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Survey number <strong>123/456 (Sub-division P-1)</strong> extracted from the submitted deed perfectly matches the official state cadastral record and village spatial map. No overlapping conflicting survey claims exist.
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Owner Name Variation Detected
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Deed lists <strong>"Ramesh Kumar"</strong> while the State Land Records Master Record lists <strong>"Ramesh Kumaran"</strong>. MuRIL Indic NER flagged an 88% phonemic similarity. Requires officer identity voucher review.
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                Registration Execution Date Difference
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The deed shows execution on <strong>20 Dec 2025</strong>, but Central SRO Registry Book reflects sanction on <strong>15 Jan 2026</strong> (a 26-day delta). Flagged for clerical or stamp registry cross-check.
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Duplicate & Collision Check
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Zero parallel mutation petitions or duplicate sales were detected for Survey 123/456 across the preceding 180-day state registry audit index.
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1 md:col-span-2">
              <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                GIS Spatial Status & Final Score Justification
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Mapped area is <strong>2.49 Acres</strong> vs registered <strong>2.50 Acres</strong> (0.01 acre difference, well within the 0.5% statutory tolerance limit). The composite verification score is <strong>68/100 (Medium Risk)</strong> due to the combination of high spatial/survey fidelity (+50) offset by the name variance (-12) and registration date disparity (-20). Final administrative mutation clearance remains subject to DEO/Girdawar approval.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
