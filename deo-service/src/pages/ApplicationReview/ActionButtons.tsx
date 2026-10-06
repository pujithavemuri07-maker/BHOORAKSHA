import React from 'react';
import { useTranslation } from '../../i18n';
import { Send, AlertTriangle, Scale, MapPin, CheckCircle2, FileText, Save } from 'lucide-react';

interface ActionButtonsProps {
  onForward: () => void;
  onCorrection: () => void;
  onRequestLegal: () => void;
  onRequestGis: () => void;
  onRequestMissingDoc?: () => void;
  onSaveCorrections?: () => void;
  isForwarding?: boolean;
  isRequestingCorrection?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onForward,
  onCorrection,
  onRequestLegal,
  onRequestGis,
  onRequestMissingDoc,
  onSaveCorrections,
  isForwarding = false,
  isRequestingCorrection = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl sticky bottom-4 z-40 backdrop-blur-md bg-slate-900/95">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Secondary Specialist Flags & Missing Doc Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onRequestMissingDoc && (
            <button
              type="button"
              onClick={onRequestMissingDoc}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all hover:scale-105 active:scale-95"
              title="Request missing identity, RoR or cadastral document from citizen"
            >
              <FileText className="w-4 h-4" />
              <span>Request Missing Document</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRequestGis}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-all hover:scale-105 active:scale-95"
            title="Flag parcel boundaries for GIS specialist"
          >
            <MapPin className="w-4 h-4" />
            <span>Flag for GIS Review</span>
          </button>

          <button
            type="button"
            onClick={onRequestLegal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition-all hover:scale-105 active:scale-95"
            title="Flag deed to Legal review directorate"
          >
            <Scale className="w-4 h-4" />
            <span>Flag for Legal Review</span>
          </button>
        </div>

        {/* Primary Maker Decisions */}
        <div className="flex flex-wrap items-center gap-3">
          {onSaveCorrections && (
            <button
              type="button"
              onClick={onSaveCorrections}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-500/40 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30"
              title="Save all current field edits without routing. Keeps application assigned to DEO."
            >
              <Save className="w-4 h-4 text-white" />
              <span>💾 SAVE CORRECTIONS</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCorrection}
            disabled={isRequestingCorrection}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Flag application back to citizen applicant for document re-upload"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isRequestingCorrection ? 'Flagging...' : 'Flag for Correction'}</span>
          </button>

          <button
            type="button"
            onClick={onForward}
            disabled={isForwarding}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Save latest corrections and forward verified application to Verifier queue"
          >
            <Send className="w-4 h-4" />
            <span>{isForwarding ? 'Forwarding...' : '➡️ SAVE & FORWARD TO VERIFIER'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
