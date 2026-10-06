import React from 'react';
import { useTranslation } from '../../i18n';
import {
  FileText,
  AlertTriangle,
  FileQuestion,
  CheckCircle2,
  Server,
  RotateCcw,
  Cpu,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { DEOStats } from '../../api/types';

interface MetricsCardsProps {
  metrics: DEOStats;
  totalApplicationsCount?: number;
  apiFailureCount?: number;
  isLoading?: boolean;
  onFilterSelect?: (filter: string) => void;
  activeFilter?: string;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  metrics,
  totalApplicationsCount = 8,
  apiFailureCount = 0,
  isLoading = false,
  onFilterSelect,
  activeFilter,
}) => {
  const { t } = useTranslation();

  const cards = [
    {
      id: 'all',
      label: t('deoMetrics.newApplications'),
      value: totalApplicationsCount,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/30',
      description: t('deoMetrics.newApplicationsDesc'),
    },
    {
      id: 'ai_processed',
      label: t('deoMetrics.aiProcessed'),
      value: (metrics as any).aiProcessed || totalApplicationsCount,
      icon: Cpu,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/30',
      description: t('deoMetrics.aiProcessedDesc'),
    },
    {
      id: 'attention',
      label: t('deoMetrics.needsReview'),
      value: metrics.needsAttention,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/30',
      description: t('deoMetrics.needsReviewDesc'),
    },
    {
      id: 'missing_docs',
      label: t('deoMetrics.missingDocs'),
      value: metrics.missingDocuments,
      icon: FileQuestion,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/30',
      description: t('deoMetrics.missingDocsDesc'),
    },
    {
      id: 'ready',
      label: t('deoMetrics.readyForward'),
      value: metrics.readyToForward,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30',
      description: t('deoMetrics.readyForwardDesc'),
    },
    {
      id: 'returned',
      label: t('deoMetrics.returned'),
      value: (metrics as any).returnedForCorrection || 1,
      icon: RotateCcw,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      activeBorder: 'border-orange-500 ring-2 ring-orange-500/30',
      description: t('deoMetrics.returnedDesc'),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 6 Key DEO Workload Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeFilter === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onFilterSelect && onFilterSelect(card.id)}
              className={`bg-slate-900 border ${
                isSelected ? card.activeBorder : card.border
              } rounded-2xl p-4 shadow-xl hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl ${card.bg} ${card.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  DEO Desk
                </span>
              </div>
              <div>
                <p className="text-2xl font-black font-mono text-white tracking-tight">
                  {isLoading ? '...' : card.value}
                </p>
                <p className="text-[11px] font-bold text-slate-200 mt-1 uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Small System Status Indicator: State Land Records API & Fallback Cases */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-xs">
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-300">STATE LAND RECORDS API:</span>
          {apiFailureCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              ⚠ API Fallback Cases ({apiFailureCount} requiring manual transcription)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ● Connected • Direct Sync Active
            </span>
          )}
        </div>

        {apiFailureCount > 0 ? (
          <button
            type="button"
            onClick={() => onFilterSelect && onFilterSelect('manual')}
            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold underline"
          >
            <span>View API Fallback Cases</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        ) : (
          <span className="text-[11px] text-slate-500 font-mono">
            Direct Revenue Service Link • Sub-Registrar / Land Records Gateway Active
          </span>
        )}
      </div>
    </div>
  );
};
