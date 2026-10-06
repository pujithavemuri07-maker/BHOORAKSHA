import React, { useState } from 'react';
import { History, ShieldCheck, Lock, Copy, Check, Clock, User, ArrowRight, ChevronDown, ChevronUp, Info, GitCommit } from 'lucide-react';
import { VerifierApplication, ActionHistoryItem } from '../../api/types';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface ActionHistoryTimelineProps {
  application: VerifierApplication;
}

export const ActionHistoryTimeline: React.FC<ActionHistoryTimelineProps> = ({ application }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const historyItems: ActionHistoryItem[] = application.actionHistory || [];

  const handleCopy = (hashText: string) => {
    navigator.clipboard.writeText(hashText);
    setCopiedHash(hashText);
    toast.success('SHA-256 cryptographic digest copied');
    setTimeout(() => setCopiedHash(null), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Permanent Action History & Tamper-Evident Ledger
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full font-mono">
                v{application.versionNumber || historyItems.length || 1} • SHA-256 Audit Chain
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Non-destructive chronological audit chain recording all officer transitions and reasons
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-semibold"
        >
          <span>{isExpanded ? 'Collapse Ledger' : 'Expand Ledger'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {historyItems.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">
              No previous verification actions recorded for this application.
            </p>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-4 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {historyItems.map((item, idx) => {
                const isLatest = idx === 0;

                return (
                  <div key={item.id || idx} className="relative group">
                    {/* Dot */}
                    <div
                      className={cn(
                        'absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold font-mono transition-transform',
                        isLatest
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 border-slate-600 text-slate-300'
                      )}
                    >
                      v{item.versionNumber || historyItems.length - idx}
                    </div>

                    {/* Card */}
                    <div
                      className={cn(
                        'p-4 rounded-2xl border transition-all space-y-2.5',
                        isLatest
                          ? 'bg-slate-950/90 border-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800'
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-white">{item.action}</strong>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                            Cycle {item.reviewCycle || 1}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>

                      {/* Who & Role */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">WHO (Officer)</span>
                          <span className="font-semibold text-white">{item.actor}</span>
                          <span className="text-[11px] text-slate-400 block">{item.role}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Status Transition</span>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] mt-0.5">
                            <span className="text-slate-400">{item.previousStatus}</span>
                            <ArrowRight className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">{item.newStatus}</span>
                          </div>
                        </div>
                      </div>

                      {/* Remarks / Why */}
                      <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/90 text-xs text-slate-200">
                        <span className="text-slate-500 uppercase font-bold text-[10px] block mb-0.5">
                          OFFICIAL FINDINGS & REMARKS (WHY):
                        </span>
                        <p className="text-[11px] leading-relaxed italic">"{item.remarks}"</p>
                        {item.requiredCorrection && (
                          <p className="text-[11px] text-amber-400 font-medium mt-1">
                            Required Correction: {item.requiredCorrection}
                          </p>
                        )}
                        {item.requestedDoc && (
                          <p className="text-[11px] text-slate-400 font-medium">
                            Requested Document: {item.requestedDoc}
                          </p>
                        )}
                      </div>

                      {/* Cryptographic SHA-256 Digest */}
                      <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
                        <div className="truncate">
                          <span className="text-slate-500 uppercase font-bold mr-1">SHA-256:</span>
                          <span className="text-amber-400 truncate">{item.auditHash}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.auditHash)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0"
                          title="Copy Hash"
                        >
                          {copiedHash === item.auditHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Append-Only Audit Guarantee:</strong> Verifier actions (approvals, returns, rejections, escalations) append immutable block digests into this chain. Past decisions remain permanently visible even after multiple review cycles.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
