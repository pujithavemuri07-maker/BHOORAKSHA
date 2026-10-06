import React from 'react';
import { Link } from 'react-router-dom';
import { VerifierApplication } from '../../api/types';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { classifyRisk } from '../../utils/riskClassification';
import { ArrowLeft, User, Phone, Mail, FileText, Calendar, Building2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface ReviewHeaderProps {
  application: VerifierApplication;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({ application }) => {
  const { t } = useTranslation();
  const currentStatus = application.currentStatus || application.status;
  const riskMeta = classifyRisk(application.riskScore);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left identity & navigation */}
        <div className="flex items-center gap-3">
          <Link
            to="/verifier/review"
            className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Back to Verification Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black font-mono text-white tracking-wide">
                {application.id}
              </h1>
              <span className="text-xs font-bold font-mono bg-slate-800 text-emerald-400 px-2.5 py-0.5 rounded-full border border-slate-700">
                Cycle {application.reviewCycleNumber || 1}
              </span>
              <StatusBadge status={currentStatus} />
              <PriorityBadge priority={application.priority} riskScore={application.riskScore} />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-200">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                {t(application.documentType)} ({application.transactionType || 'Sale Mutation'})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Forwarded: {new Date(application.forwardedDate || application.deoForwardedAt || application.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                {application.village || application.extractedData.propertyDetails.village}, {application.mandal || application.extractedData.propertyDetails.taluk} ({application.district || application.extractedData.propertyDetails.district})
              </span>
            </p>
          </div>
        </div>

        {/* Right Stage, Risk & Assigned Verifier */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Assigned Verifier & Stage
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold font-mono text-emerald-400">
                {application.assignedOfficer || 'K. Venkat Rao (Senior Girdawar)'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-semibold text-slate-300">
                {application.currentStage || 'VERIFIER REVIEW'}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Review Priority
            </span>
            <div className="flex items-center justify-end gap-2 mt-0.5">
              <span className="text-base font-black font-mono text-amber-400">
                {application.riskScore} / 100
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${riskMeta.badgeBg} ${riskMeta.badgeText} ${riskMeta.badgeBorder}`}>
                {riskMeta.riskLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Metadata Grid (18 Key Fields Summary) */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Applicant</span>
          <span className="font-bold text-slate-100 truncate block">{application.citizenName}</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Contact</span>
          <span className="font-mono text-slate-300 block">{application.citizenPhone}</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Email</span>
          <span className="text-slate-300 truncate block">{application.citizenEmail}</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Survey / Hissa</span>
          <span className="font-mono font-bold text-amber-400 block">Sy. #{application.surveyNumber} {application.hissaNumber ? `/ ${application.hissaNumber}` : ''}</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">App Date</span>
          <span className="font-mono text-slate-300 block">{new Date(application.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Review Cycle</span>
          <span className="font-mono font-bold text-sky-400 block">Cycle #{application.reviewCycleNumber || 1}</span>
        </div>
      </div>
    </div>
  );
};
