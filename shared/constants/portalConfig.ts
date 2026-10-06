export interface PortalConfig {
  code: string;
  name: string;
  path: string;
  port: number;
  realWorld: string;
  desc: string;
  badgeColor: string;
}

export const PORTAL_CONFIGS: PortalConfig[] = [
  {
    code: 'citizen',
    name: 'Citizen Portal',
    path: '/citizen/',
    port: 3000,
    realWorld: 'Land Owner / Applicant',
    desc: 'Submit deed uploads, run document quality checks, and track mutation progress in real-time.',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    code: 'deo',
    name: 'DEO Portal',
    path: '/deo/',
    port: 3001,
    realWorld: 'Patwari (Maker)',
    desc: 'Preliminary data entry, OCR review queue, and manual fallback transcriptions.',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    code: 'verifier',
    name: 'Verifier Portal',
    path: '/verifier/',
    port: 3002,
    realWorld: 'Girdawar / Naib-Tehsildar (Checker)',
    desc: 'Side-by-side comparison against source land records and checker-stage verification.',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    code: 'legal',
    name: 'Legal Portal',
    path: '/legal/',
    port: 3003,
    realWorld: 'Legal Officer / Advisor',
    desc: 'Review legal caveat flags, court encumbrances, and record official legal opinions.',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    code: 'gis',
    name: 'GIS Portal',
    path: '/gis/',
    port: 3004,
    realWorld: 'Land Survey Commissioner',
    desc: 'Cadastral polygon overlays, spatial boundary adjustment, and parcel overlap resolution.',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  },
  {
    code: 'revenue',
    name: 'Revenue Register Office',
    path: '/revenue/',
    port: 3005,
    realWorld: 'Tehsildar (Approver)',
    desc: 'Final statutory sanction, digital certificate generation, and ledger mutation trigger.',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  },
  {
    code: 'admin',
    name: 'System Admin Portal',
    path: '/admin/',
    port: 3006,
    realWorld: 'CCLA / District Collector',
    desc: 'System health telemetry, AI accuracy metrics, user management, and cryptographic audit logs.',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  },
];
