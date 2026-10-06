import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';
import { TrafficLight } from '../api/types';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  applicationId: string;
  defaultRemarks?: string;
  isSubmitting?: boolean;
  trafficLight?: TrafficLight;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultRemarks = '',
  isSubmitting = false,
  trafficLight = 'green',
}) => {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState(
    defaultRemarks ||
      'Cadastral boundary verified against RoR 1-B village map and ground markers. Spatial alignment matches within statutory permissible tolerance (>=95% congruence).'
  );
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('gis.confirmBoundary')}
              </h3>
              <p className="text-xs text-slate-400">
                Case ID: <span className="font-mono text-emerald-300 font-semibold">{applicationId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-xs text-emerald-300/90 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>{t(`gis.confirmConfirmation.${trafficLight}`)}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {t('gis.remarks')} *
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder={t('gis.confirmRemarksPlaceholder')}
          />
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
          />
          <span>
            I certify as GIS Survey Commissioner that the boundary coordinates and area extents comply with the cadastral survey standards.
          </span>
        </label>

        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || !acknowledged || !remarks.trim()}
            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Confirm & Certify Boundary'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
