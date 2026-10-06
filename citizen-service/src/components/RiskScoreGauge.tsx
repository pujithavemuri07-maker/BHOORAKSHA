import React from 'react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n';

interface RiskScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const { t } = useTranslation();
  const clampedScore = Math.max(0, Math.min(100, score));

  const getColor = () => {
    if (clampedScore >= 80) return 'text-emerald-500';
    if (clampedScore >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getCategory = () => {
    if (clampedScore >= 80) return t('Low Review Priority');
    if (clampedScore >= 50) return t('Medium Review Priority');
    return t('High Review Priority');
  };

  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-lg',
    lg: 'w-32 h-32 text-xl',
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-slate-200 dark:text-slate-800"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className={cn('transition-all duration-1000 ease-out', getColor())}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className={cn('font-black tracking-tight text-slate-900 dark:text-white', {
              'text-sm': size === 'sm',
              'text-xl': size === 'md',
              'text-3xl': size === 'lg',
            })}
          >
            {clampedScore}
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
          )}
        </div>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('Review Priority')}
          </p>
          <p className={cn('text-xs font-bold mt-0.5', getColor())}>
            {getCategory()}
          </p>
        </div>
      )}
    </div>
  );
};
