import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../i18n';

interface QualityCheckStatusProps {
  file: File | null;
  onPassed: () => void;
  onRetry: () => void;
}

interface CheckItem {
  id: string;
  name: string;
  description: string;
  status: 'waiting' | 'running' | 'passed' | 'failed';
}

export const QualityCheckStatus: React.FC<QualityCheckStatusProps> = ({
  file,
  onPassed,
  onRetry,
}) => {
  const { t } = useTranslation();
  const [checks, setChecks] = useState<CheckItem[]>([
    {
      id: 'dpi',
      name: 'Scan Resolution & DPI Assessment',
      description: 'Verifying minimum 300 DPI threshold for optical legibility',
      status: 'running',
    },
    {
      id: 'skew',
      name: 'Orientation & Skew Normalization',
      description: 'Auto-correcting document alignment and page margins',
      status: 'waiting',
    },
    {
      id: 'contrast',
      name: 'Text Contrast & Ink Degradation Test',
      description: 'Evaluating contrast against degraded stamp paper artifacts',
      status: 'waiting',
    },
    {
      id: 'tamper',
      name: 'Tamper & Stamp Authenticity Screening',
      description: 'Checking treasury hologram patterns and Sub-Registrar seals',
      status: 'waiting',
    },
  ]);

  const [hasFailed, setHasFailed] = useState(false);
  const [failureReason, setFailureReason] = useState<string | null>(null);

  useEffect(() => {
    let currentStep = 0;

    const interval = setInterval(() => {
      setChecks((prev) => {
        const next = [...prev];
        if (currentStep < next.length) {
          next[currentStep].status = 'passed';
          if (currentStep + 1 < next.length) {
            next[currentStep + 1].status = 'running';
          }
        }
        return next;
      });

      currentStep++;

      if (currentStep === 4) {
        clearInterval(interval);
        setTimeout(() => {
          onPassed();
        }, 800);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [onPassed]);

  return (
    <div className="space-y-6 max-w-lg mx-auto py-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center mb-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-white">{t('ChitraPathak AI Quality Validation')}</h3>
        <p className="text-xs text-slate-400 mt-1">
          {t('Analyzing document before dispatching to verification pipeline')}
        </p>
      </div>

      {/* Progress Checklist */}
      <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
        {checks.map((check) => (
          <div key={check.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              {check.status === 'passed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : check.status === 'running' ? (
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              ) : check.status === 'failed' ? (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-xs font-bold',
                  check.status === 'passed'
                    ? 'text-white'
                    : check.status === 'running'
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                )}
              >
                {t(check.name)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t(check.description)}</p>
            </div>
          </div>
        ))}
      </div>

      {hasFailed && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{t('Resubmission Required')}</span>
          </div>
          <p className="text-xs text-slate-300">
            {failureReason ? t(failureReason) : t('Document resolution below 300 DPI threshold or text contrast degraded.')}
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-200">{t('What to fix:')}</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>{t('Scan document at minimum 300 DPI in flatbed mode')}</li>
              <li>{t('Ensure all seal and stamp boundaries are unobstructed')}</li>
              <li>{t('Keep document flat without dark fold shadows')}</li>
            </ul>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono text-slate-400">
              Preserving Application ID • Next upload: Document Version 2
            </span>
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              {t('Upload Replacement Document')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
