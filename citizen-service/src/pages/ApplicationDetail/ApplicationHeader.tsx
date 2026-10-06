import React from 'react';
import { Application } from '../../api/types';
import { StatusBadge } from '../../components/StatusBadge';
import { ArrowLeft, Calendar, FileText, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';

interface ApplicationHeaderProps {
  application: Application;
  onShare: () => void;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  application: app,
  onShare,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <Link
          to="/citizen/applications"
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors mt-0.5"
          aria-label="Back to applications"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono">{app.id}</h1>
            <StatusBadge status={app.status} />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              {app.extractedData?.propertyDetails?.parcelId || `PARCEL-2026-KA-${app.id.replace(/\D/g, '').slice(-6) || '000123'}`}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/30">
              {t('Document Version 1')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t(app.documentType)}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {t('Submitted on')}{' '}
                {new Date(app.submissionDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-[11px] text-slate-400">{app.fileName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">
              ULPIN:{' '}
              {app.extractedData?.propertyDetails?.ulpin && !app.extractedData.propertyDetails.ulpin.includes('RANDOM')
                ? app.extractedData.propertyDetails.ulpin
                : t('Not available in current dataset')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        {app.status === 'APPROVED' && (
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>{t('Share with Bank')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
