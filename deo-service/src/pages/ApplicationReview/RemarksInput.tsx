import React from 'react';
import { useTranslation } from '../../i18n';
import { MessageSquare } from 'lucide-react';

interface RemarksInputProps {
  value: string;
  onChange: (val: string) => void;
}

export const RemarksInput: React.FC<RemarksInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
        <MessageSquare className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          {t('deo.remarks')} (Patwari Officer Inspection Notes)
        </h3>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
        placeholder="Record your physical site observations, boundary tally notes, or reasons for forwarding..."
      />
    </div>
  );
};
