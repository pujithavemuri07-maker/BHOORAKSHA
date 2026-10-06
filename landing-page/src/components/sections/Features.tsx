import React from 'react';
import { ScanText, MapPin, Scale, FileSignature, ShieldCheck, Activity } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t('Multilingual Indic OCR & NER'),
      desc: t('Decodes handwritten deeds, revenue stamps, and 7/12 extracts across 10 official Indian scripts with high character-level fidelity.'),
      icon: ScanText,
    },
    {
      title: t('PostGIS Spatial Overlap Engine'),
      desc: t('Automatic polygon boundary calculation against cadastral maps to flag micro-encroachments and survey number overlaps instantly.'),
      icon: MapPin,
    },
    {
      title: t('Automated Legal Encumbrance Audit'),
      desc: t('Scans litigation registers, bank hypothecation notices, and civil court caveats to identify legal risk before registration.'),
      icon: Scale,
    },
    {
      title: t('Maker-Checker Revenue Governance'),
      desc: t('Strict 4-eye principle ensuring Patwari data entry, Girdawar verification, and Tehsildar final statutory sanction.'),
      icon: ShieldCheck,
    },
    {
      title: t('Automated Mutation Order Dispatch'),
      desc: t('Direct integration with state land portals (Bhulekh, Dharani, MeeBhoomi) with tamper-proof QR signed certificates.'),
      icon: FileSignature,
    },
    {
      title: t('Collector Observability Dashboard'),
      desc: t('Real-time telemetry, model drift monitoring, SLA breach alerts, and immutable cryptographic audit trails for state collectors.'),
      icon: Activity,
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            {t('Enterprise Architecture')}
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('Built for State Revenue & District Administration')}
          </p>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            {t('Engineered to handle high-concurrency state workloads with distributed microservices and sub-second verification APIs.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="glass-card p-8 rounded-2xl group transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
