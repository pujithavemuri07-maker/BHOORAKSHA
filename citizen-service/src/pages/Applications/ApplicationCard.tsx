import React from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../../api/types';
import { StatusBadge } from '../../components/StatusBadge';
import { MapPin, Calendar, ArrowRight, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../i18n';

interface ApplicationCardProps {
  application: Application;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application: app }) => {
  const { t } = useTranslation();
  const riskColor =
    app.riskScore >= 80
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : app.riskScore >= 50
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono font-bold text-white text-sm">{app.id}</span>
        <span
          className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border',
            riskColor
          )}
        >
          {app.riskScore} / 100
        </span>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-200">{t(app.documentType)}</p>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>
            Sy. #{app.extractedData.propertyDetails.surveyNumber},{' '}
            {app.extractedData.propertyDetails.village}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <StatusBadge status={app.status} size="sm" />
        <Link
          to={`/citizen/applications/${app.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
        >
          <span>{t('Details')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
