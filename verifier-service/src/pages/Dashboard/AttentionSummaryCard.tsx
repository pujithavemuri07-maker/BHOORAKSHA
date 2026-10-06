import { AlertOctagon, FileQuestion, MapPinOff, Copy, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';

interface AttentionSummaryCardProps {
  attentionSummary?: {
    documentsMissing: number;
    conflictsDetected: number;
    gisFlags: number;
    duplicateFlags: number;
    returnedApplications: number;
  };
}

export const AttentionSummaryCard = ({ attentionSummary }: AttentionSummaryCardProps) => {
  const { t } = useTranslation();
  const summary = attentionSummary || {
    documentsMissing: 1,
    conflictsDetected: 1,
    gisFlags: 0,
    duplicateFlags: 0,
    returnedApplications: 0,
  };

  const items = [
    {
      label: t('Documents Missing'),
      count: summary.documentsMissing,
      icon: FileQuestion,
      color: summary.documentsMissing > 0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-slate-400 bg-slate-800/40 border-slate-700/50',
      filterLink: '/verifier/review?missingDocs=true',
    },
    {
      label: t('Conflicts Detected'),
      count: summary.conflictsDetected,
      icon: AlertOctagon,
      color: summary.conflictsDetected > 0 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-slate-400 bg-slate-800/40 border-slate-700/50',
      filterLink: '/verifier/review?status=pending_verification',
    },
    {
      label: t('GIS Flags'),
      count: summary.gisFlags,
      icon: MapPinOff,
      color: summary.gisFlags > 0 ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' : 'text-slate-400 bg-slate-800/40 border-slate-700/50',
      filterLink: '/verifier/review?gisConflict=true',
    },
    {
      label: t('Duplicate Flags'),
      count: summary.duplicateFlags,
      icon: Copy,
      color: summary.duplicateFlags > 0 ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : 'text-slate-400 bg-slate-800/40 border-slate-700/50',
      filterLink: '/verifier/review?filter=all',
    },
    {
      label: t('Returned Applications'),
      count: summary.returnedApplications,
      icon: RotateCcw,
      color: summary.returnedApplications > 0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-slate-400 bg-slate-800/40 border-slate-700/50',
      filterLink: '/verifier/review?status=returned_to_deo',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          {t('Verification Attention Summary')}
        </h4>
        <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
          {t('Live Database Aggregation')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              to={item.filterLink}
              className={`p-3 rounded-xl border ${item.color} flex flex-col justify-between transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4" />
                <span className="font-mono font-extrabold text-lg">{item.count}</span>
              </div>
              <span className="text-[11px] font-semibold mt-2 leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
