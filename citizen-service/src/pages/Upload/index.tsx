import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileCheck, Lock } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { UploadWizard } from './UploadWizard';

export const UploadDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/citizen/dashboard')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t('Upload Land Record for Verification')}
          </h1>
          <p className="text-xs text-slate-400">
            {t('Submit Registered Sale Deed, Pattadar Passbook, or Title Certificate for automated AI verification')}
          </p>
        </div>
      </div>

      {/* Main Wizard */}
      <UploadWizard />

      {/* Security & Support Footer Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-400 text-xs">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{t('PostGIS Cadastral Overlap Engine')}</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <FileCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>{t('ChitraPathak-1 Indic OCR (13 Scripts)')}</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <Lock className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>{t('Immutable PostgreSQL Audit Trail')}</span>
        </div>
      </div>
    </div>
  );
};
export default UploadDocumentPage;
