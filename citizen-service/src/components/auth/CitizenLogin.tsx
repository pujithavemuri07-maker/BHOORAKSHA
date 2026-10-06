import React, { useState } from 'react';
import { useSharedAuthStore } from '../../store/authStore';
import { authClient } from '@shared/api/authClient';
import { useTranslation } from '../../i18n';
import { LanguageSelector } from '../LanguageSelector';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CitizenLoginProps {
  onSuccess?: () => void;
}

type AuthMode = 'PASSWORD' | 'OTP' | 'REGISTER' | 'FORGOT_PASSWORD';

export const CitizenLogin: React.FC<CitizenLoginProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { login, loginWithOtp } = useSharedAuthStore();

  const [mode, setMode] = useState<AuthMode>('PASSWORD');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configNotice, setConfigNotice] = useState<string | null>(null);

  // Form states: Password Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form states: OTP Login
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(300);
  const [debugOtpHint, setDebugOtpHint] = useState<string | null>(null);

  // Form states: Registration
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Form states: Forgot Password
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // 1. Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error(t('Please enter your email and password'));
      return;
    }

    setIsSubmitting(true);
    setConfigNotice(null);
    try {
      const resp = await login({ email: email.trim(), password });
      toast.success(t(`Welcome to Bhooraksha Citizen Portal, ${resp.user.full_name || resp.user.name || 'Citizen'}!`));
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || t('Invalid email or password');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. OTP Request Handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      toast.error(t('Please enter a valid mobile number or email'));
      return;
    }

    setIsSubmitting(true);
    setConfigNotice(null);
    try {
      const resp = await authClient.sendOtp({
        phone_or_email: mobileNumber.trim(),
        purpose: 'LOGIN',
      });
      setIsOtpSent(true);
      setOtpExpirySeconds(resp.expires_in_seconds || 300);
      if (resp.debug_otp) {
        setDebugOtpHint(resp.debug_otp);
      }
      toast.success(t('OTP dispatched to your registered contact'));
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || t('Failed to send OTP. Check backend service.');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. OTP Verify & Login Handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error(t('Please enter the OTP code'));
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await loginWithOtp({
        phone_or_email: mobileNumber.trim(),
        otp: otp.trim(),
        purpose: 'LOGIN',
      });
      toast.success(t(`Authenticated successfully! Welcome, ${resp.user.full_name || 'Citizen'}.`));
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || t('Invalid or expired OTP code');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Citizen Registration Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      toast.error(t('Passwords do not match'));
      return;
    }
    if (regPassword.length < 8) {
      toast.error(t('Password must be at least 8 characters long'));
      return;
    }

    setIsSubmitting(true);
    try {
      await authClient.register({
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() || undefined,
        password: regPassword,
      });
      toast.success(t('Account created successfully! Logging you in...'));
      // Auto login with new credentials
      await login({ email: regEmail.trim(), password: regPassword });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || t('Registration failed. Please check inputs.');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Forgot Password Request
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      toast.error(t('Please provide your registered email or phone'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authClient.forgotPassword({ email_or_phone: forgotIdentifier.trim() });
      setForgotOtpSent(true);
      if (res.debug_otp) {
        setDebugOtpHint(res.debug_otp);
      }
      toast.success(t('Password reset instructions & OTP sent'));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('Failed to initiate password reset'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Reset Password with OTP
  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp || forgotNewPassword.length < 8) {
      toast.error(t('Please enter OTP and a password with at least 8 characters'));
      return;
    }

    setIsSubmitting(true);
    try {
      await authClient.resetPassword({
        identifier: forgotIdentifier.trim(),
        otp: forgotOtp.trim(),
        new_password: forgotNewPassword,
      });
      toast.success(t('Password updated! Please log in with your new password.'));
      setMode('PASSWORD');
      setEmail(forgotIdentifier);
      setForgotOtpSent(false);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('Failed to reset password. Check OTP.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. OAuth Provider Handler (Google / Apple)
  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'microsoft') => {
    setConfigNotice(null);
    try {
      const data = await authClient.getOAuthAuthorizeUrl(provider);
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (err: any) {
      if (err.message?.includes('CONFIGURATION_REQUIRED')) {
        setConfigNotice(
          t(
            `Social sign-in via ${provider.toUpperCase()} requires server credentials. (CONFIGURATION_REQUIRED on backend)`
          )
        );
      } else {
        toast.error(err.message || t(`Failed to connect to ${provider}`));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex items-center justify-between z-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to Portal Launcher')}</span>
        </a>
        <div className="flex items-center gap-3">
          <LanguageSelector />
        </div>
      </header>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30">
              <Eye className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="font-black text-xl tracking-wider text-white">BHOORAKSHA</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  भूरक्षा
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-200 mt-1">
                {mode === 'REGISTER'
                  ? t('Create Citizen Account')
                  : mode === 'FORGOT_PASSWORD'
                  ? t('Reset Your Password')
                  : t('Citizen Portal Login')}
              </h1>
              <p className="text-xs text-slate-400">
                {t('Land Owner & Applicant Statutory Self-Service Access')}
              </p>
            </div>
          </div>

          {/* Configuration Notice for Unconfigured External Providers */}
          {configNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">{t('Server Configuration Notice')}</strong>
                <span className="text-[11px] leading-relaxed text-amber-200/90">{configNotice}</span>
              </div>
            </div>
          )}

          {/* Navigation Modes Switcher (Tabs) */}
          {mode !== 'FORGOT_PASSWORD' && (
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('PASSWORD');
                  setConfigNotice(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'PASSWORD'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('Password')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('OTP');
                  setConfigNotice(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'OTP'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('Mobile OTP')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('REGISTER');
                  setConfigNotice(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'REGISTER'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('Register')}
              </button>
            </div>
          )}

          {/* TAB 1: PASSWORD LOGIN */}
          {mode === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('Registered Email Address')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@example.gov.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
                    className="text-[11px] text-emerald-400 hover:underline"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t('Sign In to Citizen Portal')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: MOBILE OTP LOGIN */}
          {mode === 'OTP' && (
            <div className="space-y-4">
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('Registered Mobile or Email')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
                        <span>{t('Send One-Time Password')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {t('Enter 6-Digit OTP')}
                      </label>
                      {debugOtpHint && (
                        <button
                          type="button"
                          onClick={() => setOtp(debugOtpHint)}
                          className="text-[11px] text-emerald-400 hover:underline font-mono"
                        >
                          {t('Auto-fill code')} ({debugOtpHint})
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="••••••"
                        maxLength={6}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono tracking-widest text-center focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {t('OTP code dispatched to')} <strong className="text-slate-300">{mobileNumber}</strong>
                    </p>
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
                      className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
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

          {/* TAB 3: CITIZEN REGISTRATION */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('Full Legal Name (as in Aadhaar/Pattadar)')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Sri Ramesh Kumar Patel"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t('Email Address')}
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t('Mobile Number')}
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('Password (Min 8 characters)')}
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('Confirm Password')}
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('Register Citizen Account')}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD MODAL/VIEW */}
          {mode === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              {!forgotOtpSent ? (
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('Registered Email or Phone')}
                    </label>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="citizen@example.gov.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500"
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
                      className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <span>{t('Send Reset OTP')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">{t('Enter Reset OTP')}</label>
                      {debugOtpHint && (
                        <button
                          type="button"
                          onClick={() => setForgotOtp(debugOtpHint)}
                          className="text-[11px] text-emerald-400 hover:underline font-mono"
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
                      className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{t('Save New Password')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SOCIAL / OAUTH PROVIDER SECTION */}
          {mode !== 'FORGOT_PASSWORD' && (
            <div className="space-y-3 pt-2">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  {t('Or Continue With')}
                </span>
                <div className="border-t border-slate-800 w-full" />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('apple')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.41c.67-.82 1.12-1.96.99-3.1-.97.04-2.15.65-2.85 1.46-.61.71-1.15 1.87-1.01 2.98 1.09.08 2.2-.52 2.87-1.34z" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Security Notice */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('Citizen DPI • 256-Bit TLS')}</span>
            </div>
            <a href="/" className="text-emerald-400 hover:underline text-[11px]">
              {t('Return to Launcher')}
            </a>
          </div>
        </div>
      </div>

      {/* Portal Footer */}
      <footer className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/60 text-center text-[11px] text-slate-500 z-10">
        Bhooraksha Land Record Verification & Mutation Engine • Citizen Portal (Port 3000 / Route: /citizen/)
      </footer>
    </div>
  );
};
