import React, { useState } from 'react';
import { X, Building, Mail, ShieldCheck, Copy, Check, ExternalLink, Clock } from 'lucide-react';
import { useShareWithBank } from '../../hooks/useShareWithBank';
import toast from 'react-hot-toast';
import { useTranslation } from '../../i18n';

interface ShareWithBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  ulpin?: string;
}

export const ShareWithBankModal: React.FC<ShareWithBankModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  ulpin = 'ULPIN-36-RR-SER-118-02',
}) => {
  const { t } = useTranslation();
  const [bankName, setBankName] = useState('State Bank of India (SBI)');
  const [bankEmail, setBankEmail] = useState('homeloans.racpc@sbi.co.in');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { mutate: share, isPending } = useShareWithBank();

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    share(
      {
        bankName,
        bankEmail,
        ulpin,
        expiresInDays: 7,
      },
      {
        onSuccess: (res) => {
          setGeneratedLink(res.shareUrl);
          setExpiryDate(res.expiryDate);
          toast.success(t('Secure institutional link created!'));
        },
      }
    );
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success(t('Link copied to clipboard!'));
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t('Share Record with Financial Institution')}</h3>
              <p className="text-xs text-slate-400">{t('7-Day Time-Limited Encrypted Portal Access')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedLink ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Bank / Lending Institution')}</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank, SBI, ICICI Bank"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Bank Officer Email Address')}</label>
              <input
                type="email"
                required
                value={bankEmail}
                onChange={(e) => setBankEmail(e.target.value)}
                placeholder="officer@bank.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">{t('Shared Verification Dossier Includes:')}</span>
              <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                <li>{t('Authenticated Title & Sub-Registrar Deed Extract')}</li>
                <li>{t('PostGIS Cadastral Map with GIS Boundary Coordinates')}</li>
                <li>{t('Official AI Trust Score (92/100) & Non-Encumbrance Guarantee')}</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {isPending ? t('Generating Encrypted Link...') : t('Generate 7-Day Link')}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{t('Tokenized Link Generated Successfully')}</p>
                <p className="text-[11px] text-emerald-300/80 mt-0.5">
                  {t('Valid until {date}. The bank can verify your title directly from government servers.', { date: expiryDate || '' })}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Secure Verification URL')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 select-all"
                />
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t('Copied') : t('Copy')}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                {t('Done')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
