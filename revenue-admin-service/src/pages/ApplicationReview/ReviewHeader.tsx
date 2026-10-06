import React from 'react';
import { RevenueApplication } from '../../api/types';
import { formatDate } from '../../utils/formatters';
import { useTranslation } from '../../i18n';
import {
  Landmark,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReviewHeaderProps {
  application: RevenueApplication;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({ application }) => {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'mutation_completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {t('Approved & Mutated')}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            {t('Final Rejected')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
            <Clock className="w-4 h-4 text-amber-400" />
            {t('Awaiting Final Decision')}
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/revenue/review"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title={t('Back to Queue')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xl font-black text-white tracking-tight">
                {application.id}
              </span>
              {getStatusBadge(application.status)}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
              <span>{t('Tamper-Evident Adjudication Docket')}</span>
              <span>•</span>
              <span className="text-indigo-400 font-medium">
                {application.ulpin
                  ? `ULPIN: ${application.ulpin}`
                  : `${t('ULPIN: Not available in current dataset')}`}
              </span>
              <span>•</span>
              <span className="text-slate-400 font-mono">
                Bhooraksha Parcel ID: PARCEL-2026-KA-000123
              </span>
            </p>
          </div>
        </div>

        {/* Priority and District Magistrate Stamp */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {t('Priority')}: {t(application.priority)}
          </span>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-800/80 text-xs">
        <div className="space-y-1">
          <p className="text-slate-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            {t('Citizen Name')}
          </p>
          <p className="font-semibold text-slate-100 text-sm">{application.citizenName}</p>
        </div>

        <div className="space-y-1">
          <p className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {t('Application Date')}
          </p>
          <p className="font-semibold text-slate-100 text-sm">
            {formatDate(application.submittedAt || application.createdAt)}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {t('Tehsil / Mandal')}
          </p>
          <p className="font-semibold text-slate-100 text-sm">
            {application.tehsil} ({application.village})
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-slate-400 flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5 text-slate-500" />
            {t('District')}
          </p>
          <p className="font-semibold text-slate-100 text-sm">{application.district}</p>
        </div>
      </div>
    </div>
  );
};
