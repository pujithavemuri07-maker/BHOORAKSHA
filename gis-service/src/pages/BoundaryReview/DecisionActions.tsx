import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Sliders,
  Flag,
  XCircle,
  ShieldCheck,
  Clock,
  UserCheck,
  FileText,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { GISApplication } from '../../api/types';
import { formatDateTime } from '../../utils/formatters';

interface DecisionActionsProps {
  application: GISApplication;
  onConfirm: () => void;
  onAdjust: () => void;
  onFlagFieldSurvey: () => void;
  onReject: () => void;
  isProcessing?: boolean;
}

export const DecisionActions: React.FC<DecisionActionsProps> = ({
  application,
  onConfirm,
  onAdjust,
  onFlagFieldSurvey,
  onReject,
  isProcessing = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isFinalized =
    application.actionStatus === 'CONFIRMED' ||
    application.actionStatus === 'FIELD_SURVEY_REQUIRED' ||
    application.actionStatus === 'REJECTED' ||
    application.status === 'gis_verified' ||
    application.status === 'gis_flagged_field_survey' ||
    application.status === 'gis_rejected';

  // If finalized, render the immutable "CADASTRAL ACTION COMPLETED" summary card
  if (isFinalized) {
    const isConfirmed =
      application.actionStatus === 'CONFIRMED' || application.status === 'gis_verified';
    const isFieldSurvey =
      application.actionStatus === 'FIELD_SURVEY_REQUIRED' ||
      application.status === 'gis_flagged_field_survey';
    const isRejected =
      application.actionStatus === 'REJECTED' || application.status === 'gis_rejected';

    const officerName =
      application.actionCompletedBy ||
      application.actionHistory?.[application.actionHistory.length - 1]?.performedBy ||
      'S. Ramakrishna (GIS Officer ID: GIS-8821)';

    const completedTimestamp =
      application.actionCompletedAt ||
      application.actionHistory?.[application.actionHistory.length - 1]?.timestamp ||
      application.updatedAt ||
      new Date().toISOString();

    const remarks =
      application.actionRemarks ||
      application.actionReason ||
      application.actionHistory?.[application.actionHistory.length - 1]?.remarks ||
      'Official cadastral action finalized and signed with digital spatial certificate.';

    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t('CADASTRAL ACTION COMPLETED')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('This case is finalized. Further manual editing or conflicting actions are locked.')}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[10px] px-3 py-1 rounded-full bg-slate-950 text-teal-300 border border-teal-500/30 font-mono font-bold tracking-wide">
            {t('RECORD IMMUTABLE')}
          </span>
        </div>

        {/* Action Status Summary Box */}
        <div
          className={`p-5 rounded-2xl border ${
            isConfirmed
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
              : isFieldSurvey
              ? 'bg-purple-950/20 border-purple-500/30 text-purple-300'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
          } space-y-4`}
        >
          <div className="flex items-center gap-3">
            {isConfirmed && <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />}
            {isFieldSurvey && <Flag className="w-7 h-7 text-purple-400 shrink-0" />}
            {isRejected && <XCircle className="w-7 h-7 text-rose-400 shrink-0" />}
            <div>
              <h4 className="text-base font-extrabold text-white tracking-wide">
                {isConfirmed && `✓ ${t('BOUNDARY CONFIRMED & RATIFIED')}`}
                {isFieldSurvey && `✓ ${t('FIELD SURVEY REQUESTED')}`}
                {isRejected && `✓ ${t('BOUNDARY MISMATCH REJECTED')}`}
              </h4>
              <p className="text-xs opacity-90">
                {isConfirmed &&
                  t('Official cadastral boundary verified and ratified in state digital cadastre.')}
                {isFieldSurvey &&
                  t('Case forwarded to Mandal Survey Unit for DGPS on-site cadastral demarcation.')}
                {isRejected &&
                  t('Application rejected due to severe cadastral mismatch and boundary conflict.')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-medium flex items-center gap-1 mb-0.5">
                <UserCheck className="w-3 h-3 text-teal-400" />
                {t('Action Completed By')}
              </span>
              <span className="font-bold text-white">{officerName}</span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-medium flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-teal-400" />
                {t('Completed At')}
              </span>
              <span className="font-bold text-white font-mono">{formatDateTime(completedTimestamp)}</span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-medium flex items-center gap-1 mb-0.5">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                {t('Spatial Match %')}
              </span>
              <span className="font-bold text-teal-300 font-mono">
                {application.overlapPercentage.toFixed(1)}% {t('Overlap')}
              </span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-medium flex items-center gap-1 mb-0.5">
                <FileText className="w-3 h-3 text-teal-400" />
                {t('Workflow Status')}
              </span>
              <span className="font-bold text-white">
                {isConfirmed
                  ? t('Boundary Confirmed')
                  : isFieldSurvey
                  ? t('Field Survey Required')
                  : t('Boundary Mismatch — Rejected')}
              </span>
            </div>
          </div>

          {remarks && (
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                {t('Official Officer Remarks & Decision Ledger')}:
              </span>
              <p className="italic text-slate-200">"{remarks}"</p>
            </div>
          )}
        </div>

        {/* View Audit Details Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-400">
            {t('This action is permanently logged to the immutable Spatial Audit Ledger.')}
          </span>
          <button
            type="button"
            onClick={() => navigate('/gis/history')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-bold inline-flex items-center gap-2 transition-all hover:scale-105 shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{t('View Audit Details in Ledger')}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // If NOT finalized, render the four action buttons with loading/processing state
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>{t('Cadastral Ratification Actions')}</span>
        </h3>
        {application.status === 'gis_adjusted' && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
            {t('Boundary Adjusted — Awaiting Final Ratification')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Confirm Button */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={isProcessing}
          className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex flex-col items-center justify-center gap-2 font-bold text-xs transition-all hover:scale-[1.02] disabled:opacity-50 group"
        >
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-center">
            <div className="text-sm text-emerald-300 font-bold">
              {isProcessing ? t('Confirming...') : t('gis.confirmBoundary')}
            </div>
            <div className="text-[10px] text-emerald-400/80 font-normal">{t('Ratify official boundary')}</div>
          </div>
        </button>

        {/* Adjust Button */}
        <button
          type="button"
          onClick={onAdjust}
          disabled={isProcessing}
          className="p-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex flex-col items-center justify-center gap-2 font-bold text-xs transition-all hover:scale-[1.02] disabled:opacity-50 group"
        >
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="text-center">
            <div className="text-sm text-cyan-300 font-bold">
              {isProcessing ? t('Adjusting...') : t('gis.adjustBoundary')}
            </div>
            <div className="text-[10px] text-cyan-400/80 font-normal">{t('Edit & snap vertices')}</div>
          </div>
        </button>

        {/* Flag Field Survey Button */}
        <button
          type="button"
          onClick={onFlagFieldSurvey}
          disabled={isProcessing}
          className="p-3.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 flex flex-col items-center justify-center gap-2 font-bold text-xs transition-all hover:scale-[1.02] disabled:opacity-50 group"
        >
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-110 transition-transform">
            <Flag className="w-5 h-5" />
          </div>
          <div className="text-center">
            <div className="text-sm text-purple-300 font-bold">
              {isProcessing ? t('Flagging...') : t('gis.flagFieldSurvey')}
            </div>
            <div className="text-[10px] text-purple-400/80 font-normal">{t('Deploy Mandal DGPS survey')}</div>
          </div>
        </button>

        {/* Reject Button */}
        <button
          type="button"
          onClick={onReject}
          disabled={isProcessing}
          className="p-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex flex-col items-center justify-center gap-2 font-bold text-xs transition-all hover:scale-[1.02] disabled:opacity-50 group"
        >
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 group-hover:scale-110 transition-transform">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="text-center">
            <div className="text-sm text-rose-300 font-bold">
              {isProcessing ? t('Rejecting...') : t('gis.rejectBoundary')}
            </div>
            <div className="text-[10px] text-rose-400/80 font-normal">{t('Severe overlap / encroachment')}</div>
          </div>
        </button>
      </div>
    </div>
  );
};
