import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export interface TimelineStep {
  title: string;
  description: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming' | 'rejected';
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isRejected = step.status === 'rejected';

        return (
          <div key={idx} className="relative flex items-start gap-4">
            {idx < steps.length - 1 && (
              <div
                className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            )}
            <div className="z-10 flex-shrink-0">
              {isCompleted && (
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {isCurrent && (
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center animate-pulse shadow-md shadow-blue-500/30">
                  <Clock className="w-4 h-4" />
                </div>
              )}
              {isRejected && (
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {step.status === 'upcoming' && (
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
              )}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <h4
                  className={`text-sm font-semibold ${
                    isCurrent
                      ? 'text-blue-600 dark:text-blue-400'
                      : isCompleted
                      ? 'text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {step.title}
                </h4>
                {step.timestamp && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    {step.timestamp}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
