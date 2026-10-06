import React from 'react';
import { Link } from 'react-router-dom';
import { ApplicationStatus } from '../../api/types';
import { Download, Share2, UploadCloud, HelpCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../../i18n';

interface ActionButtonsProps {
  status: ApplicationStatus;
  applicationId: string;
  onShare: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  status,
  applicationId,
  onShare,
}) => {
  const { t } = useTranslation();

  const handleDownloadCertificate = () => {
    toast.success(t('Downloading Digitally Signed Mutation Sanction Certificate (PDF)...'));
  };

  const handleAppeal = () => {
    toast(t('Redirecting to District Collectorate Appellate Tribunal...'), { icon: '⚖️' });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div>
        <h4 className="text-sm font-bold text-white">{t('Available Actions')}</h4>
        <p className="text-xs text-slate-400">
          {t('Official statutory actions based on current application stage')} ({status})
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {status === 'APPROVED' && (
          <>
            <button
              onClick={handleDownloadCertificate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t('Download Signed Certificate')}</span>
            </button>
            <button
              onClick={onShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>{t('Share with Bank')}</span>
            </button>
          </>
        )}

        {status === 'CORRECTION_REQUIRED' && (
          <Link
            to={`/citizen/resubmit/${applicationId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all animate-pulse"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t('Re-upload Corrected Scan')}</span>
          </Link>
        )}

        {status === 'REJECTED' && (
          <button
            onClick={handleAppeal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('File Statutory Appeal')}</span>
          </button>
        )}

        <Link
          to="/citizen/help"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t('Need Help?')}</span>
        </Link>
      </div>
    </div>
  );
};
