import React, { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface ActItem {
  id: string;
  name: string;
  purpose: string;
  keySections: string;
  officerRole: string;
}

export const LegalActsTable: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const [expandedAct, setExpandedAct] = useState<string | null>(null);

  const acts: ActItem[] = [
    {
      id: 'topa',
      name: 'Transfer of Property Act, 1882',
      purpose: 'Governs sale, mortgage, gift, and lease of immovable property.',
      keySections: 'Sec 41 (Ostensible owner), Sec 52 (Lis Pendens / Court Stay), Sec 54 (Sale Deed).',
      officerRole: 'Ensure vendor holds absolute transferable title without active pending litigation.',
    },
    {
      id: 'reg',
      name: 'Registration Act, 1908',
      purpose: 'Mandates compulsory registration of deeds and checks prohibited land.',
      keySections: 'Sec 17 (Compulsory registration), Sec 22-A (Prohibited government/Waqf land).',
      officerRole: 'Verify deed registration validity and confirm parcel is clear from Sec 22-A list.',
    },
    {
      id: 'hsa',
      name: 'Hindu Succession Act, 1956',
      purpose: 'Governs inheritance, coparcenary rights, and partition of ancestral land.',
      keySections: 'Sec 6 (Equal coparcenary rights of daughters), Sec 8 (General succession rules).',
      officerRole: 'Check legal heir tree and verify consent or release deeds from all legal coparceners.',
    },
    {
      id: 'stamp',
      name: 'Indian Stamp Act, 1899',
      purpose: 'Regulates stamp duty payments and prevents property undervaluation.',
      keySections: 'Sec 27 (True valuation disclosure), Sec 47-A (Undervaluation and deficit recovery).',
      officerRole: 'Audit guideline market value and flag any deficit stamp duty or bogus exemptions.',
    },
    {
      id: 'cpc',
      name: 'Civil Procedure Code, 1908',
      purpose: 'Enforces civil court injunctions, temporary stays, and caveats.',
      keySections: 'Order 39 Rules 1 & 2 (Injunctions against alienation of property).',
      officerRole: 'Place immediate statutory hold if active injunction order is uploaded or discovered.',
    },
    {
      id: 'benami',
      name: 'Benami Transactions Act, 1988',
      purpose: 'Prohibits holding property in fictitious names or illegal proxies.',
      keySections: 'Sec 3 (Prohibition of benami transfers), Sec 5 (Confiscation of benami land).',
      officerRole: 'Confirm genuine consideration and verified KYC identity of the actual purchaser.',
    },
  ];

  const filteredActs = acts.filter(
    (act) =>
      act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.keySections.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDetails = (id: string) => {
    setExpandedAct(expandedAct === id ? null : id);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Legal Acts & Statutory References</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Core statutory acts governing property transactions and officer duties
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 font-semibold">
          6 Key Acts
        </span>
      </div>

      {/* Simplified Acts Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
              <th className="py-3 px-4 w-1/3">Act Name</th>
              <th className="py-3 px-4">Purpose</th>
              <th className="py-3 px-4 text-right w-36">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredActs.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500 text-xs">
                  No matching legal acts found for "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredActs.map((act) => {
                const isExpanded = expandedAct === act.id;
                return (
                  <React.Fragment key={act.id}>
                    <tr
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isExpanded ? 'bg-purple-950/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{act.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 leading-relaxed">
                        {act.purpose}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => toggleDetails(act.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isExpanded
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                              : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700'
                          }`}
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Details Row */}
                    {isExpanded && (
                      <tr className="bg-slate-950/70 border-b border-purple-500/20">
                        <td colSpan={3} className="p-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                              <span className="text-[10px] font-mono uppercase font-bold text-purple-400 block tracking-wider">
                                Key Statutory Provisions
                              </span>
                              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                                {act.keySections}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-wider flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                Officer Verification Mandate
                              </span>
                              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                                {act.officerRole}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
