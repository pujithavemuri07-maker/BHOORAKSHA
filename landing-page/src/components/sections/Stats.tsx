import React from 'react';
import { Award, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Stats: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t('Dedicated Role Portals'), value: '7 Portals', icon: CheckCircle, trend: t('Citizen to Collector') },
    { label: t('Multi-Agent Analysis'), value: '9 Agents', icon: Award, trend: t('OCR, GIS & Legal Audits') },
    { label: t('Supported Interface Languages'), value: '18 Languages', icon: Users, trend: t('18 Supported Interface Languages') },
    { label: t('Verification Paradigm'), value: 'Human-in-the-Loop', icon: TrendingUp, trend: t('Evidence-Based Review') },
  ];

  return (
    <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            {t('Prototype Capabilities')}
          </h2>
          <p className="text-3xl font-extrabold text-white">
            {t('Evidence-Based Land Verification System')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400">{s.label}</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                  {s.value}
                </div>
                <div className="mt-2 text-xs font-semibold text-emerald-400">
                  {s.trend}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
