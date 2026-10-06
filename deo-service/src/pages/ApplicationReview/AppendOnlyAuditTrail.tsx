import React, { useState } from 'react';
import { Shield, User, Bot, Clock, ChevronDown, ChevronUp, CheckCircle2, FileText, Info, Edit3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DEOApplication } from '../../api/types';

interface AppendOnlyAuditTrailProps {
  application?: DEOApplication;
}

interface AuditEvent {
  id: string;
  who: string;
  what: string;
  when: string;
  why: string;
  actorType: 'OFFICER' | 'AI_SYSTEM' | 'STATE_API';
}

const BASE_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud-01',
    when: '15 Sep 2026 18:02:10 IST',
    who: 'DEO Suresh G. Patil (Officer ID: DEO-TG-5501)',
    what: 'Viewed Application & Initiated Scrutiny',
    why: 'Routine maker verification queue intake for Gachibowli village conveyance deed.',
    actorType: 'OFFICER',
  },
  {
    id: 'aud-02',
    when: '15 Sep 2026 18:05:32 IST',
    who: 'ChitraPathak-1 Multimodal AI Engine',
    what: 'AI Automated Validation Completed • Risk Score: 68',
    why: 'Extracted entities and flagged 2 discrepancies: Surname partial match & 26-day registration date offset.',
    actorType: 'AI_SYSTEM',
  },
  {
    id: 'aud-03',
    when: '15 Sep 2026 18:07:45 IST',
    who: 'State Land Records Master API Gateway',
    what: 'Cross-Document Registry Live Sync',
    why: 'Fetched certified ROR 1B Khata #KH-88214 record and 30-year SRO transaction history.',
    actorType: 'STATE_API',
  },
  {
    id: 'aud-04',
    when: '15 Sep 2026 18:09:18 IST',
    who: 'DEO Suresh G. Patil (Officer ID: DEO-TG-5501)',
    what: 'Requested GIS Spatial Review',
    why: 'Observed potential 0.01 acre southern canal reserve buffer overlap in BhooNaksha cadastre.',
    actorType: 'OFFICER',
  },
  {
    id: 'aud-05',
    when: '15 Sep 2026 18:10:00 IST',
    who: 'GIS Specialist & Revenue Verifier Queue',
    what: 'Review Pending Scrutiny & Field Inspection',
    why: 'Under active review for physical passbook verification and boundary demarcation.',
    actorType: 'OFFICER',
  },
];

export const AppendOnlyAuditTrail: React.FC<AppendOnlyAuditTrailProps> = ({ application }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Convert application field corrections into dynamic audit events
  const correctionEvents: AuditEvent[] = (application?.fieldCorrections || []).map((corr) => ({
    id: corr.id,
    when: corr.timestamp || '16 Sep 2026, 5:20 PM',
    who: `${corr.officerName || 'Suresh G. Patil'} (Officer ID: ${corr.officerId || 'DEO-TG-5501'})`,
    what: `DEO Corrected Field: ${corr.fieldLabel || corr.field}`,
    why: `Old: "${corr.oldValue || corr.originalAiValue}" → New: "${corr.newValue || corr.correctedValue}". Reason: ${corr.reason}`,
    actorType: 'OFFICER',
  }));

  const allEvents = [...correctionEvents, ...BASE_AUDIT_EVENTS];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Append-Only Audit Trail ({allEvents.length} Events Recorded)
            </h3>
            <p className="text-xs text-slate-400">
              Statutory audit log recording who, what, when, and why for every dossier transition & field correction
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-semibold"
        >
          <span>{isExpanded ? 'Collapse Log' : 'Expand Log'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {allEvents.map((evt) => {
            const isCorrection = evt.what.includes('Corrected Field');
            return (
              <div
                key={evt.id}
                className={cn(
                  'rounded-2xl p-4 text-xs space-y-2 transition-colors border',
                  isCorrection
                    ? 'bg-sky-950/40 border-sky-500/40'
                    : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isCorrection ? (
                      <Edit3 className="w-4 h-4 text-sky-400" />
                    ) : evt.actorType === 'AI_SYSTEM' ? (
                      <Bot className="w-4 h-4 text-amber-400" />
                    ) : evt.actorType === 'STATE_API' ? (
                      <FileText className="w-4 h-4 text-blue-400" />
                    ) : (
                      <User className="w-4 h-4 text-emerald-400" />
                    )}
                    <strong className={cn('text-xs font-bold', isCorrection ? 'text-sky-300' : 'text-white')}>
                      {evt.what}
                    </strong>
                    {isCorrection && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        Immutable Audit Entry
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {evt.when}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1 border-t border-slate-800/60 text-[11px]">
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px] block">WHO (Officer / Actor)</span>
                    <span className="font-medium text-slate-200">{evt.who}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px] block">WHAT & WHY (Rationale / Old → New)</span>
                    <span className={cn('italic block', isCorrection ? 'text-amber-300 font-mono' : 'text-slate-300')}>
                      {evt.why}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
