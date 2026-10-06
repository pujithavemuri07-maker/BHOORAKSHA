import React, { useState } from 'react';
import { useSharedAuthStore } from '../store/authStore';
import { authClient } from '@shared/api/authClient';
import { useTranslation } from '../i18n';
import {
  Scale,
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LegalLoginProps {
  onSuccess?: () => void;
}

type AuthMode = 'PASSWORD' | 'OTP' | 'FORGOT_PASSWORD';

export const LegalLogin: React.FC<LegalLoginProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { login, loginWithOtp } = useSharedAuthStore();

  const [mode, setMode] = useState<AuthMode>('PASSWORD');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [debugOtpHint, setDebugOtpHint] = useState<string | null>(null);

  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error(t('Please enter official legal email and password'));
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await login({ email: email.trim(), password });
      toast.success(t(`Welcome Legal Officer, ${resp.user.full_name || 'Legal Advisor'}!`));
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || t('Authentication failed. Check credentials.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      toast.error(t('Please enter official mobile or email'));
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await authClient.sendOtp({
        phone_or_email: mobileNumber.trim(),
        purpose: 'LOGIN',
      });
      setIsOtpSent(true);
      if (resp.debug_otp) setDebugOtpHint(resp.debug_otp);
      toast.success(t('Official OTP dispatched'));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('Failed to send OTP'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsSubmitting(true);
    try {
      const resp = await loginWithOtp({
        phone_or_email: mobileNumber.trim(),
        otp: otp.trim(),
        purpose: 'LOGIN',
      });
      toast.success(t(`Authenticated successfully! Welcome, ${resp.user.full_name || 'Officer'}.`));
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('Invalid or expired OTP'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await authClient.forgotPassword({ email_or_phone: forgotIdentifier.trim() });
      setForgotOtpSent(true);
      if (res.debug_otp) setDebugOtpHint(res.debug_otp);
      toast.success(t('Password recovery OTP sent'));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('Password recovery failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp || forgotNewPassword.length < 8) {
      toast.error(t('Please provide valid OTP and min 8 char password'));
      return;
    }
    setIsSubmitting(true);
    try {
      await authClient.resetPassword({
        identifier: forgotIdentifier.trim(),
        otp: forgotOtp.trim(),
        new_password: forgotNewPassword,
      });
      toast.success(t('Password reset successfully! Please log in.'));
      setMode('PASSWORD');
      setEmail(forgotIdentifier);
      setForgotOtpSent(false);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('Reset failed. Check OTP.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex items-center justify-between z-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to Portal Launcher')}</span>
        </a>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          <Scale className="w-3.5 h-3.5" />
          <span>Legal Cell</span>
        </div>
      </header>

      {/* Main Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="font-black text-xl tracking-wider text-white">BHOORAKSHA</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  LEGAL
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-200 mt-1">
                {mode === 'FORGOT_PASSWORD' ? t('Reset Legal Credentials') : t('Legal Review & Scrutiny Portal')}
              </h1>
              <p className="text-xs text-slate-400">
                {t('Revenue Legal Advisors, Injunction Scrutiny & Bar Council Counsel')}
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          {mode !== 'FORGOT_PASSWORD' && (
            <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('PASSWORD')}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'PASSWORD' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('Official Password')}
              </button>
              <button
                type="button"
                onClick={() => setMode('OTP')}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'OTP' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('Secure OTP')}
              </button>
            </div>
          )}

          {/* PASSWORD LOGIN */}
          {mode === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('Official Legal / Revenue Email')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="legal.advisor@revenue.telangana.gov.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">{t('Password')}</label>
                  <button
                    type="button"
                    onClick={() => setMode('FORGOT_PASSWORD')}
                    className="text-[11px] text-purple-400 hover:underline"
                  >
                    {t('Forgot Password?')}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t('Sign In to Legal Portal')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OTP LOGIN */}
          {mode === 'OTP' && (
            <div className="space-y-4">
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('Official Mobile or Email')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98490 55123"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{t('Dispatch Official OTP')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">{t('Enter Official OTP')}</label>
                      {debugOtpHint && (
                        <button
                          type="button"
                          onClick={() => setOtp(debugOtpHint)}
                          className="text-[11px] text-purple-400 hover:underline font-mono"
                        >
                          {t('Auto-fill code')} ({debugOtpHint})
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="••••••"
                      maxLength={6}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono tracking-widest text-center focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
                    >
                      {t('Change')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>{t('Verify & Sign In')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              {!forgotOtpSent ? (
                <form onSubmit={handleForgotRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('Registered Official Email or Mobile')}
                    </label>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="legal.advisor@revenue.telangana.gov.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('PASSWORD')}
                      className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      {t('Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <span>{t('Send Recovery OTP')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotConfirm} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">{t('Enter Recovery OTP')}</label>
                      {debugOtpHint && (
                        <button
                          type="button"
                          onClick={() => setForgotOtp(debugOtpHint)}
                          className="text-[11px] text-purple-400 hover:underline font-mono"
                        >
                          {t('Auto-fill code')} ({debugOtpHint})
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="••••••"
                      maxLength={6}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono tracking-widest text-center"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('New Password (Min 8 chars)')}
                    </label>
                    <input
                      type="password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotOtpSent(false)}
                      className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      {t('Back')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{t('Reset Password')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer Security Notice */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('Statutory Legal Scrutiny • TLS 256')}</span>
            </div>
            <a href="/" className="text-purple-400 hover:underline text-[11px]">
              {t('Portal Launcher')}
            </a>
          </div>
        </div>
      </div>

      <footer className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/60 text-center text-[11px] text-slate-500 z-10">
        Bhooraksha Land Record Verification & Mutation Engine • Legal Review Portal (Port 3003 / Route: /legal/)
      </footer>
    </div>
  );
};
