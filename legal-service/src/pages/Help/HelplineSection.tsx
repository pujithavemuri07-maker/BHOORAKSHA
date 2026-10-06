import React from 'react';
import { PhoneCall, Building2, ShieldCheck, Mail } from 'lucide-react';

export const HelplineSection: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shrink-0">
          <PhoneCall className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Advisory Helpline & Officer Support</h4>
          <p className="text-[11px] text-slate-400">
            For statutory guidance on complex title disputes and SRO coordination
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
        {/* State Legal Cell */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-500/20 text-indigo-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              State Legal Cell
            </span>
            <span className="text-xs font-bold text-white font-mono">
              040-2345-LEGAL (Ext 401)
            </span>
          </div>
        </div>

        {/* Registrar Support */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-950/50 border border-purple-500/20 text-purple-400 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Registrar Support
            </span>
            <span className="text-xs font-bold text-purple-300 font-mono">
              sro-support@bhooraksha.gov.in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
