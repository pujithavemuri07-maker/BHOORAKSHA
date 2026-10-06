import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, FileQuestion, Video, ChevronDown, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../i18n';

interface FAQItem {
  question: string;
  answer: string;
}

export const HelpPage: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS: FAQItem[] = [
    {
      question: t('How long does the AI verification process take?'),
      answer: t('The automated AI pipeline (Indic OCR, MuRIL NER, PostGIS boundary match, and risk scoring) completes within 2 to 5 minutes. Subsequent human inspection by the Village Revenue Officer (Patwari) and Girdawar typically takes 24 to 48 business hours.'),
    },
    {
      question: t('What documents are eligible for upload?'),
      answer: t('Registered Sale Deeds (Kraya Patram), Rythu Seva / Pattadar Passbooks, Encumbrance Certificates (EC), Partition Deeds, Gift Settlement Deeds, and Succession Certificates in PDF, JPG, or PNG format (up to 15MB).'),
    },
    {
      question: t('What should I do if my document is flagged with "Correction Required"?'),
      answer: t('Click the "Re-upload Corrected Scan" button on your application page. Common reasons include low scan resolution (<300 DPI), missing schedule pages, or poor contrast on old stamp paper.'),
    },
    {
      question: t('How does the "Share with Bank" feature work?'),
      answer: t('Once your mutation is approved by the Tehsildar, you can generate an encrypted, time-limited 7-day token link. When shared with your lending bank officer, they can directly verify your title authenticity, cadastral coordinates, and non-encumbrance status from government servers without physical visits.'),
    },
    {
      question: t('Is Bhooraksha available in regional Indian languages?'),
      answer: t('Yes, Bhooraksha supports 18 official Indian languages: English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Urdu, Sanskrit, Konkani, Maithili, Kashmiri, and Nepali.'),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white">{t('Citizen Help & Support Center')}</h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('Everything you need to know about land title verification, mutation tracking, and e-certificates')}
        </p>
      </div>

      {/* Helpline Contact Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('Toll-Free Helpline')}</h4>
          <p className="text-sm font-mono font-bold text-emerald-400">1800-BHOO-RAKSHA</p>
          <p className="text-[11px] text-slate-500">{t('Mon - Sat (9:00 AM - 6:00 PM IST)')}</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('Citizen Grievances')}</h4>
          <p className="text-sm font-mono font-semibold text-slate-300">support@bhooraksha.gov.in</p>
          <p className="text-[11px] text-slate-500">{t('24-hour response SLA')}</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('Video Walkthroughs')}</h4>
          <p className="text-sm font-semibold text-purple-400">{t('Step-by-Step Tutorials')}</p>
          <p className="text-[11px] text-slate-500">{t('In 18 Regional Languages')}</p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <FileQuestion className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t('Frequently Asked Questions (FAQ)')}
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-800/80 bg-slate-950 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-slate-400 transition-transform flex-shrink-0',
                      isOpen && 'rotate-180 text-emerald-400'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 border-t border-slate-800/60 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default HelpPage;
