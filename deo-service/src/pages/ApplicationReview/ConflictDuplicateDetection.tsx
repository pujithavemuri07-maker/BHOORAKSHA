import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, XCircle, CheckCircle2, ChevronDown, ChevronUp, FileText, Database, GitCompare } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ConflictDuplicateDetection: React.FC = () => {
  const [openIssues, setOpenIssues] = useState<Record<string, boolean>>({
    nameMismatch: true,
    dateConflict: true,
    duplicateCheck: false,
  });

  const toggleIssue = (key: string) => {
    setOpenIssues((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Conflict & Duplicate Detection
            </h3>
            <p className="text-xs text-slate-400">
              Cross-registry duplicate transaction and statutory conflict scans
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Potential Issues Found:</span>
          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
            2 Actionable
          </span>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {/* Issue 1: Owner Name Variation */}
        <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl overflow-hidden">
          <div
            onClick={() => toggleIssue('nameMismatch')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">
                    ⚠ Owner Name Variation Detected
                  </h4>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                    Medium Severity
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  <strong className="text-amber-300 font-mono">Ramesh Kumar</strong> (Deed) ≠ <strong className="text-amber-300 font-mono">Ramesh Kumaran</strong> (Master ROR)
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-1">
              {openIssues.nameMismatch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {openIssues.nameMismatch && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-900/30 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Source Evidence 1: Ingested Sale Deed
                  </span>
                  <p className="text-slate-200 mt-1 font-mono font-medium">
                    "Sri Ramesh Kumar, S/o Late Shankar Patel" (Page 1, Paragraph 2)
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Source Evidence 2: State Land Records Master Record
                  </span>
                  <p className="text-slate-200 mt-1 font-mono font-medium">
                    "Ramesh Kumaran, S/o Shankar Patel" (Khata #KH-88214, ROR-1B)
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-amber-400">AI Diagnostic Reason:</strong> Surname/title variation detected between submitted instrument and state master database. MuRIL Indic NER algorithm calculated an 88% phonemic similarity. Requires DEO manual verification of citizen identity proof (Aadhaar/Voter ID) or gazette name correction affidavit before approving mutation.
              </div>
            </div>
          )}
        </div>

        {/* Issue 2: Registration Date Conflict */}
        <div className="bg-slate-950/70 border border-rose-500/30 rounded-2xl overflow-hidden">
          <div
            onClick={() => toggleIssue('dateConflict')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">
                    ✕ Registration Date Conflict
                  </h4>
                  <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 font-mono">
                    High Severity
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deed Execution: <strong className="text-rose-300 font-mono">20 Dec 2025</strong> ≠ Central Registry Index: <strong className="text-rose-300 font-mono">15 Jan 2026</strong>
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-1">
              {openIssues.dateConflict ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {openIssues.dateConflict && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-900/30 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Source Evidence 1: Deed Stamp Header
                  </span>
                  <p className="text-slate-200 mt-1 font-mono font-medium">
                    Stamp purchase & party execution stamp: 20-12-2025 (Serilingampally SRO)
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Source Evidence 2: Central SRO Book I Index
                  </span>
                  <p className="text-slate-200 mt-1 font-mono font-medium">
                    Formal registration entry date: 15-01-2026 (Document No. REG-2025-789)
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-rose-400">AI Diagnostic Reason:</strong> 26-day discrepancy between the date appearing on the deed's primary preamble and the final Sub-Registrar endorsement date in the official central registry ledger. Officer must check whether this represents normal procedural registration delay or backdated execution.
              </div>
            </div>
          )}
        </div>

        {/* Issue 3: Duplicate Transaction (Clean) */}
        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl overflow-hidden">
          <div
            onClick={() => toggleIssue('duplicateCheck')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">
                    ✓ No Duplicate Survey Transaction Found
                  </h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                    Clear (0 Duplicates)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  180-day parallel registration and mutation lock scan completed across district registry index.
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-1">
              {openIssues.duplicateCheck ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {openIssues.duplicateCheck && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-900/30 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-emerald-400">Automated Search Evidence:</strong> Queried Survey No. 123/456, Gachibowli across all 4 adjacent Sub-Registrar jurisdictions. No concurrent sale deed, gift deed, or pending civil court caveat was recorded within the last 180 days.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
