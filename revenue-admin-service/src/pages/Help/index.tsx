import React from 'react';
import { useTranslation } from '../../i18n';
import { getRegionalConfig } from '@shared/i18n';
import {
  HelpCircle,
  FileCheck2,
  AlertTriangle,
  Phone,
  Layers,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);

  const sopChecklist = [
    {
      step: '1. Multi-Desk Concurrence',
      desc: 'Verify that all 4 officer reviews (DEO, Revenue Verifier, Legal Officer, and GIS Specialist) show positive clearances with zero unmitigated anomalies.',
    },
    {
      step: '2. Spatial Overlay Integrity',
      desc: 'Confirm the Cadastral survey boundary overlay shows zero overlap with government, forest, or disputed khata numbers.',
    },
    {
      step: '3. Encumbrance & Title Search',
      desc: 'Ensure no lis pendens or court stay orders are reported in the Sub-Registrar or District Court litigation registers.',
    },
    {
      step: '4. Executive Magistrate Endorsement',
      desc: `Provide specific statutory remarks referencing Section 40 and initiate mutation packet dispatch to ${regionalConfig.portalName}.`,
    },
    {
      step: '5. Verification Report Issuance',
      desc: 'Generate the cryptographic QR-backed Bhooraksha Verification Report and review parcel status.',
    },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t('common.help')}
          </h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Standard Operating Procedures ({regionalConfig.state})
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Revenue Administration statutory guidelines, Tamper-Evident Ledger compliance, and emergency contacts.
        </p>
      </div>

      {/* SOP Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Tehsildar Adjudication Checklist (Statutory Protocol)
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          {sopChecklist.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3.5"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">{item.step}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Revenue Helpline & NIC Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Phone className="w-4 h-4" />
            <span>Revenue Support &amp; Technical Desk ({regionalConfig.state})</span>
          </div>
          <p className="text-xs text-slate-400">
            For registry synchronization issues, HSM token connectivity, or {regionalConfig.portalName} API failures:
          </p>
          <div className="space-y-1.5 text-xs font-mono pt-1">
            <p className="text-slate-200">
              {regionalConfig.cclaTitle}: <strong className="text-white">{regionalConfig.helplineNumber}</strong>
            </p>
            <p className="text-slate-200">
              NIC State Coordinator: <strong className="text-white">{regionalConfig.stateCoordinator}</strong>
            </p>
            <p className="text-slate-200">
              Email:{' '}
              <strong className="text-indigo-300">{regionalConfig.supportEmail}</strong>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Fraud Reporting Protocol</span>
          </div>
          <p className="text-xs text-slate-400">
            If fraudulent conveyance, impersonation, or duplicate patta issuance is detected:
          </p>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            Immediately trigger <strong>Final Rejection</strong> with category{' '}
            <code className="text-amber-400 font-mono">fraud_detected</code>. The Bhooraksha
            AI agent will auto-dispatch an alert to the District Collector and Special Investigation Team (SIT).
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
