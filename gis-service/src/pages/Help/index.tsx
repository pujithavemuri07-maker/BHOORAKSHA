import {
  HelpCircle,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Phone,
  Mail,
  FileCheck,
  Compass,
  Layers,
  Sliders,
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export const HelpPage = () => {
  const { t } = useTranslation();

  const checklistSteps = [
    {
      step: '01',
      title: 'Load Cadastral & Deed Layers',
      description:
        'Verify that official BhooNaksha village cadastral sheets (Blue line) and citizen registered deed coordinates (Red line) are accurately projected in EPSG:4326.',
    },
    {
      step: '02',
      title: 'Analyze Sub-Meter Overlap',
      description:
        'Inspect the yellow intersection zone calculated via PostGIS ST_Intersection. Confirm if the calculated overlap percentage reflects real-world boundary overlap.',
    },
    {
      step: '03',
      title: 'Evaluate Traffic Light Classification',
      description:
        'Apply statutory criteria: Green (< 5% overlap, within natural survey tolerance), Yellow (5-15% overlap, requires vertex adjustment), Red (> 15% overlap, severe encroachment).',
    },
    {
      step: '04',
      title: 'Cross-Check Adjoining Parcels',
      description:
        'Examine adjacent survey numbers and boundary descriptions to prevent encroachment onto public water bodies, forest buffers, or adjacent private landholders.',
    },
    {
      step: '05',
      title: 'Execute Ratification Decision',
      description:
        'Confirm clean parcels, adjust minor vertex shifts, schedule Mandal DGPS ground surveys for contested areas, or reject outright with statutory justification.',
    },
  ];

  const trafficRules = [
    {
      color: 'Green',
      range: '< 5% Overlap',
      action: 'Confirm Cadastral Boundary',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description:
        'Minor coordinate variance within acceptable cartographic tolerance (up to 0.5m). Eligible for instant GIS certification.',
    },
    {
      color: 'Yellow',
      range: '5% - 15% Overlap',
      action: 'Adjust Boundary or Flag Field Survey',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description:
        'Moderate variance. Inspect adjacent parcels. Adjust boundary vertices if document error, or dispatch Mandal DGPS survey.',
    },
    {
      color: 'Red',
      range: '> 15% Overlap',
      action: 'Mandatory Field Survey or Reject',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description:
        'Severe spatial overlap indicating encroachment onto adjoining parcels, government lands, or water body buffers.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-teal-400" />
          <span>{t('common.help')} & Cadastral Verification Manual</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Standard operating procedures and spatial boundary validation guidelines for GIS Officers
        </p>
      </div>

      {/* 5-Step Spatial Verification SOP */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-teal-400" />
          <span>5-Step Cadastral Verification Protocol</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {checklistSteps.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-xs font-mono font-black text-teal-400">
                  {item.step}
                </span>
                <h3 className="text-xs font-bold text-slate-100 mt-1">
                  {item.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Light Classification System */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-400" />
          <span>Traffic Light Overlap Classification Matrix</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trafficRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${rule.badge}`}>
                  {rule.color} Tag
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {rule.range}
                </span>
              </div>
              <div className="text-xs font-bold text-white">{rule.action}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Support Section */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-cyan-950/40 rounded-2xl border border-teal-500/20 p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-bold text-white">Geospatial Technical Support Directorate</h3>
          <p className="text-xs text-slate-400 mt-1">
            For BhooNaksha WFS API errors, DGPS base station synchronization, or survey disputes
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-teal-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              Toll-Free: 1800-425-BHOOMI (246664)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              Desk: 040-2345-SURVEY
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              gis-support@bhooraksha.gov.in
            </span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Node Status</span>
          <span className="text-xs text-emerald-400 font-bold font-mono">BhooNaksha TG-01 ONLINE</span>
        </div>
      </div>
    </div>
  );
};
export default HelpPage;
