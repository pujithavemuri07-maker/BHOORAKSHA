import React from 'react';
import { Quote } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Testimonials: React.FC = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: t(
        'Allows landowners to upload deeds, verify document scan quality in real-time, and track multi-agent verification progress across 13 Indian interface languages.'
      ),
      author: t('Citizen & Applicant Workflow'),
      role: t('Landowner Self-Service'),
      location: t('Citizen Portal (Port 3000)'),
    },
    {
      quote: t(
        'Enforces a strict maker-checker governance model: Patwari data extraction review paired with Girdawar side-by-side comparison against official revenue ledgers.'
      ),
      author: t('Revenue Field Verification'),
      role: t('Patwari & Girdawar Operations'),
      location: t('DEO & Verifier Portals (Ports 3001-3002)'),
    },
    {
      quote: t(
        'Integrates multi-layered scrutiny: civil court caveat audits, PostGIS cadastral boundary overlap calculations, and tamper-evident audit ledger entries before Tehsildar sanction.'
      ),
      author: t('Statutory Adjudication'),
      role: t('Legal, GIS & Executive Administration'),
      location: t('Legal, GIS & Revenue Portals (Ports 3003-3005)'),
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            {t('Workflow Architecture')}
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('Designed for Revenue Administration')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div key={idx} className="glass-card p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-emerald-400 mb-4 opacity-60" />
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="text-sm font-bold text-white">{item.author}</div>
                <div className="text-xs text-emerald-400 font-medium">{item.role}</div>
                <div className="text-[11px] text-slate-500">{item.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
