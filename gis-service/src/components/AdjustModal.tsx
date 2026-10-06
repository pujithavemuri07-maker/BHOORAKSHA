import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, Edit3, ShieldAlert } from 'lucide-react';
import { LatLngCoord, TrafficLight } from '../api/types';

interface AdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (boundaryData: LatLngCoord[], remarks: string) => void;
  applicationId: string;
  adjustedBoundary: LatLngCoord[];
  defaultRemarks?: string;
  isSubmitting?: boolean;
  trafficLight?: TrafficLight;
}

export const AdjustModal: React.FC<AdjustModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  adjustedBoundary,
  defaultRemarks = '',
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState(
    defaultRemarks ||
      'Minor boundary skew resolved by vertex snapping to official cadastral stone markers. Discrepant 0.05 acre overlap resolved.'
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(adjustedBoundary, remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('gis.adjustBoundary')}
              </h3>
              <p className="text-xs text-slate-400">
                Case ID: <span className="font-mono text-cyan-300 font-semibold">{applicationId}</span>
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

        <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-500/30 text-xs text-cyan-300/90 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>{t('gis.adjustConfirmation')}</p>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white">Adjusted Polygon Vertex Points:</div>
          <div className="font-mono text-[11px] text-slate-400">
            {adjustedBoundary.length} vertices snapped to cadastral boundary
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Correction Justification & Snapping Remarks *
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            placeholder="Specify reason for boundary adjustment..."
          />
        </div>

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
            disabled={isSubmitting || !remarks.trim()}
            className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Save & Apply Boundary Adjustment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
