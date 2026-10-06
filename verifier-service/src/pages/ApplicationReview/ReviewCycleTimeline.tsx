import React from 'react';
import { ActionHistoryItem } from '../../api/types';
import { RotateCcw, CheckCircle, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';

interface ReviewCycleTimelineProps {
  currentCycle?: number;
  actionHistory?: ActionHistoryItem[];
}

export const ReviewCycleTimeline: React.FC<ReviewCycleTimelineProps> = ({
  currentCycle = 1,
  actionHistory = [],
}) => {
  // Group action history by review cycle
  const cycleMap: Record<number, ActionHistoryItem[]> = {};

  actionHistory.forEach((item) => {
    const cycle = item.reviewCycle || 1;
    if (!cycleMap[cycle]) cycleMap[cycle] = [];
    cycleMap[cycle].push(item);
  });

  const availableCycles = Object.keys(cycleMap)
    .map(Number)
    .sort((a, b) => a - b);

  if (availableCycles.length === 0) {
    availableCycles.push(1);
  }

  return (
    <div id="section-cycles" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              REVIEW CYCLE TIMELINE & AUDIT TRAIL HISTORY
            </h3>
            <p className="text-xs text-slate-400">
              Multi-cycle verification history tracking returns, corrections & resubmissions
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
          Current Review Cycle #{currentCycle}
        </span>
      </div>

      <div className="space-y-4">
        {availableCycles.map((cycleNum) => {
          const items = cycleMap[cycleNum] || [];
          const isCurrent = cycleNum === currentCycle;

          return (
            <div
              key={cycleNum}
              className={`p-4 rounded-2xl border space-y-3 ${
                isCurrent
                  ? 'bg-slate-950/80 border-slate-700 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-black font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Cycle #{cycleNum} Progression
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {items.length} Action Events Preserved
                </span>
              </div>

              <div className="space-y-2.5">
                {items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{item.action}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {item.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">"{item.remarks}"</p>
                    </div>

                    <div className="text-right text-[10px] font-mono text-slate-400">
                      <div>Actor: <span className="text-slate-200">{item.actor}</span></div>
                      <div>{new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
