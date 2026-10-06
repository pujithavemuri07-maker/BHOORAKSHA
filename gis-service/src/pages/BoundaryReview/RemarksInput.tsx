import { MessageSquareQuote, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface RemarksInputProps {
  remarks: string;
  onChange: (val: string) => void;
}

export const RemarksInput = ({ remarks, onChange }: RemarksInputProps) => {
  const { t } = useTranslation();

  const templates = [
    'Cadastral boundary matches BhooNaksha digital vector within 0.2m sub-meter accuracy.',
    'Minor overlap < 5% resolved with official cadastral boundary snapping.',
    'Eastern survey boundary deviates from village settlement map. Flagged for DGPS survey.',
    'Substantial parcel overlap > 15% detected with adjoining Sy. No. Encroachment risk.',
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4 text-teal-400" />
          <span>{t('gis.remarks')}</span>
        </label>
        <span className="text-[10px] text-slate-400">Official Survey Audit Trail</span>
      </div>

      <textarea
        value={remarks}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Enter official cadastral remarks, verification notes, or vertex adjustment justification..."
        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
      />

      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span>Quick Template Notes:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {templates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(tpl)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-teal-300 hover:border-teal-500/40 transition-colors text-left truncate max-w-xs"
              title={tpl}
            >
              {tpl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
