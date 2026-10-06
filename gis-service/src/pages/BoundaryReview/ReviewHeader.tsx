import { ArrowLeft, User, Phone, MapPin, Layers, Clock, ShieldCheck, Sliders, Flag, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { GISApplication } from '../../api/types';
import { TrafficLightBadge } from '../../components/TrafficLightBadge';
import { getGISClassification } from '../../utils/constants';

interface ReviewHeaderProps {
  application: GISApplication;
}

export const ReviewHeader = ({ application }: ReviewHeaderProps) => {
  const { t } = useTranslation();
  const classification = getGISClassification(application.overlapPercentage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'gis_verified':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        );
      case 'gis_adjusted':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            Adjusted
          </span>
        );
      case 'gis_flagged_field_survey':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
            <Flag className="w-3.5 h-3.5" />
            Flagged for Field Survey
          </span>
        );
      case 'gis_rejected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Pending GIS Review
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Back Link and App ID */}
        <div className="flex items-center gap-4">
          <Link
            to="/gis/review"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black text-white font-mono tracking-tight">
                {application.applicationNo}
              </h1>
              {getStatusBadge(application.status)}
              <TrafficLightBadge status={classification.trafficLight} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cadastral Boundary Ratification • Case ID: <span className="font-mono text-slate-300">{application.id}</span>
            </p>
          </div>
        </div>

        {/* Overlap Summary pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Spatial Match
            </div>
            <div
              className={`text-lg font-black font-mono ${classification.textColor}`}
            >
              {application.overlapPercentage.toFixed(1)}% ({application.overlapAreaAcres.toFixed(2)} Ac)
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-start gap-2.5">
          <User className="w-4 h-4 text-teal-400 mt-0.5" />
          <div>
            <div className="text-slate-400 text-[10px]">Citizen / Applicant</div>
            <div className="font-semibold text-slate-100">{application.citizenName}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Phone className="w-2.5 h-2.5 text-slate-500" />
              +91 {application.citizenPhone || '98765 43210'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-teal-400 mt-0.5" />
          <div>
            <div className="text-slate-400 text-[10px]">Cadastral Location</div>
            <div className="font-semibold text-slate-100">
              Sy. No: {application.surveyNumber}{application.subdivisionNumber ? `/${application.subdivisionNumber}` : ''}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {application.village}, {application.mandal}, {application.district}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-teal-400 mt-0.5" />
          <div>
            <div className="text-slate-400 text-[10px]">Extent / Area</div>
            <div className="font-mono font-bold text-teal-300 text-sm">
              {application.extentAcres.toFixed(2)} Ac
            </div>
            <div className="text-[10px] text-slate-400">
              {application.extentGuntas} Guntas ({application.govtCadastralAreaAcres.toFixed(2)} Ac Govt)
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-teal-400 mt-0.5" />
          <div>
            <div className="text-slate-400 text-[10px]">Priority & Submission</div>
            <div className="font-semibold text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1 mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${classification.priorityBadgeClass}`}>
                {classification.priority}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {new Date(application.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
