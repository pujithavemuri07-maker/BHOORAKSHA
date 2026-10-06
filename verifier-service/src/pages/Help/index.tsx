import { useState } from 'react';
import { useTranslation } from '../../i18n';
import { getRegionalConfig } from '@shared/i18n';
import { HelpCircle, BookOpen, PhoneCall, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HelpPage() {
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sopSteps = [
    '1. Review Application Summary (Verify App ID, citizen details, survey number, and review cycle).',
    '2. Check Document Completeness (Ensure required sale deed, RoR, identity proof, title deed, and cadastral map are available).',
    '3. Inspect Source Documents (Open tabbed document viewer, inspect stamps, seals, page count, and page zoom).',
    '4. Review AI Extraction (Examine 4 structured categories: Cadastral, Ownership, Land Extent, Instrument).',
    '5. Cross-Check Government Record (Compare extracted deed parameters side-by-side with Pahani/Dharani cross-check data).',
    '6. Review Transaction History (Verify unbroken historical chain of title lineage from 2019 to 2026).',
    '7. Review GIS Spatial Validation (Check satellite parcel boundary overlay, recorded area vs GIS calculated area, and tolerance).',
    '8. Inspect Discrepancy Warnings & Conflicts (Analyze name variations, date differences, or survey flags).',
    '9. Complete Interactive Verification Checklist (Toggle all 12 mandatory statutory checklist items).',
    '10. Record Verifier Inspection Notes (Document explicit observations and save notes to persistent database).',
    '11. Take Workflow Decision (Execute Approve & Forward, Return to DEO with selectable fields, Reject, or Escalate).',
  ];

  const faqs = [
    {
      q: 'What is AI extraction confidence?',
      a: 'AI extraction confidence represents the OCR/NER probability score (0% to 100%) indicating how accurately the AI extracted characters and fields from the scanned document images. It does NOT represent legal ownership validity.',
    },
    {
      q: 'What is Review Priority?',
      a: 'Review Priority (0 to 100) is a queue prioritization metric calculated based on extracted data consistency, boundary deviations, document completeness, and historical records. A lower score (e.g. <50) assigns HIGH review priority for verifier scrutiny, but does NOT mean fraud or automatic rejection.',
    },
    {
      q: 'When should I Return an application to DEO?',
      a: 'Return to DEO when procedural deficiencies exist, such as missing required documents, surname variations requiring VRO physical 1B verification, or illegible deed page rescans. Always select the specific fields requiring correction and provide clear detailed instructions.',
    },
    {
      q: 'When should I Escalate an application to Revenue Admin (Tahsildar)?',
      a: 'Escalate when complex ownership disputes, civil court stays (Section 22-A prohibited properties), major GIS spatial boundary overlaps, or unresolved high-risk legal discrepancies require Tahsildar Executive Magistrate intervention.',
    },
    {
      q: 'What does a GIS Mismatch mean?',
      a: 'A GIS mismatch indicates that the satellite/cadastral mapped parcel area differs from the deed/Pahani recorded extent beyond configured statutory tolerance (e.g., > 0.02 Acres). It helps flag possible boundary encroachments but is not automatically a legal dispute.',
    },
    {
      q: 'What does Partial Name Match mean?',
      a: 'Partial Name Match indicates minor spelling variations, middle-name differences, or surname expansions (e.g., Ramesh Kumar vs Ramesh Kumar Patel). It is a potential discrepancy for verification, NOT evidence of fraud.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-slate-100 tracking-tight">
          {t('common.help')} ({regionalConfig.state})
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Standard Operating Procedure (SOP) & Statutory Guidelines for Land Record Verifiers in {regionalConfig.state}
        </p>
      </div>

      {/* Emergency Revenue Hotline Card */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Revenue Officers Helpline & Technical Desk ({regionalConfig.state})</h3>
            <p className="text-xs text-slate-400 mt-0.5">Toll-Free Revenue Department Operations Support (9:00 AM – 6:00 PM)</p>
            <div className="text-emerald-400 font-mono font-bold text-lg mt-1">{regionalConfig.helplineNumber}</div>
          </div>
        </div>
        <div className="text-xs text-slate-400 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
          <div>NIC Coordinator: <strong className="text-slate-200 font-mono">{regionalConfig.stateCoordinator}</strong></div>
          <div>Support Email: <span className="text-slate-300 font-mono">{regionalConfig.supportEmail}</span></div>
        </div>
      </div>

      {/* 11-Step SOP Guide */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          11-Step Verifier Standard Operating Procedure (SOP)
        </h3>
        <div className="space-y-2 text-xs text-slate-300">
          {sopSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div className="leading-relaxed font-medium">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          Verifier Operational Guidance & Core Concepts
        </h3>
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 py-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 bg-slate-950/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
