import React from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../../api/types';
import { StatusBadge } from '../../components/StatusBadge';
import { MapPin, Calendar, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../i18n';

interface ApplicationTableProps {
  applications: Application[];
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications }) => {
  const { t } = useTranslation();
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-900 border border-slate-800 rounded-3xl">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white">{t('No Applications Found')}</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          {t('No records match your active search and filter criteria. Try adjusting the query or upload a new deed.')}
        </p>
        <Link
          to="/citizen/upload"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
        >
          <span>{t('Upload Land Record')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-5">{t('Application ID')}</th>
              <th className="py-3.5 px-5">{t('Document Type')}</th>
              <th className="py-3.5 px-5">{t('Survey & ULPIN')}</th>
              <th className="py-3.5 px-5">{t('Date Filed')}</th>
              <th className="py-3.5 px-5">{t('Pipeline Status')}</th>
              <th className="py-3.5 px-5 text-center">{t('AI Trust Score')}</th>
              <th className="py-3.5 px-5 text-right">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {applications.map((app) => {
              const riskColor =
                app.riskScore >= 80
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : app.riskScore >= 50
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

              return (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-4 px-5 font-mono font-bold text-white">
                    <Link
                      to={`/citizen/applications/${app.id}`}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {app.id}
                    </Link>
                  </td>
                  <td className="py-4 px-5 text-slate-200">
                    <span className="font-semibold block">{t(app.documentType)}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {(app.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-300">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        Sy. #{app.extractedData.propertyDetails.surveyNumber},{' '}
                        {app.extractedData.propertyDetails.village}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block pl-5">
                      {app.extractedData.propertyDetails.ulpin}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {new Date(app.submissionDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border',
                        riskColor
                      )}
                    >
                      {app.riskScore} / 100
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      to={`/citizen/applications/${app.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all group-hover:bg-emerald-600 group-hover:text-white"
                    >
                      <span>{t('Review')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
