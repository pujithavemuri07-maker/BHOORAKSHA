import React from 'react';
import { Link } from 'react-router-dom';
import { useLegalStore } from '../../store/legalStore';
import { Scale, ArrowRight, ShieldAlert, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useTranslation } from '../../i18n';

export const LegalQueuePreview: React.FC = () => {
  const { t } = useTranslation();
  const applications = useLegalStore((s) => s.applications);

  const pendingApps = applications
    .filter((a) => a.status === 'pending_legal_review')
    .slice(0, 5);

  const getPrimaryIssue = (app: typeof applications[0]) => {
    if (app.legalFlags && app.legalFlags.length > 0) {
      return t(app.legalFlags[0].title);
    }
    if (app.id === 'LEG-2026-601') return t('Ownership inconsistency');
    if (app.id === 'LEG-2026-602') return t('Active judicial injunction / court stay');
    if (app.id === 'LEG-2026-603') return t('Boundary / area mismatch with Pahani');
    if (app.id === 'LEG-2026-604') return t('Missing link title document');
    return t('Statutory verification pending');
  };

  const getLocation = (app: typeof applications[0]) => {
    const loc = app.extractedData?.propertyDetails;
    if (loc?.village && loc?.district) {
      return `${loc.village}, ${loc.district}`;
    }
    if (loc?.district) return loc.district;
    if (app.id === 'LEG-2026-601') return 'Warangal';
    if (app.id === 'LEG-2026-602') return 'Hyderabad';
    if (app.id === 'LEG-2026-603') return 'Karimnagar';
    return 'Serilingampally, Ranga Reddy';
  };

  const getRiskBadge = (app: typeof applications[0]) => {
    const score = app.legalRiskScore || 50;
    const sev = app.severity;

    if (sev === 'high' || score >= 75) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          {t('High Risk')}
        </span>
      );
    }
    if (sev === 'medium' || (score >= 40 && score < 75)) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          {t('Medium Risk')}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        {t('Low Risk')}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            {t('Cases Requiring Legal Action')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('Review flagged land records and record the appropriate legal decision.')}
          </p>
        </div>

        <Link
          to="/legal/review"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/15 text-indigo-300 hover:bg-indigo-600/25 border border-indigo-500/30 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <span>{t('Open Full Queue')} ({applications.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table / List */}
      {pendingApps.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          {t('All flagged titles have been reviewed and sanctioned.')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">{t('Case ID')}</th>
                <th className="py-3 px-3">{t('Applicant / Owner')}</th>
                <th className="py-3 px-3">{t('Survey Number')}</th>
                <th className="py-3 px-3">{t('Location')}</th>
                <th className="py-3 px-3">{t('Issue Detected')}</th>
                <th className="py-3 px-3">{t('Risk')}</th>
                <th className="py-3 px-3">{t('Submitted')}</th>
                <th className="py-3 px-3 text-right">{t('Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {pendingApps.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Case ID */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-indigo-300">
                      {app.id}
                    </span>
                  </td>

                  {/* Applicant / Owner */}
                  <td className="py-3.5 px-3 whitespace-nowrap font-semibold text-slate-100">
                    {app.citizenName}
                  </td>

                  {/* Survey Number */}
                  <td className="py-3.5 px-3 whitespace-nowrap font-mono text-slate-300">
                    {t('Survey No.')} {app.surveyNumber}
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[140px]">{getLocation(app)}</span>
                    </div>
                  </td>

                  {/* Issue Detected */}
                  <td className="py-3.5 px-3 text-slate-300">
                    <div className="truncate max-w-[200px]" title={getPrimaryIssue(app)}>
                      {getPrimaryIssue(app)}
                    </div>
                  </td>

                  {/* Risk */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getRiskBadge(app)}
                  </td>

                  {/* Submitted */}
                  <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {formatDate(app.createdAt)}
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <Link
                      to={`/legal/review/${app.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-950/60"
                    >
                      <span>{t('Review Case')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
