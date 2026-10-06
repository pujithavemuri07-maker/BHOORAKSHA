import { useTranslation } from '../i18n';
import { X, Download, FileText, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applicationId: string;
  isGenerating?: boolean;
  certificateUrl?: string;
}

export const CertificateModal = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  isGenerating = false,
  certificateUrl,
}: CertificateModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleDownloadMockPDF = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `============================================================\n` +
        `GOVERNMENT OF TELANGANA • REVENUE ADMINISTRATION\n` +
        `BHOORAKSHA VERIFIED LAND TITLE CERTIFICATE\n` +
        `============================================================\n` +
        `Certificate No: CERT-TG-2026-${applicationId}\n` +
        `Application Reference: ${applicationId}\n` +
        `Issued by: Office of Tahsildar & Executive Magistrate\n` +
        `Verification Standard: Four-Tier AI & Multi-Officer Ratified\n` +
        `Date of Ratification: ${new Date().toLocaleDateString('en-IN')}\n` +
        `Digital Signature: SHA-256 eSign Endorsed by Tahsildar\n` +
        `Registry Sync: RoR Section 5 Dharani Verified\n` +
        `============================================================\n`
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Bhooraksha_Certificate_${applicationId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-300 rounded-xl border border-teal-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {t('revenue.certificate')}
              </h3>
              <p className="text-xs text-slate-400">
                Application: <span className="font-mono text-teal-400 font-bold">{applicationId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Card Preview */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-teal-950/40 via-slate-950 to-emerald-950/30 border border-teal-500/30 space-y-3">
          <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              State Government of Telangana
            </span>
            <span className="text-[10px] font-mono text-slate-400">CLASS-3 DSC</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-white text-sm">Certificate of Verified Land Title</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Issued under the statutory authority of the Tahsildar & Executive Magistrate. Attests zero pending encumbrances, valid cadastral alignment, and updated RoR entries.
            </p>
          </div>
          <div className="pt-2 border-t border-teal-500/20 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>QR Auth: BHOOMI-SHA256</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </div>

        {certificateUrl ? (
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('revenue.certificateReady')}</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadMockPDF}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{t('revenue.downloadCertificate')}</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300">
            {t('revenue.certificateNotReady')} Click below to generate cryptographic document.
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-slate-800">
          {!certificateUrl ? (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isGenerating}
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>{t('revenue.generateCertificate')}</span>
                </>
              )}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
