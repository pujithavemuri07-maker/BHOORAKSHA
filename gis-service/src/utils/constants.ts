export interface GISClassification {
  trafficLight: 'green' | 'yellow' | 'red';
  priority: 'urgent' | 'high' | 'normal';
  label: string;
  meaning: string;
  textColor: string;
  badgeClass: string;
  priorityBadgeClass: string;
  hex: string;
  range: string;
  action: string;
}

export function getGISClassification(overlapPercentage: number): GISClassification {
  if (overlapPercentage < 50) {
    return {
      trafficLight: 'red',
      priority: 'urgent',
      label: 'Red (<50% Overlap)',
      meaning: 'Significant spatial mismatch — immediate GIS review required.',
      textColor: 'text-rose-400',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      priorityBadgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      hex: '#ef4444',
      range: '< 50% Spatial Match',
      action: 'Mandatory field survey requisition or statutory rejection',
    };
  }
  if (overlapPercentage <= 75) {
    return {
      trafficLight: 'yellow',
      priority: 'high',
      label: 'Yellow (50-75% Overlap)',
      meaning: 'Moderate spatial mismatch — detailed GIS review required.',
      textColor: 'text-amber-400',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      priorityBadgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      hex: '#f59e0b',
      range: '50% – 75% Spatial Match',
      action: 'Detailed GIS boundary adjustment and vertex snapping',
    };
  }
  return {
    trafficLight: 'green',
    priority: 'normal',
    label: 'Green (>75% Overlap)',
    meaning: 'Higher spatial match — routine GIS review.',
    textColor: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    priorityBadgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    hex: '#10b981',
    range: '> 75% Spatial Match',
    action: 'Routine review and cadastral boundary confirmation',
  };
}

export const TRAFFIC_LIGHT_SYSTEM = {
  green: {
    label: 'Green (>75% Overlap)',
    description: 'Higher spatial match — routine GIS review.',
    range: '> 75% Match',
    action: 'Routine review and boundary confirmation',
    color: 'emerald',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    hex: '#10b981',
  },
  yellow: {
    label: 'Yellow (50-75% Overlap)',
    description: 'Moderate spatial mismatch — detailed GIS review required.',
    range: '50% – 75% Match',
    action: 'Detailed GIS boundary adjustment and vertex snapping',
    color: 'amber',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    hex: '#f59e0b',
  },
  red: {
    label: 'Red (<50% Overlap)',
    description: 'Significant spatial mismatch — immediate GIS review required.',
    range: '< 50% Match',
    action: 'Mandatory field survey requisition or statutory rejection',
    color: 'red',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
    hex: '#ef4444',
  },
};

export const REJECT_REASONS = [
  { value: 'survey_mismatch', label: 'Survey Number Mismatch with Cadastral Record' },
  { value: 'boundary_different', label: 'Boundary Differs Significantly from Cadastral Map' },
  { value: 'parcel_not_found', label: 'Parcel Not Found in Digital Cadastral Database' },
  { value: 'area_mismatch', label: 'Deed Area Differs Significantly from Physical Pahani Extent' },
  { value: 'encroachment_detected', label: 'Encroachment upon Government / Waterbody Buffer' },
  { value: 'other', label: 'Other Statutory Geospatial Irregularity' },
];

export const STATUS_CONFIG = {
  pending_gis_review: {
    label: 'Pending GIS Review',
    color: 'amber',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  gis_verified: {
    label: 'GIS Verified (No Issues)',
    color: 'emerald',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  gis_adjusted: {
    label: 'GIS Adjusted (Minor Correction)',
    color: 'cyan',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  },
  gis_flagged_field_survey: {
    label: 'Flagged for Field Survey',
    color: 'purple',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
  gis_rejected: {
    label: 'Boundary Rejected',
    color: 'red',
    badge: 'bg-red-500/10 text-red-300 border-red-500/30',
  },
};

