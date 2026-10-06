import { useMemo } from 'react';
import { useTranslation } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import { useVerifierStore } from '../../store/verifierStore';
import { ChangePasswordForm } from './ChangePasswordForm';
import {
  ShieldCheck,
  Building,
  MapPin,
  Key,
  Award,
  FileCheck,
  Shield,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  ArrowUpRight,
  Activity,
  Calendar,
  Lock,
  Smartphone,
  Phone,
  Mail,
  User,
  CheckSquare,
  ExternalLink,
} from 'lucide-react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const applications = useVerifierStore((s) => s.applications);
  const history = useVerifierStore((s) => s.history);
  const getStats = useVerifierStore((s) => s.getStats);

  const stats = useMemo(() => getStats(), [applications, history, getStats]);
  const recentAction = history.length > 0 ? history[0] : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>{t('common.profile')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Government Revenue Officer Identification, Cadre Posting, Statutory Verification Authority & Security
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/25 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Official Cadre Active
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono border border-slate-700 text-[11px]">
            {user?.id || 'VRF-OFFICER-109'}
          </span>
        </div>
      </div>

      {/* 1. PROFILE HEADER / IDENTITY CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/30 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl shadow-emerald-950/80 border-2 border-emerald-400/30 shrink-0">
              {user?.name?.charAt(0) || 'K'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {user?.name || 'K. Venkat Rao'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  ID: VERIFIED
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-400">
                {user?.designation || 'Girdawar / Revenue Inspector (Checker)'}
              </p>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{user?.department || 'Department of Revenue & Land Records'}</span>
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{user?.office || 'Office of the Tahsildar, Serilingampally Mandal'}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-2 md:min-w-[260px] shrink-0">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Officer ID</span>
              <span className="font-mono text-slate-200 font-bold">{user?.id || 'VRF-OFFICER-109'}</span>
            </div>
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cadre Level</span>
              <span className="text-slate-300 font-medium">Level 2 Verifier (Girdawar)</span>
            </div>
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Authentication</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                NIC e-Pramaan SSO
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">DSC Status</span>
              <span className="text-amber-400 font-mono text-[10px] font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                DEMO / SIMULATED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PERSONAL & OFFICIAL INFORMATION + POSTING & JURISDICTION (2 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PERSONAL & OFFICIAL INFORMATION */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Personal & Official Information
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Read-Only Cadre Record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Full Name</span>
                <span className="text-slate-200 font-semibold block">{user?.name || 'K. Venkat Rao'}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Employee ID</span>
                <span className="text-slate-200 font-mono font-semibold block">{user?.id || 'VRF-OFFICER-109'}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Designation</span>
                <span className="text-emerald-400 font-medium block">{user?.designation || 'Girdawar / Revenue Inspector'}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Department</span>
                <span className="text-slate-300 block">{user?.department || 'Department of Revenue & Land Records'}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Date of Joining</span>
                <span className="text-slate-300 block">12-Aug-2018 (Regular Cadre)</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Cadre Classification</span>
                <span className="text-slate-300 block">Class-II Revenue Executive</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Official Email</span>
                <span className="text-slate-300 font-mono text-[11px] truncate block">{user?.email || 'venkat.rao@revenue.telangana.gov.in'}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Official Mobile</span>
                <span className="text-slate-300 font-mono block">{user?.phone || '+91 94401 88290'}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1 sm:col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Office Intercom / Phone</span>
                <span className="text-slate-300 block">040-2311-0422 (Ext: 104 - Serilingampally Tahsil Desk)</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 flex items-center gap-1.5 border-t border-slate-800/80">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Official cadre records are synced from the State HRMS Service Register.
          </p>
        </div>

        {/* 3. OFFICIAL POSTING & JURISDICTION */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Official Posting & Jurisdiction
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Assigned Division
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">State</span>
                <span className="text-slate-200 font-semibold block">Telangana</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">District</span>
                <span className="text-slate-200 font-semibold block">{user?.district || 'Ranga Reddy'}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Revenue Division</span>
                <span className="text-slate-200 font-semibold block">Serilingampally</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Mandal / Taluk</span>
                <span className="text-slate-200 font-semibold block">{user?.mandal || 'Serilingampally'}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1 col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Headquarters Office</span>
                <span className="text-slate-300 block">{user?.office || 'Office of the Tahsildar, Serilingampally Mandal'}</span>
              </div>
            </div>

            {/* Assigned Revenue Villages */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                Assigned Revenue Villages (Survey Cadastral Blocks 101–148)
              </span>
              <div className="flex flex-wrap gap-2">
                {['Gachibowli', 'Madhapur', 'Kondapur', 'Raidurg'].map((village) => (
                  <span
                    key={village}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {village}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Reporting Authority</span>
                <span className="text-slate-300 font-medium">Smt. K. Sujatha (Tahsildar & Executive Magistrate)</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                DESK: TEH-01
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 flex items-center gap-1.5 border-t border-slate-800/80">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Jurisdiction Area: 34.8 sq km under Serilingampally Tahsil Unit.
          </p>
        </div>
      </div>

      {/* 4. ROLE & VERIFICATION AUTHORITY */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Role & Statutory Verification Authority
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
            AUTHORITY: ACTIVE (RoR Act 2020)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Statutory Role</span>
            <p className="text-slate-200 font-bold text-sm">Girdawar / Revenue Inspector</p>
            <p className="text-slate-400 text-[11px]">
              Acts as Level-2 Checker in the digital revenue pipeline, responsible for ground-truth verification of agricultural and non-agricultural land records.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Verification Tier</span>
            <p className="text-emerald-400 font-bold text-sm">Primary Field & Record Checker</p>
            <p className="text-slate-400 text-[11px]">
              Authorized to validate deed extractions, check ownership lineage, compare government 1-B/Pahani registers, and inspect spatial GIS boundaries.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Escalation Channel</span>
            <p className="text-slate-200 font-bold text-sm">Tahsildar / RDO Revenue Court</p>
            <p className="text-slate-400 text-[11px]">
              Empowered to forward high-risk title conflicts, dispute encumbrances, or boundary overlaps to Executive Magistrate for formal inquiry.
            </p>
          </div>
        </div>

        {/* Authorized Activities Checklist */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Authorized Statutory Verification Powers (Telangana RoR Act Section 4 & 5)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {[
              'Review land records and AI-extracted deed metadata',
              'Verify extracted land particulars against Government ROR 1-B & Pahani',
              'Check ownership lineage, past mutation entries, and Encumbrance Certificates',
              'Validate cadastral GIS spatial boundaries and survey parcel coordinates',
              'Validate Mandal/Taluk jurisdiction and Tahsil revenue village block boundaries',
              'Flag legal conflicts, title disputes, and suspected document tampering',
              'Recommend approval / rejection or forward high-risk cases for Tahsildar executive review',
            ].map((action, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Authorized Document Types */}
        <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Authorized Document Categories for Scrutiny
            </span>
            <span className="text-slate-300 font-medium">
              Registered Sale Deeds, Gift Deeds, Partition Deeds, Succession/e-Pattadar Passbooks, Mutation Extracts, NOC Certificates
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] shrink-0 border border-slate-700">
            CLASS: ROR-DEED-V2
          </span>
        </div>
      </div>

      {/* 5. SECURITY & ACCOUNT + 6. DIGITAL SIGNING CREDENTIALS (DSC) (2 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECURITY & ACCOUNT */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Security & Account Credentials
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                2FA SECURE
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Account Status</span>
                  <span className="text-emerald-400 font-semibold">ACTIVE (Gazetted Field Cadre)</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Identity Verification</span>
                  <span className="text-slate-200 font-medium">VERIFIED via e-Pramaan Government SSO</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Two-Factor Authentication</span>
                  <span className="text-emerald-400 font-semibold">ENABLED (NIC Mobile OTP Gateway)</span>
                </div>
                <Smartphone className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Last Active Login</span>
                  <span className="text-slate-300 font-mono text-[11px]">{user?.lastLogin || 'Today at 09:14 AM (IST)'}</span>
                </div>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Session Network Origin</span>
                  <span className="text-slate-300 font-mono text-[11px]">T-SWAN Secured Node (10.144.32.18)</span>
                </div>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 flex items-center gap-1.5 border-t border-slate-800/80">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Account complies with State Data Protection & NIC Security Guidelines.
          </p>
        </div>

        {/* 7. DIGITAL SIGNING CREDENTIALS (DSC) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                Digital Signing Credentials (DSC)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                DSC STATUS: DEMO / SIMULATED
              </span>
            </div>

            {/* Simulated Notice Alert */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="text-[11px] leading-relaxed">
                <strong className="font-bold">Sandbox Environment:</strong> Digital signature keys and verification seals displayed here are simulated for platform testing and demonstration.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Certificate Status</span>
                <span className="text-emerald-400 font-semibold block">Simulated (Valid for Testing)</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Certificate Holder</span>
                <span className="text-slate-200 font-medium block">{user?.name || 'K. Venkat Rao'} (Girdawar)</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 sm:col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">DSC Serial Number</span>
                <span className="text-slate-300 font-mono text-[11px] block">TEL-REV-2026-DSC-0098412-SIM</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 sm:col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Issuing Authority</span>
                <span className="text-slate-300 block">NIC-CA / Telangana State e-Sign Service (Simulated)</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Valid From</span>
                <span className="text-slate-300 font-mono block">01-Jan-2026</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Valid Until</span>
                <span className="text-slate-300 font-mono block">31-Dec-2027</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex justify-between items-center border-t border-slate-800/80">
            <span>Signing Algorithm: <strong className="text-slate-200 font-mono">SHA-256 / RSA 2048</strong></span>
            <span className="text-emerald-400 font-semibold">Ready for Audit Signing</span>
          </div>
        </div>
      </div>

      {/* 8. VERIFICATION ACTIVITY SUMMARY (Live Data from Store) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Live Verification Activity & Pipeline Summary
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Updated Real-Time
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Queue</span>
            <span className="text-lg font-black text-slate-100 font-mono">{applications.length}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Pending</span>
            <span className="text-lg font-black text-amber-400 font-mono">{stats.pending}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Verified Today</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{stats.completedReviewsToday}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Approved</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{stats.approvedToday}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Rejected</span>
            <span className="text-lg font-black text-rose-400 font-mono">{stats.rejectedToday}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Returned DEO</span>
            <span className="text-lg font-black text-amber-300 font-mono">{stats.returnedToday}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Escalated</span>
            <span className="text-lg font-black text-indigo-400 font-mono">{stats.escalatedToday}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Approval Rate</span>
            <span className="text-lg font-black text-teal-400 font-mono">{stats.approvalRate}%</span>
          </div>
        </div>
      </div>

      {/* 9. ACCOUNT ACTIVITY & AUDIT INFORMATION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Account Activity & Audit Information
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Audit Trail Ledger
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Last Verification Activity</span>
            {recentAction ? (
              <div>
                <p className="text-slate-200 font-semibold">{recentAction.action.replace(/_/g, ' ')}</p>
                <p className="text-[11px] text-slate-400 font-mono">App #{recentAction.applicationId} • {recentAction.timestamp.slice(0, 10)}</p>
              </div>
            ) : (
              <p className="text-slate-400 italic">No recent verification action logged today</p>
            )}
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Current Session Status</span>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Authenticated & Active</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Bhooraksha SSO JWT Active</p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Recent Security Event</span>
            <p className="text-slate-200 font-medium">2FA OTP Authentication Successful</p>
            <p className="text-[11px] text-slate-500 font-mono">Serilingampally Tahsil Terminal</p>
          </div>
        </div>
      </div>

      {/* 10. PORTAL ACCESS SECURITY & PASSWORD CHANGE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
          <Key className="w-4 h-4 text-amber-400" />
          Portal Access Security & Password Management
        </h3>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
