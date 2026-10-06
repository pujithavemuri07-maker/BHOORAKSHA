import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, AlertTriangle, MapPin } from 'lucide-react';
import { TrafficLight } from '../api/types';

interface FlagFieldSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  applicationId: string;
  defaultRemarks?: string;
  isSubmitting?: boolean;
  trafficLight?: TrafficLight;
}

export const FlagFieldSurveyModal: React.FC<FlagFieldSurveyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  defaultRemarks = '',
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState(
    defaultRemarks ||
      'Major spatial discrepancy detected with adjoining survey parcels. Physical DGPS ground survey required with Mandal Surveyor and Village Revenue Officer.'
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('gis.flagFieldSurvey')}
              </h3>
              <p className="text-xs text-slate-400">
                Case ID: <span className="font-mono text-purple-300 font-semibold">{applicationId}</span>
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

        <div className="p-3.5 bg-purple-950/30 rounded-xl border border-purple-500/30 text-xs text-purple-300/90 leading-relaxed flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p>{t('gis.flagConfirmation')}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Ground Survey Directive & Specific Coordinates to Audit *
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="Specify reason and instructions for the field survey team..."
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
            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Issue Field Survey Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
