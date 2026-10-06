import React, { useState } from 'react';
import { LandApplication } from '@shared/types';
import { LegalFlagsList, LegalFlagItem } from './LegalFlagsList';
import { Scale, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n';

interface LegalAnalysisPanelProps {
  application: LandApplication;
  flags: LegalFlagItem[];
  onRecordOpinion: (opinion: string) => void;
}

export const LegalAnalysisPanel: React.FC<LegalAnalysisPanelProps> = ({
  application,
  flags,
  onRecordOpinion,
}) => {
  const { t } = useTranslation();
  const [opinion, setOpinion] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Detected Legal Issues & Court Caveats */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400" />
            {t('Detected Legal Risks & Caveats')}
          </h3>
          <span className="text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-mono font-bold">
            {flags.length} {t('Caveats')}
          </span>
        </div>

        <LegalFlagsList flags={flags} />
      </div>

      {/* Statutory Legal Advisory Opinion Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              {t('Statutory Legal Officer Opinion (विधिक अभिमत)')}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">{t('Title Due Diligence Summary')}</label>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 leading-relaxed">
                {t('Prior 30-year lineage verified across Sub-Registrar records. Civil Court Caveat No 412/2023 was settled by mutual decree on 12/01/2024. No stay order in effect.')}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t('Official Legal Advisory Finding')}</label>
              <textarea
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                rows={5}
                placeholder={t('Draft formal legal advice for Tehsildar regarding marketable title and permission for mutation...')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => onRecordOpinion(opinion || t('Title clear. Conditional sanction advised.'))}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-purple-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('Sign & Record Legal Opinion')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
