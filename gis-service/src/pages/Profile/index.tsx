import { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useGISStore } from '../../store/gisStore';
import {
  User,
  ShieldCheck,
  MapPin,
  Compass,
  Award,
  Key,
  Building,
  Mail,
  Phone,
  Layers,
  CheckCircle2,
  Lock,
  FileText,
  Clock,
  Briefcase,
  Globe,
  AlertTriangle,
  Save,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const history = useGISStore((s) => s.history);
  const getStats = useGISStore((s) => s.getStats);
  const applications = useGISStore((s) => s.applications);

  const stats = useMemo(() => getStats(), [applications, history]);

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Editable fields
  const [name, setName] = useState(user?.name || 'S. Ramakrishna');
  const [email, setEmail] = useState(user?.email || 'ramakrishna.gis@survey.telangana.gov.in');
  const [phone, setPhone] = useState(user?.phone || '+91 94408 77612');
  const [office, setOffice] = useState(user?.office || 'District Cadastral Survey Office, Ranga Reddy');
  const [officeAddress, setOfficeAddress] = useState(
    user?.officeAddress || 'Collectorate Complex, Lakdikapul, Hyderabad, Telangana - 500004'
  );

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, phone, office, officeAddress });
    toast.success('GIS Officer profile details updated successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Surveyor security credentials updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-5xl mx-auto">
      {/* 1. Profile Header */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-cyan-950/70 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-slate-950 text-3xl font-black shadow-xl shadow-teal-950 shrink-0 border border-teal-300/40">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {user?.name || 'S. Ramakrishna'}
              </h1>
              <span className="text-[11px] font-mono bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/40 font-bold">
                {user?.licenseNumber || 'SURV/TEL/2014/8821'}
              </span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-300/90 font-medium">
              {user?.designation || 'Senior GIS Specialist / Cadastral Survey Commissioner'}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-400" />
                {user?.office || 'District Cadastral Survey Office, Ranga Reddy'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                DGPS Node Verified
              </span>
            </div>
          </div>
        </div>

        {/* Spatial Key Metrics Summary */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-center px-2">
            <div className="text-xl font-mono font-bold text-white">
              {history.length + 328}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Parcels Ratified</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-xl font-mono font-bold text-teal-400">
              {stats.pendingReview}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Pending Review</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-950'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>GIS Officer Particulars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-950'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Security & GIS Access</span>
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Form container */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* 2. GIS Officer Information */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-400" />
                  <span>GIS OFFICER INFORMATION</span>
                </h3>
                <span className="text-[10px] text-slate-500 uppercase font-mono">
                  Read-Only & Editable Fields
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Full Name (Editable) */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold flex items-center justify-between">
                    <span>Full Name</span>
                    <span className="text-[10px] text-teal-400 font-mono">Editable</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                {/* Designation (Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium flex items-center justify-between">
                    <span>Designation</span>
                    <span className="text-[10px] text-slate-500 font-mono">Read-Only</span>
                  </label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-300 font-medium">
                    {user?.designation || 'Senior GIS Specialist / Cadastral Survey Commissioner'}
                  </div>
                </div>

                {/* Department / Survey Authority (Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium flex items-center justify-between">
                    <span>Department / Survey Authority</span>
                    <span className="text-[10px] text-slate-500 font-mono">Read-Only</span>
                  </label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-300">
                    {user?.department || 'Directorate of Survey Settlement & Land Records'}
                  </div>
                </div>

                {/* Government / Officer ID (Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium flex items-center justify-between">
                    <span>Government / Officer ID</span>
                    <span className="text-[10px] text-slate-500 font-mono">Read-Only</span>
                  </label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl font-mono text-teal-400 font-bold">
                    {user?.id || 'GIS-OFF-7701'}
                  </div>
                </div>

                {/* License Number (Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium flex items-center justify-between">
                    <span>License / Survey Registration</span>
                    <span className="text-[10px] text-slate-500 font-mono">Read-Only</span>
                  </label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl font-mono text-white font-bold">
                    {user?.licenseNumber || 'SURV/TEL/2014/8821'}
                  </div>
                </div>

                {/* Account Status (Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium flex items-center justify-between">
                    <span>Account Status</span>
                    <span className="text-[10px] text-slate-500 font-mono">Read-Only</span>
                  </label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Active (Government Verified)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Official Contact */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>OFFICIAL CONTACT</span>
                </h3>
                <span className="text-[10px] text-slate-500 uppercase font-mono">
                  Official Channels
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span>Government Official Email</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 outline-none focus:border-teal-500 font-mono transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>Authorized Mobile Number</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 outline-none focus:border-teal-500 font-mono transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-teal-400" />
                    <span>Assigned Survey Directorate / Division</span>
                  </label>
                  <input
                    type="text"
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>Office Address</span>
                  </label>
                  <input
                    type="text"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 4. Survey Posting & Jurisdiction */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <span>SURVEY POSTING & JURISDICTION</span>
                </h3>
                <span className="text-[10px] text-teal-400 font-mono font-semibold">
                  Cadastral Operational Zone
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Division</span>
                  <span className="text-white font-semibold block">{office}</span>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Revenue District</span>
                  <span className="text-teal-300 font-bold block">{user?.district || 'Ranga Reddy'}</span>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Survey Area Zone</span>
                  <span className="text-white font-semibold block">{user?.surveyArea || 'Western Ranga Reddy Cadastral Zone'}</span>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 sm:col-span-2 lg:col-span-3">
                  <span className="text-slate-400 text-[11px] font-bold block">
                    Territorial Jurisdiction Mandals:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {(user?.assignedMandals || ['Serilingampally', 'Rajendranagar', 'Gandipet']).map((mandal) => (
                      <span
                        key={mandal}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 font-semibold text-xs"
                      >
                        <MapPin className="w-3 h-3 text-teal-400" />
                        {mandal} Mandal
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Professional Authorization */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-400" />
                  <span>PROFESSIONAL AUTHORIZATION</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  Gazetted Surveyor License
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Survey License Number</span>
                  <span className="font-mono text-white font-bold text-sm block">
                    {user?.licenseNumber || 'SURV/TEL/2014/8821'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">License Status</span>
                  <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active & Authorized
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">DGPS Authorization</span>
                  <span className="text-cyan-300 font-semibold block">
                    Authorized for DGPS Rover Base Station Operations
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 sm:col-span-2 lg:col-span-3">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Survey Authority</span>
                  <span className="text-slate-200 font-medium block">
                    Telangana State Directorate of Survey Settlement & Land Records
                  </span>
                </div>
              </div>
            </div>

            {/* 6. GIS Work Summary */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-400" />
                  <span>GIS WORK SUMMARY</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Live System Source of Truth
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Pending GIS Reviews</span>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                    {stats.pendingReview}
                  </div>
                  <span className="text-[10px] text-slate-500">Awaiting inspection</span>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Overlaps Detected</span>
                  <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                    {stats.overlapsDetected}
                  </div>
                  <span className="text-[10px] text-slate-500">Spatial discrepancies</span>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Parcels Processed</span>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                    {stats.resolvedToday}
                  </div>
                  <span className="text-[10px] text-slate-500">Current shift records</span>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Parcels Ratified</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {history.length + 328}
                  </div>
                  <span className="text-[10px] text-slate-500">Cadastre master updates</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg hover:scale-[1.02]"
              >
                <Save className="w-4 h-4" />
                <span>Save Particulars</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. Security & GIS Access */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>SECURITY & GIS ACCESS</span>
              </h3>
              <span className="text-[10px] text-teal-400 font-mono font-bold">
                Government Cadastral Node
              </span>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Account Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active (Official Session)
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Authentication Status</span>
                <span className="text-slate-200 font-medium">Biometric / PKI Token Verified</span>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">2FA Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Enabled (Govt OTP / Authenticator)
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">DGPS Key Status</span>
                <span className="text-teal-300 font-mono font-bold">Active (Base Station HYD-NORTH-04)</span>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">GIS Access Status</span>
                <span className="text-slate-200 font-medium">Read / Write / Ratify Cadastral Layers</span>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Last Login</span>
                <span className="text-slate-300 font-mono">Today, 09:15 IST (Official Network)</span>
              </div>
            </div>

            {/* Hardware Key Banner */}
            <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 flex items-start gap-3">
              <Compass className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-white">PostGIS Authentication Key Active</div>
                <p className="text-teal-300/90 leading-relaxed">
                  Geospatial cryptographic key active for BhooNaksha WFS/WMS cadastral layer commits. DGPS Base Station HYD-NORTH-04 synchronized for sub-meter parcel ratifications.
                </p>
              </div>
            </div>

            {/* Password Update Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Update Officer Password</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Current Officer Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Update Security Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfilePage;
