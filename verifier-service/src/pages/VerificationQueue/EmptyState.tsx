import { useTranslation } from '../../i18n';
import { CheckCircle2 } from 'lucide-react';

export const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-100">
        {t('verifier.noApplications')}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
        {t('verifier.queueEmpty')}
      </p>
    </div>
  );
};
