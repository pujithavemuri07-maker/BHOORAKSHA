import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { X, Send, ShieldCheck, AlertTriangle, UserCheck } from 'lucide-react';
import { useVerifiers } from '../hooks/useVerifiers';
import { cn } from '../lib/utils';

import { classifyRisk } from '../utils/riskClassification';

interface ForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (verifierId: string, remarks: string) => void;
  applicationId: string;
  riskScore: number;
  defaultRemarks?: string;
}

export const ForwardModal: React.FC<ForwardModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationId,
  riskScore,
  defaultRemarks = '',
}) => {
  const { t } = useTranslation();
  const [verifierId, setVerifierId] = useState('');
  const [remarks, setRemarks] = useState(defaultRemarks);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: verifiers, isLoading } = useVerifiers();
  const risk = classifyRisk(riskScore);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!verifierId && verifiers && verifiers.length > 0) {
      // Default to first verifier if not chosen
      setVerifierId(verifiers[0].id);
    }
    const targetId = verifierId || (verifiers && verifiers[0]?.id) || 'VER-01';
    setIsSubmitting(true);
    onConfirm(targetId, remarks);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                APPROVE & FORWARD TO VERIFIER
              </h3>
              <p className="text-xs text-slate-400">
                Application: <span className="font-mono font-bold text-amber-500">{applicationId}</span>
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

        {/* Confirmation Question & Risk Summary */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
          <p className="text-slate-200 font-semibold text-sm">
            Are you sure you want to approve and forward this land record application to the designated Revenue Verifier (Girdawar / RI)?
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Status</span>
              <span className="text-amber-400 font-bold block">Pending DEO Review</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Risk Level</span>
              <span className={cn('font-bold font-mono block', risk.textClass)}>{risk.riskLabel}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Review Priority</span>
              <span className={cn('font-mono font-bold block', risk.textClass)}>{risk.riskScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Verifier Selection & Remarks */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Designated Revenue Verifier (Girdawar / RI) *
            </label>
            <select
              value={verifierId}
              onChange={(e) => setVerifierId(e.target.value)}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">{isLoading ? 'Loading verifiers...' : 'Select Verifying Officer'}</option>
              {verifiers?.map((v) => (
                <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                  {v.name} – {v.designation} ({v.mandal}, {v.district}) [Queue: {v.activeQueueCount}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              DEO Endorsement Remarks for Verifier
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-500"
              placeholder="Verified against original SRO indices and state master record. Forwarded for field inspection and revenue verification."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Approve & Forward</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
