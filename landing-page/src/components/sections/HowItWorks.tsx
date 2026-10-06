import React from 'react';
import { Upload, Cpu, CheckSquare, Stamp } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      num: '01',
      title: t('Citizen Document Upload'),
      desc: t('Applicant uploads registered deed, RoR extract, or survey map. AI checks quality, resolution, and blur in real-time.'),
      icon: Upload,
    },
    {
      num: '02',
      title: t('AI Multi-Agent Pipeline'),
      desc: t('10 specialized agents extract Indic text, verify cadastral boundaries, calculate overlaps, and score composite legal risk.'),
      icon: Cpu,
    },
    {
      num: '03',
      title: t('Maker-Checker Review'),
      desc: t('Patwari (DEO) verifies extracted fields. Girdawar (Verifier) compares deed against official state land registries.'),
      icon: CheckSquare,
    },
    {
      num: '04',
      title: t('Tehsildar Sanction & Mutation'),
      desc: t('Final statutory sanction issued, digital certificate generated with QR validation, and mutation recorded on land ledger.'),
      icon: Stamp,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-900/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            {t('End-to-End Flow')}
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('How Bhooraksha Operates')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="relative glass-card p-6 rounded-2xl">
                <div className="text-4xl font-extrabold text-emerald-500/20 font-mono mb-4">
                  {s.num}
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
