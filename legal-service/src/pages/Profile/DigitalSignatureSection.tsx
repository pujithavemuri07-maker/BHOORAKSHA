import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Lock, KeyRound } from 'lucide-react';

export const DigitalSignatureSection: React.FC = () => {
  const securityItems = [
    { label: 'Government Officer Account', status: 'Verified & Active', verified: true },
    { label: 'Professional Bar Credential', status: 'Verified by State Bar Council', verified: true },
    { label: 'Digital Signature Status', status: 'Active (eSign 3.0)', verified: true },
    { label: 'eSign Implementation Mode', status: 'Demo eSign Status (Simulated)', isMono: true },
    { label: 'Digital Signature Provider', status: 'Hardware Cryptographic Token (E-PASS2003)', isMono: true },
    { label: 'Last Credential Verification', status: '12 January 2024', isMono: true },
    { label: 'Last Signature Activity', status: '07 September 2026, 05:15 PM', isMono: true },
    { label: 'Certificate Validity Window', status: 'Valid till 31 December 2027', isMono: true },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Digital Signature & Account Verification</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographic signing certificate status, credential verification timestamp, and signing subsystem
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          eSign 3.0 Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        {securityItems.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {item.label}
            </span>
            <div
              className={`font-semibold text-slate-100 ${
                item.isMono ? 'font-mono text-indigo-300 text-[11px]' : ''
              }`}
            >
              {item.status}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-400">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Hardware cryptographic token validated for SHA-256 digital seals. Private keys and PIN tokens remain securely stored on hardware.</span>
      </div>
    </div>
  );
};
