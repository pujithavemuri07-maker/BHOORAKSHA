import React from 'react';
import { DEOCorrectionItem } from '../../api/types';
import { FileEdit, ArrowRight, UserCheck, Calendar } from 'lucide-react';

interface DEOCorrectionsPanelProps {
  deoName?: string;
  deoRemarks?: string;
  forwardedAt?: string;
  corrections?: DEOCorrectionItem[];
  onViewSource?: (docTypeKey: string, pageNumber?: number) => void;
}

export const DEOCorrectionsPanel: React.FC<DEOCorrectionsPanelProps> = ({
  deoName,
  deoRemarks,
  forwardedAt,
  corrections = [
    {
      id: 'c1',
      field: 'Purchaser Surname / Pattadar Name',
      aiOriginalValue: 'Ramesh Kumar',
      deoCorrectedValue: 'Ramesh Kumar Patel',
      sourceDoc: 'RoR / Pattadar Record',
      sourcePage: 1,
      reason: 'Surname verified against RoR register entry #88214 & Aadhaar document.',
      timestamp: '2026-09-07T14:28:00Z',
      deoOfficer: 'Suresh G. Patil (Senior DEO / Patwari)',
    },
  ],
  onViewSource,
}) => {
  return (
    <div id="section-deo" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <FileEdit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              DEO (MAKER) ENDORSEMENT & FIELD CORRECTIONS
            </h3>
            <p className="text-xs text-slate-400">
              Audit trail of data corrections made by Village Revenue Officer during initial scrutiny
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <UserCheck className="w-4 h-4 text-sky-400" />
          <span>DEO: <strong className="text-slate-200 font-semibold">{deoName || 'Suresh G. Patil (VRO)'}</strong></span>
        </div>
      </div>

      {/* DEO Remarks Note */}
      {deoRemarks && (
        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">DEO Endorsement Remarks</span>
          <p className="italic text-slate-300 font-sans">"{deoRemarks}"</p>
          {forwardedAt && (
            <span className="text-[10px] text-slate-500 font-mono block pt-1">
              Forwarded Date: {new Date(forwardedAt).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Before / After Correction Table */}
      {corrections && corrections.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <FileEdit className="w-3.5 h-3.5" />
            BEFORE / AFTER CORRECTION SCORING
          </h4>

          <div className="space-y-2">
            {corrections.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-100">{item.field}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Doc: {item.sourceDoc} (Page {item.sourcePage})
                    </span>
                    {onViewSource && (
                      <button
                        onClick={() => onViewSource(item.sourceDoc, item.sourcePage)}
                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 text-[10px] font-semibold transition-all"
                      >
                        VIEW SOURCE
                      </button>
                    )}
                  </div>
                </div>

                {/* Before / After Comparison Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-rose-500/30 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-rose-400 block">BEFORE (AI Extraction Original)</span>
                    <span className="font-mono text-slate-300 font-medium text-xs block">{item.aiOriginalValue}</span>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block">AFTER (DEO Corrected Value)</span>
                    <span className="font-mono text-emerald-300 font-bold text-xs block">{item.deoCorrectedValue}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-300">Correction Reason:</span> {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
