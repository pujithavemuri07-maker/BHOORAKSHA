import React from 'react';
import { Sliders, Shield, AlertTriangle, Lock, Save, RefreshCw, Bell } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useAdminStore();

  const handleToggle = (key: keyof typeof settings, val: any) => {
    updateSettings({ [key]: val });
    toast.success(`Platform setting updated: ${String(key)}`);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/40 border border-indigo-500/20">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          Platform Governance & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          {t('admin.settings')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Configure security policies, rate-limiting thresholds, automated RoR mutation synchronization triggers, and audit retention mandates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Access Controls */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Statutory Security & Authentication Controls</span>
          </h3>

          <div className="space-y-3 divide-y divide-slate-800/60 text-xs">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Mandatory Multi-Factor Authentication</span>
                <span className="text-[11px] text-slate-400">Enforce Aadhaar OTP or Biometric WebAuthn for all revenue staff</span>
              </div>
              <input
                type="checkbox"
                checked={settings.mfaEnforced}
                onChange={(e) => handleToggle('mfaEnforced', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950 cursor-pointer"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Public Citizen Self-Registration</span>
                <span className="text-[11px] text-slate-400">Permit citizens to create Bhooraksha accounts via Aadhaar OTP</span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowPublicRegistration}
                onChange={(e) => handleToggle('allowPublicRegistration', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950 cursor-pointer"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Emergency Maintenance Mode</span>
                <span className="text-[11px] text-slate-400">Suspend deed intake and API ingress for emergency patching</span>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleToggle('maintenanceMode', e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-700 bg-slate-950 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI & Automated Mutation Engine */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>AI Pipeline & Mutation Dispatcher Engine</span>
          </h3>

          <div className="space-y-3 divide-y divide-slate-800/60 text-xs">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Automated RoR Mutation Dispatch</span>
                <span className="text-[11px] text-slate-400">Directly sync approved deeds into State Dharani / Bhoomi RoR</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoMutationSync}
                onChange={(e) => handleToggle('autoMutationSync', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950 cursor-pointer"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Fallback to Manual Verification on Anomaly</span>
                <span className="text-[11px] text-slate-400">Route low confidence AI extractions to Girdawar review</span>
              </div>
              <input
                type="checkbox"
                checked={settings.fallbackToManualVerification}
                onChange={(e) => handleToggle('fallbackToManualVerification', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950 cursor-pointer"
              />
            </div>

            <div className="pt-3 space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold text-white">AI Auto-Verify Threshold Score</span>
                <span className="font-mono text-purple-400 font-bold">{settings.aiAutoVerifyThreshold}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="99"
                value={settings.aiAutoVerifyThreshold}
                onChange={(e) => handleToggle('aiAutoVerifyThreshold', Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
