import React from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../../api/types';
import { StatusBadge } from '../../components/StatusBadge';
import { ChevronRight, FileText, Calendar, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../i18n';

interface RecentApplicationsProps {
  applications: Application[];
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({ applications }) => {
  const { t } = useTranslation();

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-white">{t('No applications filed yet')}</p>
        <p className="text-xs text-slate-400 mt-1">
          {t('Upload your Registered Sale Deed or Pattadar Passbook to start verification.')}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
          <tr>
            <th className="py-3 px-4">{t('Application ID')}</th>
            <th className="py-3 px-4">{t('Document Type')}</th>
            <th className="py-3 px-4">{t('Property & Survey')}</th>
            <th className="py-3 px-4">{t('Submission Date')}</th>
            <th className="py-3 px-4">{t('Verification Status')}</th>
            <th className="py-3 px-4 text-center">{t('Review Priority')}</th>
            <th className="py-3 px-4 text-right">{t('Action')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-medium">
          {applications.map((app) => {
            const riskColor =
              app.riskScore >= 80
                ? 'text-emerald-400 bg-emerald-500/10'
                : app.riskScore >= 50
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-rose-400 bg-rose-500/10';

            return (
              <tr
                key={app.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-white">
                  <Link
                    to={`/citizen/applications/${app.id}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {app.id}
                  </Link>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  <span className="font-semibold">{t(app.documentType)}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {t('Sy.')} #{app.extractedData.propertyDetails.surveyNumber},{' '}
                      {app.extractedData.propertyDetails.village}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-400">
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
                <td className="py-3.5 px-4">
                  <StatusBadge status={app.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={cn(
                      'inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold',
                      riskColor
                    )}
                  >
                    {app.riskScore} / 100
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/citizen/applications/${app.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>{t('View')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
