import React, { useState } from 'react';
import { X, Layers, ZoomIn, ZoomOut, Maximize2, MapPin, Eye, Compass, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GISParcelMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyNumber: string;
}

export const GISParcelMapModal: React.FC<GISParcelMapModalProps> = ({ isOpen, onClose, surveyNumber }) => {
  const [zoom, setZoom] = useState(1);
  const [showOverlapLayer, setShowOverlapLayer] = useState(true);
  const [showNeighbors, setShowNeighbors] = useState(true);
  const [showSatelliteMode, setShowSatelliteMode] = useState(false);
  const [hoveredParcel, setHoveredParcel] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  BhooNaksha Vector Cadastral GIS Engine
                </h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-mono font-bold">
                  EPSG:4326 WGS-84
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centroid: 17.4435° N, 78.3772° E • Survey No: <span className="font-mono text-amber-400 font-bold">{surveyNumber}</span> (Sub-Div: P-1)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Layer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-slate-950/50 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Layers:</span>
            <button
              type="button"
              onClick={() => setShowOverlapLayer(!showOverlapLayer)}
              className={cn(
                'px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5',
                showOverlapLayer
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700'
              )}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Overlap Buffer Layer</span>
            </button>
            <button
              type="button"
              onClick={() => setShowNeighbors(!showNeighbors)}
              className={cn(
                'px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5',
                showNeighbors
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700'
              )}
            >
              <Layers className="w-3 h-3" />
              <span>Adjacent Cadastre</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSatelliteMode(!showSatelliteMode)}
              className={cn(
                'px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5',
                showSatelliteMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700'
              )}
            >
              <Eye className="w-3 h-3" />
              <span>{showSatelliteMode ? 'Hybrid Imagery ON' : 'Vector Map Mode'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2.0))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-400 text-xs w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map Canvas / SVG Area */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-4">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #475569 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Interactive Cadastral SVG Engine */}
          <div
            className="transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <svg
              viewBox="0 0 800 500"
              className="w-[780px] h-[480px] select-none filter drop-shadow-2xl"
            >
              <defs>
                {/* Diagonal Stripe Pattern for Potential Overlap Area */}
                <pattern
                  id="overlapHatch"
                  width="10"
                  height="10"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#f43f5e" strokeWidth="3" opacity="0.8" />
                </pattern>
                <linearGradient id="activeParcelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Neighbor 1: Survey 122 (North) */}
              {showNeighbors && (
                <g
                  onMouseEnter={() => setHoveredParcel('Survey 122 (North: Gram Panchayat Cart Track & Village Commons)')}
                  onMouseLeave={() => setHoveredParcel(null)}
                  className="cursor-pointer transition-opacity hover:opacity-90"
                >
                  <polygon
                    points="120,40 480,30 520,140 160,150"
                    fill={showSatelliteMode ? '#1e293b' : '#0f172a'}
                    stroke="#475569"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text x="280" y="90" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    Survey 122 • Cart Track (3.10 Ac)
                  </text>
                </g>
              )}

              {/* Neighbor 2: Survey 121 (West) */}
              {showNeighbors && (
                <g
                  onMouseEnter={() => setHoveredParcel('Survey 121 (West: Private Agricultural Farm)')}
                  onMouseLeave={() => setHoveredParcel(null)}
                  className="cursor-pointer transition-opacity hover:opacity-90"
                >
                  <polygon
                    points="40,160 150,152 140,400 30,380"
                    fill={showSatelliteMode ? '#1e293b' : '#0f172a'}
                    stroke="#475569"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text x="50" y="270" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    Survey 121 (1.80 Ac)
                  </text>
                </g>
              )}

              {/* Neighbor 3: Survey 124 (South - Bordering Canal) */}
              {showNeighbors && (
                <g
                  onMouseEnter={() => setHoveredParcel('Survey 124 (South: Irrigation Canal Reserve)')}
                  onMouseLeave={() => setHoveredParcel(null)}
                  className="cursor-pointer transition-opacity hover:opacity-90"
                >
                  <polygon
                    points="140,405 530,395 620,470 120,470"
                    fill={showSatelliteMode ? '#1e293b' : '#0f172a'}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                  <text x="260" y="440" fill="#60a5fa" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    Survey 124 • Irrigation Canal Reserve (4.20 Ac)
                  </text>
                </g>
              )}

              {/* Neighbor 4: Irrigation Nala (East) */}
              {showNeighbors && (
                <g
                  onMouseEnter={() => setHoveredParcel('East: Minor Irrigation Drainage Nala')}
                  onMouseLeave={() => setHoveredParcel(null)}
                  className="cursor-pointer"
                >
                  <path
                    d="M 525 140 Q 560 270 535 395"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <text x="550" y="270" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                    Minor Nala
                  </text>
                </g>
              )}

              {/* ACTIVE SUBJECT PARCEL: Survey 123/456 (SubDiv P-1) */}
              <g
                onMouseEnter={() => setHoveredParcel('Subject Parcel: Survey 123/456 (SubDiv P-1) • Ramesh Kumar • 2.49 Mapped / 2.50 Recorded')}
                onMouseLeave={() => setHoveredParcel(null)}
                className="cursor-pointer"
              >
                <polygon
                  points="160,150 520,140 530,395 140,405"
                  fill="url(#activeParcelGrad)"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                />

                {/* Centroid Marker & Coordinates */}
                <circle cx="335" cy="270" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <circle cx="335" cy="270" r="18" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />

                <text x="235" y="240" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                  SURVEY 123/456 (P-1)
                </text>
                <text x="245" y="260" fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  Mapped: 2.49 Acres (99.6% Fit)
                </text>
                <text x="250" y="300" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  ULPIN: 36-RR-SER-123-01
                </text>
              </g>

              {/* OVERLAP BUFFER ZONE (Flagged along southern boundary) */}
              {showOverlapLayer && (
                <g
                  onMouseEnter={() => setHoveredParcel('⚠ Potential Overlap: 0.01 Acre buffer interaction with Survey 124 canal reserve boundary')}
                  onMouseLeave={() => setHoveredParcel(null)}
                  className="cursor-pointer animate-pulse"
                >
                  <polygon
                    points="140,395 530,385 530,405 140,405"
                    fill="url(#overlapHatch)"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                  <text x="220" y="380" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                    ⚠ Potential 0.01 Ac Buffer Overlap
                  </text>
                </g>
              )}

              {/* Boundary Distance Annotations */}
              <text x="320" y="135" fill="#e2e8f0" fontSize="10" fontFamily="monospace">North: 340.5 m</text>
              <text x="320" y="420" fill="#e2e8f0" fontSize="10" fontFamily="monospace">South: 338.9 m</text>
              <text x="110" y="280" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-90 110 280)">West: 285.2 m</text>
              <text x="540" y="280" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(90 540 280)">East: 284.1 m</text>
            </svg>
          </div>

          {/* Hovered Parcel Tooltip / Status Display */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-slate-200 font-medium">
                {hoveredParcel || 'Hover over any parcel boundary polygon to inspect cadastral attributes.'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>Projection: <strong>UTM Zone 44N</strong></span>
              <span>•</span>
              <span>Tolerance: <strong>±0.5% Allowed</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer & Legend */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500/40 border border-amber-500" />
                <span className="text-slate-300">Subject Parcel (123/456)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-600" />
                <span className="text-slate-400">Neighboring Cadastres</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-rose-500/30 border border-rose-500" />
                <span className="text-rose-300">Potential Overlap (0.01 Ac)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-cyan-600" />
                <span className="text-cyan-300">Canal / Waterbody</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Close GIS Viewer
            </button>
          </div>

          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              <strong>Statutory GIS Note:</strong> Potential spatial conflict detected. GIS flags potential conflicts for authorized review. Does not constitute a final legal boundary dispute determination.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
