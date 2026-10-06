import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, FileText, Clock } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface ProcessingCompleteProps {
  applicationId: string;
}

export const ProcessingComplete: React.FC<ProcessingCompleteProps> = ({ applicationId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="text-center py-8 px-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          {t('Upload & AI Verification Ingested')}
        </span>
        <h2 className="text-2xl font-black text-white mt-3">{t('Document Uploaded Successfully!')}</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {t('Your land record has been securely encrypted and dispatched to the multi-agent AI verification engine.')}
        </p>
      </div>

      {/* Generated Application ID Box */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center gap-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t('Official Application Tracking ID')}
        </span>
        <span className="text-2xl font-mono font-black text-emerald-400 select-all">
          {applicationId}
        </span>
        <span className="text-[11px] text-slate-500 mt-1">
          {t('Save this ID to track live field officer review and mutation approval')}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to={`/citizen/applications/${applicationId}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
        >
          <span>{t('Track Application Now')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/citizen/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          <span>{t('Back to Dashboard')}</span>
        </Link>
      </div>
    </div>
  );
};
