import React, { useState } from 'react';
import { GISData } from '../../api/types';
import { Map, MapPin, CheckCircle2, AlertTriangle, Layers, Compass, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface GISValidationPanelProps {
  gisData?: GISData;
}

export const GISValidationPanel: React.FC<GISValidationPanelProps> = ({ gisData }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'neighbors'>('map');

  const data: GISData = gisData || {
    recordedArea: 2.50,
    calculatedArea: 2.49,
    difference: 0.01,
    tolerance: 0.02,
    unit: 'Acres',
    result: 'WITHIN_TOLERANCE',
    surveyNumber: '123/456',
    neighboringParcels: {
      north: 'Survey 122 (Panchayat Cart Track)',
      south: 'Survey 124 (Canal Reserve Buffer)',
      east: 'Minor Irrigation Nala Buffer',
      west: 'Survey 121 (Private Agri Farm)',
    },
    boundaryStatusText: 'Parcel boundaries aligned within statutory tolerance (0.01 acre dev < 0.02 acre margin).',
  };

  const isWithinTolerance = data.result === 'WITHIN_TOLERANCE';

  const handleRequestSurvey = () => {
    toast.success(`Field Survey request registered for Survey #${data.surveyNumber}`);
  };

  const handleAddRemark = () => {
    toast.success('GIS boundary remark saved to inspection logs.');
  };

  return (
    <div id="section-gis" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Map className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              GIS Spatial Boundary & Spatial Extent Validation
            </h3>
            <p className="text-xs text-slate-400">
              Interactive cadastral map overlay & satellite perimeter area calculation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isWithinTolerance ? (
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              WITHIN TOLERANCE (±{data.tolerance} {data.unit})
            </span>
          ) : (
            <span className="text-xs font-bold font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              POTENTIAL AREA MISMATCH
            </span>
          )}
        </div>
      </div>

      {/* Tolerance & Area Comparison Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Recorded Extent</span>
          <span className="font-mono font-bold text-white text-sm">{data.recordedArea} {data.unit}</span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">GIS Calculated</span>
          <span className="font-mono font-bold text-purple-400 text-sm">{data.calculatedArea} {data.unit}</span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Difference</span>
          <span className={`font-mono font-bold text-sm ${data.difference > data.tolerance ? 'text-rose-400' : 'text-emerald-400'}`}>
            {data.difference} {data.unit}
          </span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Configured Margin</span>
          <span className="font-mono text-slate-300 text-sm">±{data.tolerance} {data.unit}</span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Validation Result</span>
          <span className={`font-mono font-bold text-xs uppercase ${isWithinTolerance ? 'text-emerald-400' : 'text-rose-400'}`}>
            {data.result.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Interactive GIS Map Canvas & Boundaries */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative">
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                activeTab === 'map' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Map Overlay
            </button>
            <button
              onClick={() => setActiveTab('neighbors')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                activeTab === 'neighbors' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Neighboring Parcels
            </button>
          </div>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
            Cadastral Coordinates Layer: Active
          </span>
        </div>

        {activeTab === 'map' ? (
          <div className="h-[280px] bg-slate-950 relative flex items-center justify-center p-4">
            {/* Simulated Canvas Map View */}
            <svg className="w-full h-full max-w-lg" viewBox="0 0 400 240">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Neighboring Polygons */}
              <polygon points="40,20 180,20 160,80 30,70" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x="75" y="45" fill="#64748b" fontSize="10" fontFamily="monospace">Sy. 122 (North)</text>

              <polygon points="210,30 360,40 370,120 220,110" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x="260" y="75" fill="#64748b" fontSize="10" fontFamily="monospace">Nala Buffer (East)</text>

              <polygon points="30,130 170,140 180,220 20,210" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x="60" y="180" fill="#64748b" fontSize="10" fontFamily="monospace">Sy. 121 (West)</text>

              {/* Target Parcel Under Verification */}
              <polygon
                points="70,80 230,85 240,165 80,160"
                fill="rgba(168, 85, 247, 0.15)"
                stroke="#c084fc"
                strokeWidth="2.5"
                className="animate-pulse"
              />
              <text x="110" y="125" fill="#f3e8ff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Sy. #{data.surveyNumber} ({data.calculatedArea} Ac)
              </text>

              {/* Map Pins */}
              <circle cx="70" cy="80" r="4" fill="#a855f7" />
              <circle cx="230" cy="85" r="4" fill="#a855f7" />
              <circle cx="240" cy="165" r="4" fill="#a855f7" />
              <circle cx="80" cy="160" r="4" fill="#a855f7" />
            </svg>

            <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-[10px] text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-purple-500/40 border border-purple-400" />
                <span>Target Parcel ({data.surveyNumber})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" />
                <span>Adjoining Survey Boundaries</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">North Boundary</span>
              <span className="text-slate-200 font-medium">{data.neighboringParcels.north}</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">South Boundary</span>
              <span className="text-slate-200 font-medium">{data.neighboringParcels.south}</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">East Boundary</span>
              <span className="text-slate-200 font-medium">{data.neighboringParcels.east}</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">West Boundary</span>
              <span className="text-slate-200 font-medium">{data.neighboringParcels.west}</span>
            </div>
          </div>
        )}
      </div>

      {/* Operational Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{data.boundaryStatusText || 'Parcel boundaries verified against state cadastral GIS.'}</span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            VIEW MAP
          </button>
          <button
            onClick={handleRequestSurvey}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5" />
            REQUEST FIELD SURVEY
          </button>
          <button
            onClick={handleAddRemark}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
          >
            ADD GIS REMARK
          </button>
        </div>
      </div>
    </div>
  );
};
