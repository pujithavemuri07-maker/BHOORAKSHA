import React, { useState } from 'react';
import { Search, BookOpen, X, Sparkles } from 'lucide-react';
import { QuickActionCards } from './QuickActionCards';
import { ReviewWorkflowCards } from './ReviewWorkflowCards';
import { OfficerActionGuide } from './OfficerActionGuide';
import { LegalActsTable } from './LegalActsTable';
import { FaqAccordion } from './FaqAccordion';
import { HelplineSection } from './HelplineSection';

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickActionSelect = (topic: string) => {
    setSearchQuery(topic);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>SOP & Legal Reference Manual</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Practical desk guide, statutory verification rules, and officer decision protocols
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-purple-300 font-medium">
            Govt. Legal Edition v2.4
          </span>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-purple-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SOPs, legal references, procedures, or topics..."
            className="w-full pl-11 pr-10 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3.5 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-[11px] text-purple-300 flex items-center gap-1.5 px-2">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Filtering references for: <strong className="text-white">"{searchQuery}"</strong></span>
            <button
              type="button"
              onClick={handleClearSearch}
              className="underline text-slate-400 hover:text-slate-200 ml-2"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* 3. QUICK ACTION CARDS (6 CARDS) */}
      <QuickActionCards onSelectCategory={handleQuickActionSelect} />

      {/* 4. STANDARD LEGAL REVIEW WORKFLOW (5-STEP SCURTINY HORIZONTAL CARDS) */}
      <ReviewWorkflowCards />

      {/* 5. OFFICER ACTION GUIDE ("IF THIS HAPPENS -> OFFICER SHOULD DO THIS") */}
      <OfficerActionGuide />

      {/* 6. LEGAL ACTS & STATUTORY REFERENCES (TABLE WITH SHORT DESCRIPTIONS & VIEW DETAILS) */}
      <LegalActsTable searchQuery={searchQuery} />

      {/* 7. FAQS (5 ACCORDION CARDS) */}
      <FaqAccordion searchQuery={searchQuery} />

      {/* 8. HELPLINE (STATE LEGAL CELL & REGISTRAR SUPPORT) */}
      <HelplineSection />
    </div>
  );
};

export default HelpPage;
