import React from 'react';
import { Sparkles, PenTool } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface RemarksInputProps {
  remarks: string;
  onChange: (remarks: string) => void;
}

export const RemarksInput: React.FC<RemarksInputProps> = ({
  remarks,
  onChange,
}) => {
  const { t } = useTranslation();

  const quickTemplates = [
    'Approved. All 4-tier officer verifications validated with zero boundary anomalies. Mutation packet prepared for statutory review.',
    'Verified with local revenue records and spot inspection report. Dharani mutation approved and registry synchronization authorized.',
    'Clearances received from DEO, Verifier, Legal and GIS desks. No pending encumbrances or title disputes found.',
    'Approved subject to standard mutation entry in village Pahani and Dharani Portal dispatch.',
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenTool className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            {t("Tehsildar's Official Adjudication Order & Endorsement")}
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          {t('Statutory requirement for Tamper-Evident Audit Ledger entry')}
        </span>
      </div>

      <div className="space-y-3">
        <textarea
          value={remarks}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={t('Enter official executive remarks, adjudication reasons, and mutation instructions...')}
          className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none leading-relaxed"
        />

        {/* Quick-fill template chips */}
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t('Quick Statutory Endorsements')}:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(template)}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition text-left"
              >
                {template.slice(0, 50)}...
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
