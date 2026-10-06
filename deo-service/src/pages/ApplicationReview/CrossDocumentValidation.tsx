import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp, FileSearch } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CrossDocRow {
  field: string;
  saleDeed: string;
  rorRecord: string;
  registryRecord: string;
  mutationRecord: string;
  cadastralGis: string;
  status: 'MATCH' | 'PARTIAL' | 'MISMATCH';
  reason: string;
  provenance: string;
}

const COMPARISON_DATA: CrossDocRow[] = [
  {
    field: 'Owner / Claimant',
    saleDeed: 'Ramesh Kumar',
    rorRecord: 'Ramesh Kumaran',
    registryRecord: 'Ramesh Kumaran',
    mutationRecord: 'Ramesh Kumaran',
    cadastralGis: 'Ramesh Kumaran',
    status: 'PARTIAL',
    reason: 'Honorific / surname suffix variation ("Kumar" in Deed vs "Kumaran" in State Records). Phonetic confidence: 88%. Officer manual physical Aadhaar / ID voucher proofing required.',
    provenance: 'Sale Deed Pg 1 vs RoR 1B Khata #KH-88214',
  },
  {
    field: 'Survey / Hissa No.',
    saleDeed: '123/456 (P-1)',
    rorRecord: '123/456 (P-1)',
    registryRecord: '123/456 (P-1)',
    mutationRecord: '123/456 (P-1)',
    cadastralGis: '123/456 (P-1)',
    status: 'MATCH',
    reason: 'Exact 100% token-level and cadastral polygon match across all 5 state and submitted records.',
    provenance: 'Deed Pg 3 vs Village Cadastral Sheet 2026',
  },
  {
    field: 'Total Land Area',
    saleDeed: '2.50 Acres',
    rorRecord: '2.50 Acres',
    registryRecord: '2.50 Acres',
    mutationRecord: '2.50 Acres',
    cadastralGis: '2.49 Acres',
    status: 'MATCH',
    reason: 'GIS mapped geometry is 2.49 acres (0.01 acre difference from 2.50 acre recorded deed), within statutory 0.5% cadastral survey tolerance.',
    provenance: 'Schedule A vs BhooNaksha GIS Vector Shapefile',
  },
  {
    field: 'Registration Date',
    saleDeed: '20 Dec 2025',
    rorRecord: '-- (RoR)',
    registryRecord: '15 Jan 2026',
    mutationRecord: '15 Jan 2026',
    cadastralGis: '-- (Spatial)',
    status: 'MISMATCH',
    reason: 'Deed execution stamp date is 20 Dec 2025 whereas Central SRO Registration Index Volume reflects 15 Jan 2026 (26-day difference). Likely stamp execution vs final SRO admission delay.',
    provenance: 'Deed Stamp Header vs SRO Book I Entry',
  },
  {
    field: 'Land Classification',
    saleDeed: 'Agricultural (Wet)',
    rorRecord: 'Wet / Tari',
    registryRecord: 'Agricultural',
    mutationRecord: 'Agricultural Wet',
    cadastralGis: 'Wet Crop Zone',
    status: 'MATCH',
    reason: 'All records classify parcel as agricultural wet/tari land with minor irrigation canal access.',
    provenance: 'Pahani Column 12 vs Schedule C',
  },
  {
    field: 'Prior Title Vendor',
    saleDeed: 'Suresh V. Rao',
    rorRecord: 'Suresh V. Rao (2017)',
    registryRecord: 'Suresh V. Rao',
    mutationRecord: 'MUT-2017-0234',
    cadastralGis: '--',
    status: 'MATCH',
    reason: 'Vendor lineage verified against 2017 mutation order and previous encumbrance statement.',
    provenance: 'Prior Title Deed 1102/2017 vs SRO Index',
  },
];

export const CrossDocumentValidation: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>('Registration Date');

  const toggleRow = (field: string) => {
    setExpandedRow(expandedRow === field ? null : field);
  };

  const getStatusBadge = (status: 'MATCH' | 'PARTIAL' | 'MISMATCH') => {
    switch (status) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
            <CheckCircle2 className="w-3 h-3" />
            ✓ Match
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-mono">
            <AlertTriangle className="w-3 h-3" />
            ⚠ Partial
          </span>
        );
      case 'MISMATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-mono">
            <XCircle className="w-3 h-3" />
            ✕ Mismatch
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Cross-Document Validation
            </h3>
            <p className="text-xs text-slate-400">
              Comparison across submitted documents and authorized government records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">5 Source Streams Linked:</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 font-mono text-[11px]">
            Deed • RoR • SRO • Mutation • GIS
          </span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <th className="py-3 px-4">Field Attribute</th>
              <th className="py-3 px-4">Sale Deed (Citizen)</th>
              <th className="py-3 px-4">RoR / Pattadar</th>
              <th className="py-3 px-4">SRO Registry Book</th>
              <th className="py-3 px-4">Mutation Sanction</th>
              <th className="py-3 px-4">Cadastral GIS</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {COMPARISON_DATA.map((row) => (
              <React.Fragment key={row.field}>
                <tr className={cn(
                  'hover:bg-slate-800/40 transition-colors',
                  row.status === 'MISMATCH' ? 'bg-rose-500/[0.02]' : row.status === 'PARTIAL' ? 'bg-amber-500/[0.02]' : ''
                )}>
                  <td className="py-3 px-4 font-bold text-slate-200 whitespace-nowrap">
                    {row.field}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {row.saleDeed}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {row.rorRecord}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {row.registryRecord}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {row.mutationRecord}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {row.cadastralGis}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleRow(row.field)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20"
                    >
                      <span>Why?</span>
                      {expandedRow === row.field ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </td>
                </tr>

                {/* Expandable Explanation Drawer */}
                {expandedRow === row.field && (
                  <tr className="bg-slate-950/90 border-y border-amber-500/20">
                    <td colSpan={8} className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" />
                            Discrepancy Analysis & Reconciliation Guidance:
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {row.reason}
                          </p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex-shrink-0 text-right">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                            Audit Data Provenance
                          </span>
                          <span className="text-[11px] text-slate-300 font-mono font-medium">
                            {row.provenance}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
