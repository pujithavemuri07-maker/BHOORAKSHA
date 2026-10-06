import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertOctagon, AlertTriangle, KeyRound, RefreshCw, ArrowUpRight } from 'lucide-react';

interface FaqItem {
  id: string;
  q: string;
  a: string;
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
}

export const FaqAccordion: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const [openFaq, setOpenFaq] = useState<string | null>('block');

  const faqs: FaqItem[] = [
    {
      id: 'block',
      q: 'When to Block?',
      a: 'Impose an immediate Legal Block when: (1) Land is enlisted under Section 22-A prohibited property (Govt, Waqf, Inam, or Ceiling surplus), (2) An active Civil Court stay order or injunction restrains alienation, or (3) Egregious fraud / counterfeit link instruments are detected.',
      icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
      tag: 'Statutory Block',
      tagColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    },
    {
      id: 'flag',
      q: 'When to Flag?',
      a: 'Flag the case when defects are curable or require clarification: (1) Missing link documents or death certificate of ancestral owner, (2) Minor typographical name mismatch between Aadhaar and registered deed, or (3) Area extent variance requiring field verification. Issues a 15-day rectification notice.',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      tag: 'Clarification',
      tagColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    },
    {
      id: 'esign',
      q: 'How eSign works?',
      a: 'Every legal decision is cryptographically signed using your Class-3 DSC USB token or Aadhaar OTP eSign 3.0. The decision payload is hashed with SHA-256 and committed permanently to the tamper-evident government audit ledger.',
      icon: <KeyRound className="w-4 h-4 text-indigo-400" />,
      tag: 'Digital Security',
      tagColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    },
    {
      id: 'revise',
      q: 'Can decisions be revised?',
      a: 'Once eSigned, a decision cannot be silently overwritten. Revisions require a formal supplementary review petition supported by newly submitted certified orders (such as an injunction vacation decree from a competent civil court) and counter-signature by the District Registrar.',
      icon: <RefreshCw className="w-4 h-4 text-blue-400" />,
      tag: 'Review Protocol',
      tagColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    },
    {
      id: 'escalate',
      q: 'When to Escalate?',
      a: 'Escalate to the Tehsildar or Revenue Divisional Officer (RDO) when: (1) Multiple legal heirs claim conflicting succession rights without partition deeds, (2) Inter-departmental boundary conflicts arise between Revenue and Forest departments, or (3) High-value institutional fraud is suspected.',
      icon: <ArrowUpRight className="w-4 h-4 text-purple-400" />,
      tag: 'High Risk',
      tagColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quick answers to common legal scrutiny and portal operation queries
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-semibold">
          Officer FAQs
        </span>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5 pt-1">
        {filteredFaqs.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            No matching questions found for "{searchQuery}".
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                      {faq.icon}
                    </div>
                    <span className="text-xs font-bold text-white tracking-tight">
                      {faq.q}
                    </span>
                    <span
                      className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded border ${faq.tagColor}`}
                    >
                      {faq.tag}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/50">
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/40">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
