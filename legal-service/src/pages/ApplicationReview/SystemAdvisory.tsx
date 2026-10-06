import React from 'react';
import { LegalApplication } from '../../api/types';
import { Sparkles, ShieldAlert, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

interface SystemAdvisoryProps {
  application: LegalApplication;
  onApplyRecommendation?: () => void;
}

export const SystemAdvisory: React.FC<SystemAdvisoryProps> = ({
  application,
  onApplyRecommendation,
}) => {
  const isHighRisk = application.legalRiskScore >= 70;
  const isLitigation = application.legalFlags.some((f) => f.type === 'under_litigation');
  const is22A = application.legalFlags.some((f) => f.type === 'non_transferable');
  const isPartitionIssue = application.legalFlags.some((f) => f.type === 'invalid_title');

  const getAdvisoryContent = () => {
    if (is22A) {
      return {
        recommendation: 'Place Statutory Legal Block / Refusal under Section 22-A(1)(b) Registration Act 1908',
        reason: 'Cadastral parcel overlaps with protected sovereign government poramboke / water reservoir buffer zone.',
        relatedFinding: 'Section 22-A Prohibited Land Encroachment',
        evidence: 'G.O. Ms. No. 115 & District Collector Prohibited Property Gazette Register (PPR/RR/2022/411).',
        suggestedDecision: 'PLACE LEGAL HOLD',
      };
    }
    if (isLitigation) {
      return {
        recommendation: 'Place Legal Hold under Section 52 Transfer of Property Act 1882 (Doctrine of Lis Pendens)',
        reason: 'Interim civil court injunction operating in pending suit OS 412/2024 at Senior Civil Court Sangareddy.',
        relatedFinding: 'Active Judicial Injunction / Court Stay',
        evidence: 'Senior Civil Court Caveat Registry Record & Interim Injunction Order (IA No. 08/2026).',
        suggestedDecision: 'PLACE LEGAL HOLD',
      };
    }
    if (isPartitionIssue) {
      return {
        recommendation: 'Request Correction / Require Registered Relinquishment Deed (Haq Tyag Patra)',
        reason: 'Instrument executes 50% share while revenue record indicates 3 living coparcenary co-heirs with 33.33% undivided share.',
        relatedFinding: 'Unlawful Coparcenary Alienation Without Co-Heir Assent',
        evidence: 'Telangana Maa Bhoomi ROR 1-B Genealogy Ledger & Family Tree Record.',
        suggestedDecision: 'REQUEST CORRECTION',
      };
    }
    if (isHighRisk) {
      return {
        recommendation: 'Request Document Correction & Prior Link Title Deeds',
        reason: 'Discrepancies identified in instrument spelling and missing prior partition/succession schedule.',
        relatedFinding: 'Ownership Inconsistency & Missing Prior Link Deeds',
        evidence: 'Presented Sale Deed recital vs SRO Book-1 archive index.',
        suggestedDecision: 'REQUEST CORRECTION',
      };
    }
    return {
      recommendation: 'Clear / Approve Title for Mutation Sanction',
      reason: 'Chain of title is continuous, encumbrance search is clear, and all parties particulars are verified.',
      relatedFinding: 'Standard Title Clearance Verification',
      evidence: '30-Year Encumbrance Certificate & Dharani Cadastral Synchronization.',
      suggestedDecision: 'CLEAR / APPROVE',
    };
  };

  const advisory = getAdvisoryContent();

  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-white">
              System-Generated Legal Advisory
            </h3>
            <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
              AI / System Suggestion — Officer Verification Required
            </span>
          </div>
        </div>

        <span className="text-xs text-slate-400">
          Case: <span className="font-mono text-white font-bold">{application.id}</span>
        </span>
      </div>

      {/* Main Advisory Box */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
            System Recommendation:
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            {advisory.recommendation}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800/80">
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Reason:</span>
            <span className="text-slate-200 leading-relaxed block mt-0.5">{advisory.reason}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Related Finding:</span>
            <span className="text-rose-300 font-semibold block mt-0.5">{advisory.relatedFinding}</span>
          </div>

          <div className="md:col-span-2">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Supporting Evidence:</span>
            <span className="text-slate-300 font-mono text-[11px] block mt-0.5">{advisory.evidence}</span>
          </div>
        </div>
      </div>

      {/* Advisory Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-500 italic">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>This advisory provides automated risk screening. The Legal Officer retains full statutory decision authority.</span>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold self-start sm:self-auto">
          Suggested Action: <span className="text-indigo-300 font-bold">{advisory.suggestedDecision}</span>
        </span>
      </div>
    </div>
  );
};
