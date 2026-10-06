import React, { useState } from 'react';
import { GisBoundaryData } from '../api/types';
import { ShieldCheck, AlertTriangle, Layers, Maximize2, Compass } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n';

interface MapPreviewProps {
  gisData?: GisBoundaryData;
  surveyNumber?: string;
  village?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  gisData,
  surveyNumber = '118/A',
  village = 'Gachibowli',
}) => {
  const { t } = useTranslation();
  const [showDocBoundary, setShowDocBoundary] = useState(true);
  const [showGovBoundary, setShowGovBoundary] = useState(true);
  const [satelliteMode, setSatelliteMode] = useState(false);

  const overlap = gisData?.overlapPercentage ?? 99.8;
  const isEncroachment = gisData?.encroachmentAlert ?? false;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {t('Cadastral GIS Verification Map')}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ({t('Sy.')} #{surveyNumber}, {village})
          </span>
        </div>

        {/* Layer toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDocBoundary(!showDocBoundary)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5',
              showDocBoundary
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            <span>{t('Document Deed (Red)')}</span>
          </button>

          <button
            onClick={() => setShowGovBoundary(!showGovBoundary)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5',
              showGovBoundary
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>{t('Govt Master Cadastre (Blue)')}</span>
          </button>

          <button
            onClick={() => setSatelliteMode(!satelliteMode)}
            className={cn(
              'p-1.5 rounded-lg border text-xs transition-colors',
              satelliteMode
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            )}
            title="Toggle Satellite Base Layer"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cadastral SVG Map Canvas */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Cadastral Background Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <defs>
            <pattern id="cadastral-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cadastral-grid)" />
        </svg>

        {/* Survey Parcels Layer */}
        <svg
          viewBox="0 0 500 300"
          className="w-full h-full max-w-xl p-4 transition-transform duration-300"
        >
          {/* Adjoining survey boundaries */}
          <polygon
            points="40,30 160,25 150,140 35,130"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          <text x="75" y="80" fill="#64748b" fontSize="10" fontFamily="monospace">
            Sy. 117 (Farm)
          </text>

          <polygon
            points="330,30 460,40 450,150 325,140"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          <text x="360" y="80" fill="#64748b" fontSize="10" fontFamily="monospace">
            Sy. 119 (Paddy)
          </text>

          {/* Government Master Boundary Polygon (Blue) */}
          {showGovBoundary && (
            <polygon
              points="165,35 320,45 315,240 155,230"
              fill="rgba(59, 130, 246, 0.2)"
              stroke="#3b82f6"
              strokeWidth="2.5"
            />
          )}

          {/* Document Extracted Boundary Polygon (Red) */}
          {showDocBoundary && (
            <polygon
              points={
                isEncroachment
                  ? "170,35 335,48 315,240 155,230"
                  : "165,35 320,45 315,240 155,230"
              }
              fill="rgba(244, 63, 94, 0.25)"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray={isEncroachment ? "5 3" : undefined}
            />
          )}

          {/* North Direction Arrow */}
          <g transform="translate(450, 40)">
            <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <path d="M 0 -10 L 4 0 L -4 0 Z" fill="#ef4444" />
            <path d="M 0 10 L 4 0 L -4 0 Z" fill="#94a3b8" />
            <text x="-4" y="-12" fill="#ef4444" fontSize="9" fontWeight="bold">
              N
            </text>
          </g>

          {/* Center Parcel Survey Number Label */}
          <text
            x="225"
            y="135"
            fill="#ffffff"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            Sy. {surveyNumber}
          </text>
          <text
            x="225"
            y="155"
            fill="#10b981"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            Match: {overlap}%
          </text>
        </svg>

        {/* Floating status card */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-slate-900/90 backdrop-blur-md border border-slate-700/90 rounded-xl p-3 shadow-xl flex items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              isEncroachment
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            )}
          >
            {isEncroachment ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">
              {isEncroachment ? t('Boundary Deviation Detected') : t('Boundary Alignment Validated')}
            </p>
            <p className="text-slate-400 text-[11px]">
              {t('Spatial overlap:')} <strong className="text-emerald-400">{overlap}%</strong> ({t('Sub-meter tolerance')})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
