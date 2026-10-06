import React from 'react';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { useDEOStore } from '../../store/deoStore';
import { EditProfileForm } from './EditProfileForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import {
  User,
  ShieldCheck,
  Building,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Calendar,
  Globe,
} from 'lucide-react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const applications = useDEOStore((s) => s.applications);
  const getStats = useDEOStore((s) => s.getStats);
  const stats = getStats();

  const totalAssigned = applications.length;
  const pendingCount = stats.pending;
  const completedCount = stats.readyToForward + stats.sentToVerifier;
  const returnedCount = stats.needsAttention;

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in pb-12">
      {/* 1. Officer Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-600/30">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-white">{user?.name || 'Suresh G. Patil'}</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Active Patwari Officer
              </span>
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">
              {user?.designation || 'Village Revenue Officer (Patwari - Maker)'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Revenue Department</span>
              <span>•</span>
              <span className="font-mono text-amber-400 font-bold">Govt Reg ID: {user?.id || 'DEO-TEL-0412'}</span>
            </p>
          </div>
        </div>

        {/* Live Work Summary Quick Counters */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Assigned
            </span>
            <span className="text-base font-black font-mono text-white">{totalAssigned}</span>
          </div>
          <div className="px-4 py-2 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Pending
            </span>
            <span className="text-base font-black font-mono text-amber-400">{pendingCount}</span>
          </div>
          <div className="px-4 py-2 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Forwarded
            </span>
            <span className="text-base font-black font-mono text-emerald-400">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* 2. OFFICER INFORMATION SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Officer Information
            </h3>
            <p className="text-xs text-slate-400">
              Government employee registration and official identity particulars
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Full Officer Name</span>
            <span className="font-bold text-white text-sm">{user?.name || 'Suresh G. Patil'}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Designation</span>
            <span className="font-semibold text-slate-200">{user?.designation || 'Village Revenue Officer (Patwari - Maker)'}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Department</span>
            <span className="font-semibold text-slate-200">Revenue Department, Govt of Telangana</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Government Reg ID</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{user?.id || 'DEO-TEL-0412'}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Account Status</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 text-xs mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active (Patwari Maker Desk)
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Role Type</span>
            <span className="font-mono text-slate-300 font-semibold">DEO / Patwari (Maker / Ingestion Officer)</span>
          </div>
        </div>
      </div>

      {/* 3. POSTING & JURISDICTION SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Posting & Jurisdiction
            </h3>
            <p className="text-xs text-slate-400">
              Assigned revenue circle, mandal office, and village land-record jurisdiction
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Revenue District</span>
            <span className="font-bold text-white">{user?.district || 'Ranga Reddy'}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Mandal / Taluk</span>
            <span className="font-bold text-white">Serilingampally</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Assigned Revenue Office</span>
            <span className="font-semibold text-slate-200">{user?.office || 'Tahsildar Revenue Office, Serilingampally'}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 sm:col-span-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Assigned Revenue Villages</span>
            <span className="font-medium text-slate-300">Gachibowli, Nanakramguda, Puppalguda, Hafeezpet</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Operational Jurisdiction</span>
            <span className="font-mono text-purple-400 font-bold">Circle 14 • Serilingampally Mandal</span>
          </div>
        </div>
      </div>

      {/* 4. OFFICIAL CONTACT SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Official Contact
            </h3>
            <p className="text-xs text-slate-400">
              Verified NIC government email and registered official phone contact
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Official Government Email</span>
              <span className="font-mono font-bold text-white">{user?.email || 'suresh.patil@telangana.gov.in'}</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> NIC Verified
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Registered Mobile</span>
              <span className="font-mono font-bold text-white">{user?.phone || '+91 94401 88321'}</span>
            </div>
            <span className="text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full shrink-0">
              OTP 2FA Active
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Office Landline</span>
            <span className="font-mono text-slate-300">040-23001142 (Ext 14)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Office Address</span>
            <span className="text-slate-300">Tahsildar Office Complex, Main Road, Serilingampally, Ranga Reddy Dist - 500019</span>
          </div>
        </div>
      </div>

      {/* 5. WORK SUMMARY SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Work Summary
            </h3>
            <p className="text-xs text-slate-400">
              Live statistics calculated directly from active application queue records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Applications Assigned</span>
            <span className="text-2xl font-black font-mono text-white mt-2">{totalAssigned}</span>
            <span className="text-[11px] text-slate-500 mt-1">Total in DEO queue</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">Pending Review</span>
            <span className="text-2xl font-black font-mono text-amber-400 mt-2">{pendingCount}</span>
            <span className="text-[11px] text-slate-500 mt-1">Awaiting DEO scrutiny</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Completed / Forwarded</span>
            <span className="text-2xl font-black font-mono text-emerald-400 mt-2">{completedCount}</span>
            <span className="text-[11px] text-slate-500 mt-1">Routed to Verifier</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/20 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block">Returned / Attention</span>
            <span className="text-2xl font-black font-mono text-rose-400 mt-2">{returnedCount}</span>
            <span className="text-[11px] text-slate-500 mt-1">Needs citizen/DEO action</span>
          </div>
        </div>
      </div>

      {/* 6. ACCOUNT & SECURITY SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Account & Security
            </h3>
            <p className="text-xs text-slate-400">
              Authentication settings, state single sign-on integration, and password update
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pb-2">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Account Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Active & Operational
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">2FA Status</span>
            <span className="font-semibold text-slate-200">Mobile OTP Enabled</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Government SSO</span>
            <span className="font-semibold text-slate-200">Telangana State SSO (TSSO)</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Last Login</span>
            <span className="font-mono text-slate-300">19-Sep-2026 09:30 AM</span>
          </div>
        </div>

        {/* Change Password Form */}
        <ChangePasswordForm />
      </div>

      {/* 7. EDITABLE PROFILE PREFERENCES SECTION */}
      <EditProfileForm />
    </div>
  );
}

