export type TrafficLight = 'green' | 'yellow' | 'red';

export type GISApplicationStatus =
  | 'pending_gis_review'
  | 'gis_verified'
  | 'gis_adjusted'
  | 'gis_flagged_field_survey'
  | 'gis_rejected';

export type PriorityLevel = 'urgent' | 'high' | 'normal' | 'medium' | 'low';

export type LatLngCoord = [number, number];

export interface BoundaryComparisonItem {
  parameter: string;
  documentBoundary: string;
  documentValue: string;
  governmentBoundary: string;
  govtValue: string;
  difference?: string;
  variance?: string;
  status: 'match' | 'partial' | 'mismatch';
}

export interface AdjoiningParcel {
  id: string;
  surveyNumber: string;
  ownerName: string;
  extentAcres: number;
  overlapPercentage: number;
  direction?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  hasConflict: boolean;
}

export type ActionStatus =
  | 'CONFIRMED'
  | 'ADJUSTED'
  | 'FIELD_SURVEY_REQUIRED'
  | 'REJECTED';

export interface GISApplication {
  id: string;
  applicationNo: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  surveyNumber: string;
  subdivisionNumber?: string;
  documentType: string;
  village: string;
  taluk: string;
  mandal: string;
  district: string;
  state: string;
  ulpin: string;
  status: GISApplicationStatus;
  priority: PriorityLevel;
  trafficLight: TrafficLight;
  overlapPercentage: number;
  documentArea: number;
  documentAreaAcres: number;
  governmentArea: number;
  govtCadastralAreaAcres: number;
  overlapArea: number;
  overlapAreaAcres: number;
  extentAcres: number;
  extentGuntas?: number;
  areaUnit: string;
  documentBoundary: LatLngCoord[];
  documentBoundaryCoordinates: LatLngCoord[];
  governmentBoundary: LatLngCoord[];
  govtBoundaryCoordinates: LatLngCoord[];
  adjustedBoundary?: LatLngCoord[];
  boundaryComparisons: BoundaryComparisonItem[];
  boundaryComparison: BoundaryComparisonItem[];
  adjoiningParcels: AdjoiningParcel[];
  remarks?: string;
  rejectionReason?: string;
  decisionDate?: string;
  decisionBy?: string;
  createdAt: string;
  actionStatus?: ActionStatus;
  actionCompletedAt?: string;
  actionCompletedBy?: string;
  actionReason?: string;
  actionRemarks?: string;
  previousOverlapPercentage?: number;
  previousTrafficLight?: TrafficLight;
  previousPriority?: PriorityLevel;
  previousDocumentBoundary?: LatLngCoord[];
}

export interface GISHistoryRecord {
  id: string;
  applicationId: string;
  applicationNo: string;
  citizenName: string;
  surveyNumber: string;
  village: string;
  action: 'CONFIRMED' | 'ADJUSTED' | 'FLAGGED_FIELD_SURVEY' | 'REJECTED' | 'confirm' | 'adjust' | 'flag_field_survey' | 'reject';
  trafficLight: TrafficLight;
  overlapPercentage: number;
  previousOverlapPercentage?: number;
  previousBoundary?: LatLngCoord[];
  updatedBoundary?: LatLngCoord[];
  reason?: string;
  remarks: string;
  timestamp: string;
  officerName: string;
  performedBy: string;
}

export interface GISStatsResponse {
  pendingReview: number;
  pending: number;
  overlapsDetected: number;
  resolvedToday: number;
  totalVerified: number;
  totalAreaAcres: number;
}

export interface GISUser {
  id: string;
  name: string;
  role: 'gis';
  email: string;
  phone: string;
  designation: string;
  licenseNumber: string;
  department: string;
  office: string;
  officeAddress?: string;
  jurisdiction: string;
  district?: string;
  assignedMandals?: string[];
  surveyArea?: string;
  token?: string;
}
