import React, { useState } from 'react';
import { LandApplication } from '@shared/types';
import { FileText, Cpu, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n';

interface ReviewPanelProps {
  application: LandApplication;
  onApprove: (remarks: string) => void;
  onReject: (reason: string) => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  application,
  onApprove,
  onReject,
}) => {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Scanned Deed Document View */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              {t('Scanned Deed Document')} ({t('Sale Deed')} 2024/091)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{t('Page')} 1 {t('of')} 4</span>
          </div>

          <div className="h-[380px] rounded-xl bg-slate-950 border border-slate-800 p-6 font-mono text-xs text-slate-400 overflow-y-auto leading-relaxed border-dashed">
            <div className="text-center font-bold text-slate-300 pb-3 border-b border-slate-800">
              GOVERNMENT OF KARNATAKA - DEPARTMENT OF STAMPS & REGISTRATION
            </div>
            <p className="mt-3">
              THIS DEED OF SALE executed on this 14th day of February, 2024 by Sri Devendra Sharma residing at Sarjapura Village in favour of Sri Rajesh Sharma...
            </p>
            <p className="mt-3">
              SCHEDULE PROPERTY: All that piece and parcel of agricultural land bearing Survey Number 142/2A, measuring an extent of 2 Acres 45 Cents situated at Sarjapura Village, Anekal Taluk, Bengaluru Urban District...
            </p>
            <p className="mt-3">
              BOUNDARIES:
              <br />North by: Survey No 141 (Govt Channel)
              <br />South by: Survey No 143 (Muniyappa Land)
              <br />East by: 30 Feet Village Road
              <br />West by: Survey No 142/1 (Gowda Property)
            </p>
          </div>
        </div>

        {/* Right Side: AI OCR Extracted Fields for Patwari Validation */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              {t('AI Extracted Entity Form')}
            </h3>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
              MuRIL NER: 99.1%
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">{t('Primary Owner (Khatedar)')}</label>
              <input
                type="text"
                defaultValue="Rajesh Sharma"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">{t('Survey Number')}</label>
                <input
                  type="text"
                  defaultValue={application.surveyNumber}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{t('Subdivision')}</label>
                <input
                  type="text"
                  defaultValue={application.subdivisionNumber || '2A'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t('Extent (Acres)')}</label>
              <input
                type="text"
                defaultValue={application.extentAcres.toString()}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t('Patwari Remarks (टिप्पणी)')}</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder={t('Enter field inspection notes or verification remarks...')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
        <button
          onClick={() => onReject(remarks || t('Data discrepancy in deed'))}
          className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
        >
          {t('Flag & Reject')}
        </button>
        <button
          onClick={() => onApprove(remarks || t('Preliminary verification passed by Patwari'))}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t('Approve & Forward to Verifier (Girdawar)')}</span>
        </button>
      </div>
    </div>
  );
};
