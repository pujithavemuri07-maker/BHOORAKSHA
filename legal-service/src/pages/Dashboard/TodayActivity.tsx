import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  ArrowRight,
  History,
  FileSearch,
  Scale,
  Database,
  Search,
  BookOpen,
} from 'lucide-react';
import { useTranslation } from '../../i18n';

/* 5. CASE ISSUE SUMMARY */
export const WhyCasesFlagged: React.FC = () => {
  const { t } = useTranslation();

  const issues = [
    { title: 'Ownership / Title Mismatch', count: 3, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { title: 'Duplicate / Conflicting Registration', count: 2, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { title: 'Active Dispute / Court Case', count: 2, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { title: 'Boundary / Area Mismatch', count: 2, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { title: 'Missing Supporting Document', count: 1, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { title: 'Encumbrance / Charge Detected', count: 1, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {t('Why Cases Are Being Flagged')}
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
            6 {t('Issue Types')}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          {t('Breakdown of primary legal concerns identified across current land-record cases:')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
          {issues.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl ${item.bg} ${item.border} border flex items-center justify-between transition-all hover:bg-slate-800/60 cursor-pointer`}
            >
              <span className="text-xs font-semibold text-slate-200">
                {t(item.title)}
              </span>
              <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-full ${item.color} bg-slate-950/70 border border-slate-800`}>
                {item.count} {item.count === 1 ? t('case') : t('cases')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>{t('Click any category to filter pending cases')}</span>
        <Link to="/legal/review" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
          <span>{t('Review All')}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

/* 6. LEGAL RISK OVERVIEW */
export const LegalRiskOverview: React.FC = () => {
  const { t } = useTranslation();
  const high = 3;
  const medium = 4;
  const low = 2;
  const total = high + medium + low;

  const highPct = Math.round((high / total) * 100);
  const medPct = Math.round((medium / total) * 100);
  const lowPct = Math.round((low / total) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            {t('Legal Risk Overview')}
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
            {total} {t('Active Cases')}
          </span>
        </div>

        {/* 3 Simple Categories */}
        <div className="grid grid-cols-3 gap-2.5 mt-3 text-center">
          <div className="p-3 bg-rose-950/30 border border-rose-500/20 rounded-xl space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">{t('High Risk')}</span>
            <span className="text-xl font-black font-mono text-rose-300">{high}</span>
            <span className="text-[10px] text-slate-400 block">{t('cases')}</span>
          </div>

          <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">{t('Medium Risk')}</span>
            <span className="text-xl font-black font-mono text-amber-300">{medium}</span>
            <span className="text-[10px] text-slate-400 block">{t('cases')}</span>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">{t('Low Risk')}</span>
            <span className="text-xl font-black font-mono text-emerald-300">{low}</span>
            <span className="text-[10px] text-slate-400 block">{t('cases')}</span>
          </div>
        </div>

        {/* Horizontal Visualization / Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span className="text-rose-400">{highPct}% {t('High')}</span>
            <span className="text-amber-400">{medPct}% {t('Medium')}</span>
            <span className="text-emerald-400">{lowPct}% {t('Low')}</span>
          </div>
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div style={{ width: `${highPct}%` }} className="bg-rose-500 h-full" title={`High: ${high}`} />
            <div style={{ width: `${medPct}%` }} className="bg-amber-500 h-full" title={`Medium: ${medium}`} />
            <div style={{ width: `${lowPct}%` }} className="bg-emerald-500 h-full" title={`Low: ${low}`} />
          </div>
        </div>

        {/* Clear Explanatory Notes */}
        <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
          {t('Risk is based on detected ownership conflicts, registration inconsistencies, disputes, missing records, and other configured validation findings.')}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 italic">
        {t('Risk indicators are generated for officer review; all statutory determinations remain under officer discretion.')}
      </div>
    </div>
  );
};

/* 7. UPCOMING ACTIONS / DEADLINES */
export const UpcomingActions: React.FC = () => {
  const { t } = useTranslation();

  const actions = [
    {
      id: 'LEG-2026-601',
      title: t('Legal review pending'),
      detail: 'Ramesh Kumar Patel • Survey 123/456',
      statusText: t('Action required'),
      due: t('Today'),
      dueColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
    {
      id: 'LEG-2026-604',
      title: t('Additional document verification'),
      detail: 'Vikram Singh • Survey 304/A',
      statusText: t('Supporting affidavit'),
      due: t('Due tomorrow'),
      dueColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'LEG-2026-607',
      title: t('Escalated for higher-level review'),
      detail: 'M. Raghavendra • Survey 118',
      statusText: t('Referred to Tehsildar'),
      due: t('Due in 2 days'),
      dueColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400" />
          {t('Upcoming Actions & Deadlines')}
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">
          {t('Priority Workload')}
        </span>
      </div>

      <div className="space-y-2.5">
        {actions.map((act) => (
          <div
            key={act.id}
            className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-300">{act.id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-semibold text-slate-200">{act.title}</span>
              </div>
              <div className="text-[11px] text-slate-400">{act.detail}</div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${act.dueColor}`}>
                {act.due}
              </span>
              <Link
                to={`/legal/review/${act.id}`}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title={t('Review Case')}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 8. RECENT LEGAL DECISIONS */
export const RecentLegalDecisions: React.FC = () => {
  const { t } = useTranslation();

  const decisions = [
    {
      id: 'LEG-2026-588',
      applicant: 'G. Harish Kumar',
      decision: t('Cleared'),
      date: '07 Sep 2026',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'LEG-2026-590',
      applicant: 'S. Anitha Devi',
      decision: t('Additional Documents Required'),
      date: '07 Sep 2026',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    {
      id: 'LEG-2026-594',
      applicant: 'M. Raghavendra',
      decision: t('Escalated'),
      date: '06 Sep 2026',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
    {
      id: 'LEG-2026-582',
      applicant: 'P. Venkatesh',
      decision: t('Blocked'),
      date: '05 Sep 2026',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          {t('Recent Legal Decisions')}
        </h3>
        <Link
          to="/legal/history"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {t('View Full Ledger →')}
        </Link>
      </div>

      <div className="space-y-2.5">
        {decisions.map((dec) => (
          <div
            key={dec.id}
            className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-300">{dec.id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-semibold text-slate-100">{dec.applicant}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {t('Reviewed on')} <span className="font-mono text-slate-300">{dec.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${dec.badgeColor}`}>
                {dec.decision}
              </span>
              <Link
                to="/legal/history"
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                {t('View Details')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 9. QUICK ACTIONS */
export const QuickActions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          {t('Quick Actions')}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/legal/review"
          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
        >
          <span className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-indigo-400" />
            {t('Open Legal Review Queue')}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </Link>

        <Link
          to="/legal/review"
          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
        >
          <span className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400" />
            {t('View Escalated Cases')}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
        </Link>

        <Link
          to="/legal/review"
          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            {t('Search Land Record')}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
        </Link>

        <Link
          to="/legal/history"
          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
        >
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            {t('View Legal Audit Ledger')}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
};

/* 10. SYSTEM / DATA STATUS */
export const SystemDataStatus: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    { name: t('Registration Records'), status: t('Connected') },
    { name: t('Revenue Records'), status: t('Connected') },
    { name: t('Cadastral / GIS Data'), status: t('Connected') },
    { name: t('Legal Case Data'), status: t('Connected') },
    { name: t('Audit Ledger'), status: t('Active') },
  ];

  return (
    <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-indigo-400" />
        <span className="font-bold text-slate-300">{t('Land Record Services:')}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
        {services.map((svc, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">{svc.name}</span>
            <span className="text-emerald-400 font-semibold">{svc.status}</span>
          </div>
        ))}
      </div>

      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
        {t('System Simulation / Demo Data')}
      </span>
    </div>
  );
};

/* Backward compatible default export */
export const TodayActivity = WhyCasesFlagged;
