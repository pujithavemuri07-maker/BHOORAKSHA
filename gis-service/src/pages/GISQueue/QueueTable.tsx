import { Link } from 'react-router-dom';
import { Eye, ArrowUpDown, ShieldCheck, Sliders, Flag, XCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { GISApplication } from '../../api/types';
import { TrafficLightBadge } from '../../components/TrafficLightBadge';
import { getGISClassification } from '../../utils/constants';

interface QueueTableProps {
  applications: GISApplication[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export const QueueTable = ({
  applications,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: QueueTableProps) => {
  const { t } = useTranslation();
  const allSelected = applications.length > 0 && selectedIds.length === applications.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < applications.length;

  const getStatusBadge = (app: GISApplication) => {
    const isConfirmed = app.actionStatus === 'CONFIRMED' || app.status === 'gis_verified';
    const isFieldSurvey = app.actionStatus === 'FIELD_SURVEY_REQUIRED' || app.status === 'gis_flagged_field_survey';
    const isRejected = app.actionStatus === 'REJECTED' || app.status === 'gis_rejected';
    const isAdjusted = app.actionStatus === 'ADJUSTED' || app.status === 'gis_adjusted';

    if (isConfirmed) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
          <ShieldCheck className="w-3 h-3" />
          {t('Boundary Confirmed')}
        </span>
      );
    }
    if (isFieldSurvey) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
          <Flag className="w-3 h-3" />
          {t('Field Survey Required')}
        </span>
      );
    }
    if (isRejected) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
          <XCircle className="w-3 h-3" />
          {t('Boundary Mismatch — Rejected')}
        </span>
      );
    }
    if (isAdjusted) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
          <Sliders className="w-3 h-3" />
          {t('Boundary Adjusted')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
        <Clock className="w-3 h-3" />
        {t('Pending GIS Review')}
      </span>
    );
  };

  const getActionButton = (app: GISApplication) => {
    const isConfirmed = app.actionStatus === 'CONFIRMED' || app.status === 'gis_verified';
    const isFieldSurvey = app.actionStatus === 'FIELD_SURVEY_REQUIRED' || app.status === 'gis_flagged_field_survey';
    const isRejected = app.actionStatus === 'REJECTED' || app.status === 'gis_rejected';

    if (isConfirmed) {
      return (
        <Link
          to={`/gis/review/${app.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-all shadow-sm hover:scale-105"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t('View Result')}</span>
        </Link>
      );
    }

    if (isFieldSurvey || isRejected) {
      return (
        <Link
          to={`/gis/review/${app.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all shadow-sm hover:scale-105"
        >
          <Eye className="w-3.5 h-3.5 text-teal-400" />
          <span>{t('View Details')}</span>
        </Link>
      );
    }

    return (
      <Link
        to={`/gis/review/${app.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 font-semibold text-xs transition-all shadow-sm hover:scale-105"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>{t('Inspect Boundary')}</span>
      </Link>
    );
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold select-none">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4">{t('Application ID')}</th>
              <th className="py-3.5 px-4">{t('Citizen Name')}</th>
              <th className="py-3.5 px-4">{t('Survey & Location')}</th>
              <th className="py-3.5 px-4">{t('Claimed Extent')}</th>
              <th className="py-3.5 px-4">{t('Overlap %')}</th>
              <th className="py-3.5 px-4">{t('Traffic Light')}</th>
              <th className="py-3.5 px-4">{t('Status')}</th>
              <th className="py-3.5 px-4">{t('Priority')}</th>
              <th className="py-3.5 px-4 text-right">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {applications.map((app) => {
              const isSelected = selectedIds.includes(app.id);
              const classification = getGISClassification(app.overlapPercentage);

              return (
                <tr
                  key={app.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isSelected ? 'bg-teal-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(app.id)}
                      className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-teal-400">{app.applicationNo}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{app.id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-100">
                    <div>{app.citizenName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Ph: +91 {app.citizenPhone || '98765 43210'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-200">
                      {t('Sy. No')} <span className="font-bold text-white">{app.surveyNumber}</span>
                      {app.subdivisionNumber && `/${app.subdivisionNumber}`}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {app.village}, {app.mandal}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    <div>{app.extentAcres.toFixed(2)} {t('Ac')}</div>
                    <div className="text-[10px] text-slate-500">
                      {t('Govt')}: {app.govtCadastralAreaAcres.toFixed(2)} {t('Ac')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={classification.textColor}>
                      {app.overlapPercentage.toFixed(1)}%
                    </span>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {(app.overlapAreaAcres).toFixed(2)} {t('Ac')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <TrafficLightBadge status={classification.trafficLight} />
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(app)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${classification.priorityBadgeClass}`}
                    >
                      {t(classification.priority)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {getActionButton(app)}
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
