import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { HelpCircle, Phone, BookOpen, ChevronDown, ChevronUp, FileSpreadsheet, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function HelpPage() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'When should a DEO use the Manual Data Entry Fallback?',
      a: 'Manual data entry is triggered when the Central Land Records API (Dharani/Bhoomi) returns a 503/504 gateway timeout or when old physical settlement records have not yet been digitized. The DEO must transcribe and verify all 4 field groups (Property, Owner, Land Extent, Document) against physical Pahani registers.',
    },
    {
      q: 'What is the procedure when Owner Name has a PARTIAL MATCH?',
      a: 'Partial match indicates title or patronymic surname variations (e.g. Ramesh Kumar vs Ramesh Kumaran). The DEO should check the Aadhaar/Voter ID link in the ingested document. If the identity voucher corroborates the claimant, endorse in officer notes and forward to Girdawar.',
    },
    {
      q: 'How does the "Flag for Correction" flow notify the citizen?',
      a: 'When you submit a correction request, Bhooraksha immediately generates an automated bilingual SMS and WhatsApp dispatch to the citizen with the specific reason (e.g. illegible scan, invalid survey subdivision). The application moves to CORRECTION_REQUIRED status in the citizen portal.',
    },
    {
      q: 'When should a case be escalated to Legal or GIS review?',
      a: 'If the deed references ongoing civil suits, court stays, or unprobated gift deed succession disputes, click "Request Legal Review". If the deed boundary dimensions conflict with adjacent survey numbers or buffer zones (canal/road reserves), click "Request GIS Review".',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Help Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">
              DEO & Patwari Revenue Operations Desk (SOP)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard Operating Procedures, API Fallback Protocol & Revenue Guidelines
            </p>
          </div>
        </div>

        {/* Support channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <Phone className="w-4 h-4" />
              <span>Revenue Helpline</span>
            </div>
            <p className="text-xs text-white font-mono font-bold">1800-425-BHOOMI</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Mon - Sat (8:30 AM - 7:30 PM)</p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Patwari Handbook</span>
            </div>
            <p className="text-xs text-white font-bold">Revenue Code Vol IV</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Updated with 2026 ULPIN Rules</p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>IT & Gateway Desk</span>
            </div>
            <p className="text-xs text-white font-bold">sdc.support@telangana.gov.in</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Emergency 15-min API SLA</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
          Frequently Asked Questions (DEO Protocol)
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-slate-950/60 border border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left text-xs font-bold text-white hover:text-amber-400 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-4 pb-4 text-xs text-slate-400 border-t border-slate-800/80 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
