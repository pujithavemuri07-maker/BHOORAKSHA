import React, { useState } from 'react';
import { X, Bell, Mail, MessageSquare, Smartphone, ShieldAlert, CheckCircle2, Send } from 'lucide-react';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';

interface NotifyOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  ulpin?: string;
  oldOwnerName?: string;
  onSuccess: (channels: string[]) => void;
}

export const NotifyOwnerModal: React.FC<NotifyOwnerModalProps> = ({
  isOpen,
  onClose,
  documentId,
  ulpin = 'KA-1234-5678-9012',
  oldOwnerName = 'Shankar (S/o Ramu)',
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(true);
  const [inApp, setInApp] = useState(true);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const currentOwner = {
    name: 'Suresh Reddy',
    phone: '+91-9876543210',
    email: 'suresh.reddy@example.gov.in',
    ulpin: ulpin,
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      const selected: string[] = [];
      if (sms) selected.push('SMS');
      if (email) selected.push('Email');
      if (inApp) selected.push('In-app');

      setIsSending(false);
      onSuccess(selected);
      toast.success(`Owner notice sent via ${selected.join(', ')}!`);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {t('oldDocuments.notifyOwner', 'Notify Current Land Owner')}
              </h2>
              <p className="text-xs text-slate-400">
                Official statutory notice for archival document discrepancy ({documentId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Owner Info Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
            Current Owner (per modern records)
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-500 block">Name:</span>
              <span className="font-bold text-white text-sm">{currentOwner.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Phone:</span>
              <span className="font-mono">{currentOwner.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 block">ULPIN:</span>
              <span className="font-mono text-emerald-400 font-bold">{currentOwner.ulpin}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Email:</span>
              <span className="font-mono truncate">{currentOwner.email}</span>
            </div>
          </div>
        </div>

        {/* Why notify explanation */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1.5 text-xs text-amber-200/90">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Why notify?</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            An archival land record shows a different owner: <strong className="text-white">"{oldOwnerName}"</strong>.
            This may indicate:
          </p>
          <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5 ml-1">
            <li>Unregistered historical transfer in the past</li>
            <li>Historical land dispute or partition omission</li>
            <li>Archival transcription variation requiring clarification</li>
          </ul>
        </div>

        {/* Channels selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Notification Channels:
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${sms ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="hidden" />
              <Smartphone className="w-4 h-4" />
              <span className="font-bold">SMS Alert</span>
            </label>
            <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${email ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} className="hidden" />
              <Mail className="w-4 h-4" />
              <span className="font-bold">Email Notice</span>
            </label>
            <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${inApp ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={inApp} onChange={(e) => setInApp(e.target.checked)} className="hidden" />
              <MessageSquare className="w-4 h-4" />
              <span className="font-bold">In-App Alert</span>
            </label>
          </div>
        </div>

        {/* Message preview */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Message Preview
          </label>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-[11px] text-slate-300 font-mono space-y-1">
            <p>"Dear Suresh Reddy,</p>
            <p className="text-slate-400">
              An archival land record (Ref: {documentId}) for ULPIN {currentOwner.ulpin} indicates a title variation
              ({oldOwnerName}). Please provide clarification at your Taluk DEO office within 15 days.
            </p>
            <p className="text-amber-400 font-bold">- Bhooraksha Revenue Operations Team"</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || (!sms && !email && !inApp)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-600/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            {isSending ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Notification</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
