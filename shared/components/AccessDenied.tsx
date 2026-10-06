import React from 'react';
import { ShieldAlert, ArrowRight, LogOut, Home } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export interface AccessDeniedProps {
  requiredRole?: string;
  userRole?: string;
  portalName?: string;
}

const PORTAL_HOME_ROUTES: Record<string, string> = {
  CITIZEN: '/citizen/',
  DEO: '/deo/',
  VERIFIER: '/verifier/',
  LEGAL: '/legal/',
  GIS: '/gis/',
  REVENUE: '/revenue/',
  ADMIN: '/admin/',
};

const PORTAL_DISPLAY_NAMES: Record<string, string> = {
  CITIZEN: 'Citizen Portal (Land Records & Applications)',
  DEO: 'DEO Portal (Patwari / Maker)',
  VERIFIER: 'Verifier Portal (Girdawar / Checker)',
  LEGAL: 'Legal Portal (Legal Officer & Scrutiny)',
  GIS: 'GIS Portal (Cadastral Mapping Specialist)',
  REVENUE: 'Revenue Register Office (Tahsildar Approver)',
  ADMIN: 'System Admin Portal (CCLA Central Administration)',
};

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredRole = 'AUTHORIZED_PERSONNEL',
  userRole,
  portalName,
}) => {
  const { user, logout } = useAuthStore();
  const currentRole = (userRole || user?.role || 'UNKNOWN').toUpperCase();
  const targetHome = PORTAL_HOME_ROUTES[currentRole] || '/';
  const targetPortalName = PORTAL_DISPLAY_NAMES[currentRole] || 'Designated Workspace';

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-100">
      <div className="max-w-lg w-full bg-slate-800/90 border border-red-500/30 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 mb-2">
            Statutory Access Boundary (HTTP 403)
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Access Restricted to {portalName || requiredRole}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Your authenticated identity does not hold the statutory administrative authorization required for this portal.
          </p>
        </div>

        {/* Role Comparison Card */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/50">
            <span className="text-slate-400">Authenticated Identity:</span>
            <span className="font-semibold text-white">{user?.full_name || user?.email || 'Logged In User'}</span>
          </div>
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/50">
            <span className="text-slate-400">Your Backend Role:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
              {currentRole}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Required Portal Role:</span>
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono font-semibold">
              {requiredRole.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {PORTAL_HOME_ROUTES[currentRole] && (
            <a
              href={targetHome}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/30 text-sm"
            >
              <span>Go to Your {targetPortalName}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          )}

          <div className="grid grid-cols-2 gap-3">
            <a
              href="/"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-colors text-xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal Launcher</span>
            </a>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-medium transition-colors text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Bhooraksha Land Administration & Cadastral Verification Engine
        </p>
      </div>
    </div>
  );
};
