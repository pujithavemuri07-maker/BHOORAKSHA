import React from 'react';
import { HelpCircle, BookOpen, ShieldAlert, PhoneCall, Terminal, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { getRegionalConfig } from '@shared/i18n';

export const HelpPage: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/40 border border-indigo-500/20">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          Standard Operating Procedures & Knowledge Base ({regionalConfig.state})
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          {t('admin.help')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Statewide administrative guidelines, runbooks for failover events, AI model evaluation criteria, and emergency response phone trees for {regionalConfig.state}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Infrastructure Runbooks</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Step-by-step procedures for handling PostGIS database replication lag, MinIO disk pressure alerts, and Redis cluster failover.
          </p>
          <div className="space-y-2 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-[11px] text-slate-300">
              # Trigger manual replica sync<br />
              <span className="text-indigo-400">agy pg-cluster reindex --vacuum</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-[11px] text-slate-300">
              # Flush Celery stuck worker tasks<br />
              <span className="text-indigo-400">celery -A tasks purge -f</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
            <Terminal className="w-4 h-4" />
            <span>AI Model Evaluation SOP</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mandatory criteria for promoting new Chitrapathak OCR or MuRIL checkpoints to production canaries.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Indic OCR character error rate (CER) must remain below 1.8% across 18 languages.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>NER F1-Score for land parcel entities (Sy No, Extent, Khatiyan) must exceed 95.5%.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>P95 inference latency must be less than 3.0 seconds under full peak load.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Escalation Contacts ({regionalConfig.state})</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            24/7 Security Operations Center (SOC) and Department Technical Secretariat.
          </p>
          <div className="space-y-2 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="font-bold text-white">State Data Center SOC ({regionalConfig.state})</div>
              <div className="text-slate-400">Toll-Free: {regionalConfig.helplineNumber}</div>
              <div className="text-indigo-400 font-mono text-[11px]">{regionalConfig.supportEmail}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="font-bold text-white">{regionalConfig.cclaTitle} Emergency Desk</div>
              <div className="text-slate-400">Direct Line: {regionalConfig.stateCoordinator}</div>
              <div className="text-indigo-400 font-mono text-[11px]">cert-in.nodal@{regionalConfig.emailDomain.split('@')[1] || 'nic.in'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
