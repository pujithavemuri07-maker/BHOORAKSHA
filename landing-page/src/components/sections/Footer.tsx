import React from 'react';
import { Eye } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-12 border-t border-slate-800 relative z-10 text-xs text-slate-400 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">{t('Bhooraksha Platform')} (भूरक्षा)</div>
            <div className="text-[11px] text-slate-500">{t('Government of India & State Revenue Departments')}</div>
          </div>
        </div>
        <div>
          {t('18 Supported Interface Languages • Evidence-Based Review & GIS Validation')}
        </div>
        <div>
          © {new Date().getFullYear()} {t('Bhooraksha Architecture. All rights reserved.')}
        </div>
      </div>
    </footer>
  );
};
