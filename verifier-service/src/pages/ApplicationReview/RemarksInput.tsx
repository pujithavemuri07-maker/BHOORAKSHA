import { useTranslation } from '../../i18n';
import { FileEdit } from 'lucide-react';

interface RemarksInputProps {
  value: string;
  onChange: (value: string) => void;
  onSaveNotes?: () => void;
  placeholder?: string;
}

export const RemarksInput = ({ value, onChange, onSaveNotes, placeholder }: RemarksInputProps) => {
  const { t } = useTranslation();

  return (
    <div id="section-notes" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <FileEdit className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            VERIFIER INSPECTION NOTES & CROSS-REFERENCE FINDINGS
          </h4>
        </div>

        {onSaveNotes && (
          <button
            type="button"
            onClick={onSaveNotes}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            SAVE NOTES
          </button>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={
          placeholder ||
          'Record your verification observations, document comparison findings, GIS observations, physical verification notes, or reasons for returning/escalating this application.'
        }
        className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all leading-relaxed placeholder-slate-600"
      />
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>These inspection notes persist automatically to the database store and accompany all workflow decisions.</span>
        <span className="text-emerald-400 font-mono">Persisted to DB Store</span>
      </div>
    </div>
  );
};
