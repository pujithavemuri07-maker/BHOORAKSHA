import { Link } from 'react-router-dom';
import { ArrowRight, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { GISApplication } from '../../api/types';
import { TrafficLightBadge } from '../../components/TrafficLightBadge';
import { getGISClassification } from '../../utils/constants';

interface GISQueueProps {
  applications: GISApplication[];
}

export const GISQueue = ({ applications }: GISQueueProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{t('gis.queue', 'Cadastral Boundary Queue')}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
              {t('Live PostGIS Feed')}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('Cadastral parcel boundary matches and overlap analysis queue')}
          </p>
        </div>
        <Link
          to="/gis/review"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 hover:border-teal-500/40"
        >
          <span>{t('View All in Full Queue')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
              <th className="py-3.5 px-4">{t('Application No')}</th>
              <th className="py-3.5 px-4">{t('Applicant & Location')}</th>
              <th className="py-3.5 px-4">{t('Survey Details')}</th>
              <th className="py-3.5 px-4">{t('Claimed Area')}</th>
              <th className="py-3.5 px-4">{t('Overlap %')}</th>
              <th className="py-3.5 px-4">{t('Traffic Light')}</th>
              <th className="py-3.5 px-4">{t('Priority')}</th>
              <th className="py-3.5 px-4 text-right">{t('Action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {applications.slice(0, 5).map((app) => {
              const classification = getGISClassification(app.overlapPercentage);
              const isConfirmed = app.actionStatus === 'CONFIRMED' || app.status === 'gis_verified';
              const isFinalized =
                isConfirmed ||
                app.actionStatus === 'FIELD_SURVEY_REQUIRED' ||
                app.actionStatus === 'REJECTED' ||
                app.status === 'gis_flagged_field_survey' ||
                app.status === 'gis_rejected';

              return (
                <tr
                  key={app.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-teal-400 group-hover:text-teal-300">
                      {app.applicationNo}
                    </div>
                    <div className="text-[10px] text-slate-500">ID: {app.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-100">{app.citizenName}</div>
                    <div className="text-[11px] text-slate-400">
                      {app.village}, {app.mandal}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-200">
                      {t('Sy. No')}: <span className="font-bold text-white">{app.surveyNumber}</span>
                      {app.subdivisionNumber && `/${app.subdivisionNumber}`}
                    </div>
                    <div className="text-[10px] text-slate-500">{app.district}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    <div>{app.extentAcres.toFixed(2)} {t('Ac')}</div>
                    <div className="text-[10px] text-slate-500">{app.extentGuntas} {t('Guntas')}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono font-bold">
                      <span className={classification.textColor}>
                        {app.overlapPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <TrafficLightBadge status={classification.trafficLight} />
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${classification.priorityBadgeClass}`}
                    >
                      {t(classification.priority)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/gis/review/${app.id}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-sm ${
                        isConfirmed
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isFinalized
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('View Result')}</span>
                        </>
                      ) : isFinalized ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                          <span>{t('View Details')}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('Inspect Boundary')}</span>
                        </>
                      )}
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
