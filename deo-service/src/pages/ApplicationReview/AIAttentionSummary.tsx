import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Filter,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DEOApplication, ValidationItem } from '../../api/types';

interface AIAttentionSummaryProps {
  application: DEOApplication;
  onSelectField?: (fieldName: string) => void;
  onEditField?: (fieldKey: string) => void;
}

export const AIAttentionSummary: React.FC<AIAttentionSummaryProps> = ({
  application,
  onSelectField,
  onEditField,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'RED' | 'YELLOW' | 'GREEN'>('ALL');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const autoVerifiedItems = [
    {
      field: 'Survey Number & Sub-Division',
      value: `${application.extractedData.propertyDetails.surveyNumber} (${application.extractedData.propertyDetails.subDivision || 'P-1'})`,
      confidence: 99,
      status: 'MATCH',
      source: 'Sale Deed (Page 3) = Dharani 2026 Master Cadastre',
    },
    {
      field: 'Total Land Extent Area',
      value: `${application.extractedData.landDetails.area} ${application.extractedData.landDetails.unit}`,
      confidence: 98,
      status: 'MATCH',
      source: 'Deed Schedule = Vector Polygon Cadastre',
    },
    {
      field: 'Registration Docket Number',
      value: application.extractedData.documentDetails.registrationNumber || 'REG-2025-789',
      confidence: 99,
      status: 'MATCH',
      source: 'SRO Book-1 Central Index Match',
    },
  ];

  const attentionItems = [
    {
      id: 'owner-name',
      severity: 'YELLOW',
      field: 'Owner Legal Name',
      deedValue: application.extractedData.ownerDetails.name,
      govtValue: application.govtRecord?.ownerDetails.name || 'Ramesh Kumaran',
      confidence: 88,
      issue: 'Surname / Title variation detected: "Kumar" vs "Kumaran". Requires DEO verification or inline correction.',
      actionLabel: 'Correct Owner Name',
      fieldKey: 'name',
      section: 'ownerDetails',
    },
    {
      id: 'reg-date',
      severity: 'RED',
      field: 'Registration Stamp Date',
      deedValue: application.extractedData.documentDetails.registrationDate || '20 Dec 2025',
      govtValue: application.govtRecord?.documentDetails.registrationDate || '15 Jan 2026',
      confidence: 68,
      issue: '26-day discrepancy between deed execution date and SRO central book stamp date.',
      actionLabel: 'Verify Stamp Date',
      fieldKey: 'registrationDate',
      section: 'documentDetails',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                AI VALIDATION & ATTENTION REQUIRED
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                Exception-First Workspace
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Only review flagged exceptions. Auto-verified high-confidence fields require no manual re-typing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                filter === 'ALL' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (5)
            </button>
            <button
              onClick={() => setFilter('RED')}
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                filter === 'RED' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Critical (1)
            </button>
            <button
              onClick={() => setFilter('YELLOW')}
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                filter === 'YELLOW' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Attention (1)
            </button>
            <button
              onClick={() => setFilter('GREEN')}
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                filter === 'GREEN' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Auto-Verified (3)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          {/* Critical Red & Yellow Attention Cards */}
          {(filter === 'ALL' || filter === 'RED' || filter === 'YELLOW') && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Exceptions Requiring DEO Verification / Correction (2)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {attentionItems
                  .filter((item) => filter === 'ALL' || filter === item.severity)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        item.severity === 'RED'
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                          : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.severity === 'RED' ? (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                          <span className="font-bold text-xs text-white">{item.field}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            item.severity === 'RED'
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          }`}
                        >
                          {item.severity === 'RED' ? 'Critical Conflict' : 'Attention Required'}
                        </span>
                      </div>

                      <div className="mt-2.5 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Deed OCR:</span>
                          <span className="text-white font-bold">{item.deedValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Govt Master:</span>
                          <span className="text-amber-400 font-bold">{item.govtValue}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{item.issue}</p>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">Confidence: {item.confidence}%</span>
                        {onEditField && (
                          <button
                            type="button"
                            onClick={() => onEditField(item.fieldKey)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Auto-Verified Green Cards */}
          {(filter === 'ALL' || filter === 'GREEN') && (
            <div className="space-y-2.5 pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Verified High-Confidence Fields (3) — Zero Retyping</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {autoVerifiedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950/70 border border-emerald-500/20 rounded-2xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{item.field}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        ✓ {item.confidence}%
                      </span>
                    </div>
                    <p className="text-xs font-mono font-bold text-white">{item.value}</p>
                    <p className="text-[10px] text-slate-400">{item.source}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
