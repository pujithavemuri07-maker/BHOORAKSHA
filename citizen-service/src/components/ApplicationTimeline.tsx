import React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n';
import { ApplicationStatus } from '../api/types';

interface StepDef {
  key: string;
  statusMatch: ApplicationStatus[];
  label: string;
  desc: string;
  icon: string;
}

const STEPS: StepDef[] = [
  {
    key: 'uploaded',
    statusMatch: ['UPLOADED', 'QUALITY_CHECK', 'AI_PROCESSING', 'CROSS_VERIFICATION', 'RISK_ASSESSMENT', 'HUMAN_REVIEW', 'APPROVED', 'CORRECTION_REQUIRED', 'REJECTED'],
    label: '1. Document Uploaded',
    desc: 'Sale Deed / Passbook ingested into Bhooraksha vault',
    icon: '📄',
  },
  {
    key: 'quality_check',
    statusMatch: ['QUALITY_CHECK', 'AI_PROCESSING', 'CROSS_VERIFICATION', 'RISK_ASSESSMENT', 'HUMAN_REVIEW', 'APPROVED', 'CORRECTION_REQUIRED', 'REJECTED'],
    label: '2. Quality & Tamper Check',
    desc: 'ChitraPathak DPI, clarity & orientation validation',
    icon: '🔍',
  },
  {
    key: 'ai_processing',
    statusMatch: ['AI_PROCESSING', 'CROSS_VERIFICATION', 'RISK_ASSESSMENT', 'HUMAN_REVIEW', 'APPROVED', 'CORRECTION_REQUIRED', 'REJECTED'],
    label: '3. Indic AI & NER Processing',
    desc: 'Multilingual transcription & boundary extraction',
    icon: '🧠',
  },
  {
    key: 'cross_verification',
    statusMatch: ['CROSS_VERIFICATION', 'RISK_ASSESSMENT', 'HUMAN_REVIEW', 'APPROVED', 'REJECTED'],
    label: '4. Govt Record Cross-Verification',
    desc: 'Dharani / Bhoomi cadastral parcel matching',
    icon: '🔗',
  },
  {
    key: 'risk_assessment',
    statusMatch: ['RISK_ASSESSMENT', 'HUMAN_REVIEW', 'APPROVED', 'REJECTED'],
    label: '5. Risk & Caveat Screening',
    desc: 'eCourts litigation, encumbrance & GIS overlap scoring',
    icon: '📊',
  },
  {
    key: 'human_review',
    statusMatch: ['HUMAN_REVIEW', 'APPROVED', 'REJECTED'],
    label: '6. Field Officer Inspection',
    desc: 'Patwari & Girdawar ground truth endorsement',
    icon: '👤',
  },
  {
    key: 'final_approval',
    statusMatch: ['APPROVED'],
    label: '7. Statutory Sanction',
    desc: 'Tehsildar digital signature & mutation seal',
    icon: '✅',
  },
];

interface ApplicationTimelineProps {
  status: ApplicationStatus;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ status }) => {
  const { t } = useTranslation();

  const getStepIndex = (st: ApplicationStatus): number => {
    switch (st) {
      case 'UPLOADED':
        return 0;
      case 'QUALITY_CHECK':
        return 1;
      case 'AI_PROCESSING':
        return 2;
      case 'CROSS_VERIFICATION':
        return 3;
      case 'RISK_ASSESSMENT':
        return 4;
      case 'HUMAN_REVIEW':
        return 5;
      case 'APPROVED':
        return 6;
      case 'CORRECTION_REQUIRED':
        return 1;
      case 'REJECTED':
        return 5;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="relative pl-2 sm:pl-4 py-2">
      {/* Connecting vertical bar */}
      <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700" />

      <div className="space-y-6">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex || (index === 6 && status === 'APPROVED');
          const isActive = index === currentIndex && status !== 'APPROVED';
          const isPending = index > currentIndex;
          const isWarning = status === 'CORRECTION_REQUIRED' && index === 1;
          const isFailed = status === 'REJECTED' && index === currentIndex;

          return (
            <div key={step.key} className="flex items-start gap-4 relative group">
              {/* Step indicator circle */}
              <div
                className={cn(
                  'relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300',
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : isWarning
                    ? 'bg-amber-500 text-white animate-pulse'
                    : isFailed
                    ? 'bg-rose-600 text-white'
                    : isActive
                    ? 'bg-primary-600 text-white ring-4 ring-primary-500/20 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : isWarning ? (
                  <AlertCircle className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-base">{step.icon}</span>
                )}
              </div>

              {/* Step title & description */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={cn(
                      'text-sm font-bold',
                      isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isWarning
                        ? 'text-amber-600 dark:text-amber-400'
                        : isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : isPending
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    )}
                  >
                    {t(step.label)}
                  </p>
                  <span
                    className={cn(
                      'text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider',
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : isWarning
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 animate-pulse'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    {isCompleted
                      ? t('common.completed', 'Completed')
                      : isWarning
                      ? t('status.correctionRequired', 'Correction Needed')
                      : isActive
                      ? t('common.inProgress', 'In Progress')
                      : t('common.pending', 'Pending')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t(step.desc)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
