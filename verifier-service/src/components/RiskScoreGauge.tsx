import { cn } from '../lib/utils';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { classifyRisk } from '../utils/riskClassification';

interface RiskScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskScoreGauge = ({ score, size = 'md', showLabel = true }: RiskScoreGaugeProps) => {
  const classification = classifyRisk(score);
  const { badgeText: text, badgeBg: bg, riskLabel: label } = classification;

  if (size === 'sm') {
    return (
      <span className={cn('inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded border whitespace-nowrap', bg, text, classification.badgeBorder)}>
        {score}/100
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={cn('p-4 rounded-xl border flex items-center justify-between', bg, classification.badgeBorder)}>
        <div className="flex items-center gap-3">
          {score < 50 ? (
            <AlertOctagon className={cn('w-8 h-8', text)} />
          ) : score < 75 ? (
            <AlertTriangle className={cn('w-8 h-8', text)} />
          ) : (
            <ShieldCheck className={cn('w-8 h-8', text)} />
          )}
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Review Priority</div>
            <div className={cn('text-2xl font-black tracking-tight', text)}>
              {score} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border', bg, text, classification.badgeBorder)}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={cn('font-bold font-mono', text)}>{score}/100</span>
      {showLabel && (
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold border whitespace-nowrap', bg, text, classification.badgeBorder)}>
          {label}
        </span>
      )}
    </div>
  );
};
