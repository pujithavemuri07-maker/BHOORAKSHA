import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngCoord, TrafficLight, GISApplication } from '../api/types';
import { TRAFFIC_LIGHT_SYSTEM } from '../utils/constants';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Edit3, Check, Ruler, MapPin, Lock } from 'lucide-react';

interface InteractiveMapProps {
  application?: GISApplication;
  documentBoundary?: LatLngCoord[];
  governmentBoundary?: LatLngCoord[];
  overlapPercentage?: number;
  trafficLight?: TrafficLight;
  isEditing?: boolean;
  isFinalized?: boolean;
  onToggleEdit?: () => void;
  onSaveAdjustment?: (newCoords: LatLngCoord[]) => void;
  onVerticesChange?: (newCoords: LatLngCoord[]) => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  application,
  documentBoundary: propDocBoundary,
  governmentBoundary: propGovtBoundary,
  overlapPercentage: propOverlap,
  trafficLight: propTrafficLight,
  isEditing: externalIsEditing,
  isFinalized = false,
  onToggleEdit,
  onSaveAdjustment,
  onVerticesChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const initialDocBoundary =
    propDocBoundary ||
    application?.documentBoundaryCoordinates ||
    application?.documentBoundary ||
    [];

  const govtBoundary =
    propGovtBoundary ||
    application?.govtBoundaryCoordinates ||
    application?.governmentBoundary ||
    [];

  const overlapPercentage = propOverlap ?? application?.overlapPercentage ?? 0;
  const trafficLight: TrafficLight =
    propTrafficLight || application?.trafficLight || 'green';

  const [internalEditing, setInternalEditing] = useState(false);
  // If finalized, force editing to false
  const isEditing = !isFinalized && (externalIsEditing !== undefined ? externalIsEditing : internalEditing);

  const [currentDocCoords, setCurrentDocCoords] = useState<LatLngCoord[]>(initialDocBoundary);
  const [measureActive, setMeasureActive] = useState(false);
  const [measuredDistance, setMeasuredDistance] = useState<string | null>(null);
  const [baseMapType, setBaseMapType] = useState<'carto' | 'osm'>('osm');

  // Layer toggle state
  const [showGovtLayer, setShowGovtLayer] = useState(true);
  const [showClaimLayer, setShowClaimLayer] = useState(true);
  const [showOverlapLayer, setShowOverlapLayer] = useState(true);

  // Sync coords when prop changes
  useEffect(() => {
    if (initialDocBoundary.length > 0) {
      setCurrentDocCoords(initialDocBoundary);
    }
  }, [application?.id, propDocBoundary, application?.documentBoundaryCoordinates]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const centerLat = currentDocCoords[0]?.[0] || govtBoundary[0]?.[0] || 17.441;
    const centerLng = currentDocCoords[0]?.[1] || govtBoundary[0]?.[1] || 78.348;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 16,
      zoomControl: false,
    });

    const tileUrl =
      baseMapType === 'carto'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    // 1. Blue Polygon: Official Government Cadastral Boundary
    if (showGovtLayer && govtBoundary.length > 0) {
      const govtPoly = L.polygon(govtBoundary, {
        color: '#2563eb', // Blue
        weight: 3.5,
        opacity: 0.95,
        fillColor: '#3b82f6',
        fillOpacity: 0.2,
        dashArray: '5, 5',
      }).addTo(map);

      govtPoly.bindPopup(
        `<div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #2563eb;">🔵 Government Cadastral Boundary</strong><br/>
          Official BhooNaksha Revenue Register Record<br/>
          Survey #${application?.surveyNumber || '123/456'} (${application?.govtCadastralAreaAcres.toFixed(2) || '2.45'} Ac)
        </div>`
      );
    }

    // 2. Red Polygon: Claimed Document Boundary
    if (showClaimLayer && currentDocCoords.length > 0) {
      const docPoly = L.polygon(currentDocCoords, {
        color: '#dc2626', // Red
        weight: 3.5,
        opacity: 0.95,
        fillColor: '#ef4444',
        fillOpacity: 0.25,
      }).addTo(map);

      docPoly.bindPopup(
        `<div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #dc2626;">🔴 Submitted Document Claim</strong><br/>
          Registered Title Deed Polygon<br/>
          Claimed Area: ${application?.documentAreaAcres.toFixed(2) || '2.50'} Ac
        </div>`
      );
    }

    // 3. Yellow Intersection / Overlap Area
    if (showOverlapLayer && currentDocCoords.length > 0 && govtBoundary.length > 0) {
      const overlapSample: LatLngCoord[] = [
        [
          (currentDocCoords[0][0] + govtBoundary[0][0]) / 2,
          (currentDocCoords[0][1] + govtBoundary[0][1]) / 2,
        ],
        [
          (currentDocCoords[1][0] + govtBoundary[1][0]) / 2,
          (currentDocCoords[1][1] + govtBoundary[1][1]) / 2,
        ],
        [
          (currentDocCoords[2][0] + govtBoundary[2][0]) / 2,
          (currentDocCoords[2][1] + govtBoundary[2][1]) / 2,
        ],
      ];

      const overlapPoly = L.polygon(overlapSample, {
        color: '#eab308', // Yellow
        weight: 2,
        opacity: 0.9,
        fillColor: '#facc15',
        fillOpacity: 0.45,
      }).addTo(map);

      overlapPoly.bindPopup(
        `<div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #ca8a04;">🟡 Calculated Overlap Zone</strong><br/>
          Intersecting Boundary Area: ${overlapPercentage.toFixed(1)}% Match<br/>
          Overlap Extent: ${application?.overlapAreaAcres.toFixed(2) || '2.38'} Ac
        </div>`
      );
    }

    // Fit bounds centered precisely on the selected parcel
    const allPoints = [...currentDocCoords, ...govtBoundary];
    if (allPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [55, 55] });
    }

    // Vertex Markers when editing is active and NOT finalized
    if (isEditing && !isFinalized && currentDocCoords.length > 0) {
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      currentDocCoords.forEach((coord, idx) => {
        const markerIcon = L.divIcon({
          className: 'custom-vertex-marker',
          html: `<div style="
            width: 16px; 
            height: 16px; 
            background: #facc15; 
            border: 2px solid #0f172a; 
            border-radius: 50%; 
            cursor: grab;
            box-shadow: 0 0 8px rgba(0,0,0,0.8);
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker(coord, {
          icon: markerIcon,
          draggable: true,
        }).addTo(markersGroup);

        marker.on('dragend', (e) => {
          const newLatLng = e.target.getLatLng();
          const updated = [...currentDocCoords];
          updated[idx] = [newLatLng.lat, newLatLng.lng];
          setCurrentDocCoords(updated);
          onVerticesChange?.(updated);
          onSaveAdjustment?.(updated);
        });
      });
    }

    // Measurement tool click listener
    if (measureActive) {
      let measurePoints: L.LatLng[] = [];
      const measureLine = L.polyline([], { color: '#38bdf8', weight: 3, dashArray: '6, 6' }).addTo(
        map
      );

      map.on('click', (e: L.LeafletMouseEvent) => {
        measurePoints.push(e.latlng);
        measureLine.addLatLng(e.latlng);

        if (measurePoints.length >= 2) {
          let totalDistMeters = 0;
          for (let i = 0; i < measurePoints.length - 1; i++) {
            totalDistMeters += measurePoints[i].distanceTo(measurePoints[i + 1]);
          }
          setMeasuredDistance(`${totalDistMeters.toFixed(2)} meters (${(totalDistMeters * 3.28084).toFixed(1)} ft)`);
        }
      });
    }

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [
    currentDocCoords,
    govtBoundary,
    baseMapType,
    isEditing,
    isFinalized,
    overlapPercentage,
    measureActive,
    showGovtLayer,
    showClaimLayer,
    showOverlapLayer,
  ]);

  const handleZoomIn = () => leafletMapRef.current?.zoomIn();
  const handleZoomOut = () => leafletMapRef.current?.zoomOut();
  const handleReset = () => {
    const allPoints = [...(currentDocCoords || []), ...(govtBoundary || [])];
    if (allPoints.length > 0 && leafletMapRef.current) {
      leafletMapRef.current.fitBounds(L.latLngBounds(allPoints), { padding: [55, 55] });
    }
  };

  const handleSnapToGovernment = () => {
    if (govtBoundary.length > 0) {
      setCurrentDocCoords([...govtBoundary]);
      onVerticesChange?.([...govtBoundary]);
      onSaveAdjustment?.([...govtBoundary]);
    }
  };

  const toggleEditingState = () => {
    if (isFinalized) return;
    if (onToggleEdit) {
      onToggleEdit();
    } else {
      setInternalEditing((prev) => !prev);
    }
  };

  const tfConfig = TRAFFIC_LIGHT_SYSTEM[trafficLight] || TRAFFIC_LIGHT_SYSTEM.green;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 ${className}`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-[520px] bg-slate-900 z-0" />

      {/* Top Left: Selected Parcel Badge & Traffic Light */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-xs">
        {/* Selected Parcel Badge */}
        <div className="bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-teal-500/40 shadow-xl text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-teal-400 font-bold uppercase tracking-wider text-[10px]">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>SELECTED PARCEL INSPECTION</span>
          </div>
          <div className="font-bold text-white text-sm">
            Survey #{application?.surveyNumber || '123/456'}{application?.subdivisionNumber ? `/${application.subdivisionNumber}` : ''}
          </div>
          <div className="text-[11px] text-slate-300">
            App ID: <span className="font-mono text-teal-300 font-bold">{application?.applicationNo || 'GIS-2026-701'}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {application?.village || 'Gachibowli'}, {application?.mandal || 'Serilingampally'}
          </div>
        </div>

        {/* Traffic Light Status Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-lg text-xs">
          <span
            className="w-3 h-3 rounded-full animate-pulse shadow-sm shrink-0"
            style={{ backgroundColor: tfConfig.hex }}
          />
          <span className="font-bold text-white text-[11px]">
            {t(`gis.trafficLight.${trafficLight}`)}
          </span>
          <span className="text-slate-500 font-mono">|</span>
          <span className="font-mono font-extrabold text-teal-300 text-[11px]">
            {overlapPercentage.toFixed(1)}% Match
          </span>
        </div>
      </div>

      {/* Top Right: Multi-Color Map Legend & Layer Controls */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-2 max-w-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            MAP LEGEND & LAYERS
          </span>
          <span className="text-[9px] text-slate-500 font-mono">Toggle Views</span>
        </div>

        <button
          type="button"
          onClick={() => setShowGovtLayer(!showGovtLayer)}
          className={`w-full flex items-center justify-between text-left p-1 rounded transition-colors ${
            showGovtLayer ? 'text-slate-200' : 'text-slate-500 line-through'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 bg-blue-500 rounded inline-block" />
            <span className="font-semibold text-[11px]">Government Boundary</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono">🔵 BLUE</span>
        </button>

        <button
          type="button"
          onClick={() => setShowClaimLayer(!showClaimLayer)}
          className={`w-full flex items-center justify-between text-left p-1 rounded transition-colors ${
            showClaimLayer ? 'text-slate-200' : 'text-slate-500 line-through'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 bg-red-500 rounded inline-block" />
            <span className="font-semibold text-[11px]">Submitted Claimed Boundary</span>
          </div>
          <span className="text-[10px] text-red-400 font-mono">🔴 RED</span>
        </button>

        <button
          type="button"
          onClick={() => setShowOverlapLayer(!showOverlapLayer)}
          className={`w-full flex items-center justify-between text-left p-1 rounded transition-colors ${
            showOverlapLayer ? 'text-slate-200' : 'text-slate-500 line-through'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-2 bg-yellow-400/80 border border-yellow-300 rounded inline-block" />
            <span className="font-semibold text-[11px]">Overlap / Intersection Zone</span>
          </div>
          <span className="text-[10px] text-yellow-400 font-mono">🟡 YELLOW</span>
        </button>

        <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 bg-emerald-500 rounded inline-block" />
            <span>Non-overlapping Area</span>
          </div>
          <span className="text-emerald-400 font-mono">🟢 GREEN</span>
        </div>
      </div>

      {/* Floating Left: Map Interaction Controls */}
      <div className="absolute bottom-6 left-4 z-10 flex flex-col gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg flex flex-col">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={t('gis.zoomIn')}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={t('gis.zoomOut')}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Recenter Map on Parcel"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Base map switcher */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg flex">
          <button
            type="button"
            onClick={() => setBaseMapType(baseMapType === 'carto' ? 'osm' : 'carto')}
            className="p-2 text-slate-300 hover:text-teal-400 hover:bg-slate-800 rounded-lg text-[10px] font-bold font-mono transition-colors"
            title="Switch Map Tiles"
          >
            <Layers className="w-4 h-4 inline mr-1" />
            {baseMapType.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Floating Bottom Center: Interactive Editing & Tools Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-2xl">
        {isFinalized ? (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-teal-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Boundary Finalized & Locked</span>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleEditingState}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isEditing
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? 'Finish Vertex Edit' : t('gis.dragVertices')}</span>
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleSnapToGovernment}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                <span>Snap to Govt Boundary</span>
              </button>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setMeasureActive(!measureActive);
            if (measureActive) setMeasuredDistance(null);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            measureActive
              ? 'bg-sky-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>{measureActive ? 'End Measuring' : t('gis.measureTool')}</span>
        </button>

        {measuredDistance && (
          <div className="px-3 py-1 bg-sky-950/80 border border-sky-500/40 rounded-xl text-sky-300 text-xs font-mono font-bold">
            Distance: {measuredDistance}
          </div>
        )}
      </div>
    </div>
  );
};
export default InteractiveMap;
