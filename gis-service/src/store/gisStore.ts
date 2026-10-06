import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GISApplication,
  GISHistoryRecord,
  GISStatsResponse,
  LatLngCoord,
} from '../api/types';
import { getGISClassification } from '../utils/constants';
import { calculateApproxAreaAcres } from '../utils/geojsonUtils';

interface GISState {
  applications: GISApplication[];
  history: GISHistoryRecord[];
  selectedApplicationIds: string[];
  toggleSelectApplication: (id: string) => void;
  selectAllApplications: (ids: string[]) => void;
  clearSelection: () => void;
  confirmBoundary: (id: string, remarks?: string) => void;
  adjustBoundary: (id: string, adjustedBoundary: LatLngCoord[], remarks?: string) => void;
  flagFieldSurvey: (id: string, remarks: string) => void;
  rejectBoundary: (id: string, reason: string, remarks: string) => void;
  batchConfirm: (ids: string[], remarks?: string) => void;
  batchFlag: (ids: string[], remarks: string) => void;
  batchFlagFieldSurvey: (ids: string[], remarks: string) => void;
  batchReject: (ids: string[], reason: string, remarks: string) => void;
  getStats: () => GISStatsResponse;
}

const RAW_APPLICATIONS = [
  {
    id: 'REQ-2026-000123',
    applicationNo: 'REQ-2026-000123',
    citizenName: 'Ramesh Kumar Patel',
    citizenPhone: '+91 98765 43210',
    citizenEmail: 'ramesh.patel@example.gov.in',
    surveyNumber: '123/456',
    subdivisionNumber: '1A',
    documentType: 'Registered Sale Deed',
    village: 'Gachibowli',
    taluk: 'Serilingampally',
    mandal: 'Serilingampally',
    district: 'Ranga Reddy',
    state: 'Telangana',
    ulpin: 'ULPIN-36-RR-SER-123-01',
    status: 'pending_gis_review' as const,
    priority: 'normal' as const,
    trafficLight: 'green' as const,
    overlapPercentage: 95.2,
    documentArea: 2.5,
    documentAreaAcres: 2.5,
    governmentArea: 2.45,
    govtCadastralAreaAcres: 2.45,
    overlapArea: 2.38,
    overlapAreaAcres: 2.38,
    extentAcres: 2.5,
    extentGuntas: 100,
    areaUnit: 'Acres',
    createdAt: '2026-09-06T10:15:00Z',
    documentBoundary: [
      [17.441, 78.348] as LatLngCoord,
      [17.4435, 78.3482] as LatLngCoord,
      [17.4432, 78.3515] as LatLngCoord,
      [17.4408, 78.3512] as LatLngCoord,
    ],
    governmentBoundary: [
      [17.4411, 78.3481] as LatLngCoord,
      [17.4434, 78.3483] as LatLngCoord,
      [17.4431, 78.3514] as LatLngCoord,
      [17.4409, 78.3511] as LatLngCoord,
    ],
    boundaryComparisons: [
      {
        parameter: 'Total Area Extent',
        documentBoundary: '2.50 Acres',
        documentValue: '2.50 Acres',
        governmentBoundary: '2.45 Acres',
        govtValue: '2.45 Acres',
        status: 'partial' as const,
        difference: '2.0% difference (within 3% permissible survey tolerance)',
        variance: '2.0% variance',
      },
      {
        parameter: 'North Boundary',
        documentBoundary: 'Panchayat Cart Track (Sy 122)',
        documentValue: 'Panchayat Cart Track (Sy 122)',
        governmentBoundary: 'Panchayat Cart Track (Sy 122)',
        govtValue: 'Panchayat Cart Track (Sy 122)',
        status: 'match' as const,
        variance: 'Exact match',
      },
      {
        parameter: 'South Boundary',
        documentBoundary: 'Canal Reserve (Sy 124)',
        documentValue: 'Canal Reserve (Sy 124)',
        governmentBoundary: 'Canal Reserve (Sy 124)',
        govtValue: 'Canal Reserve (Sy 124)',
        status: 'match' as const,
        variance: 'Exact match',
      },
      {
        parameter: 'East Boundary',
        documentBoundary: 'Irrigation Nala Buffer',
        documentValue: 'Irrigation Nala Buffer',
        governmentBoundary: 'Irrigation Nala Buffer',
        govtValue: 'Irrigation Nala Buffer',
        status: 'match' as const,
        variance: 'Exact match',
      },
      {
        parameter: 'West Boundary',
        documentBoundary: 'Sy 121 Agricultural Farm',
        documentValue: 'Sy 121 Agricultural Farm',
        governmentBoundary: 'Sy 121 Agricultural Farm',
        govtValue: 'Sy 121 Agricultural Farm',
        status: 'match' as const,
        variance: 'Exact match',
      },
    ],
    adjoiningParcels: [
      {
        id: 'adj-1',
        surveyNumber: '123/457',
        ownerName: 'Suresh V. Rao',
        extentAcres: 2.1,
        overlapPercentage: 0.5,
        direction: 'East' as const,
        hasConflict: false,
      },
      {
        id: 'adj-2',
        surveyNumber: '123/458',
        ownerName: 'Priya K. Reddy',
        extentAcres: 1.8,
        overlapPercentage: 0.0,
        direction: 'North' as const,
        hasConflict: false,
      },
      {
        id: 'adj-3',
        surveyNumber: '123/459',
        ownerName: 'Rameshwar Sharma',
        extentAcres: 3.4,
        overlapPercentage: 2.3,
        direction: 'West' as const,
        hasConflict: true,
      },
    ],
  },
  {
    id: 'GIS-2026-702',
    applicationNo: 'GIS-2026-702',
    citizenName: 'B. Venkatswamy Goud',
    citizenPhone: '+91 99890 22341',
    citizenEmail: 'venkatswamy.goud@example.gov.in',
    surveyNumber: '210/B',
    subdivisionNumber: '2',
    documentType: 'Partition Deed (Bhaaga Parishkaram)',
    village: 'Muthangi',
    taluk: 'Patancheru',
    mandal: 'Patancheru',
    district: 'Sangareddy',
    state: 'Telangana',
    ulpin: 'ULPIN-36-SR-PAT-210-02',
    status: 'pending_gis_review' as const,
    priority: 'normal' as const,
    trafficLight: 'green' as const,
    overlapPercentage: 78.4,
    documentArea: 3.2,
    documentAreaAcres: 3.2,
    governmentArea: 2.95,
    govtCadastralAreaAcres: 2.95,
    overlapArea: 2.51,
    overlapAreaAcres: 2.51,
    extentAcres: 3.2,
    extentGuntas: 128,
    areaUnit: 'Acres',
    createdAt: '2026-09-07T08:30:00Z',
    documentBoundary: [
      [17.521, 78.225] as LatLngCoord,
      [17.525, 78.226] as LatLngCoord,
      [17.524, 78.231] as LatLngCoord,
      [17.519, 78.229] as LatLngCoord,
    ],
    governmentBoundary: [
      [17.5215, 78.2255] as LatLngCoord,
      [17.5245, 78.2262] as LatLngCoord,
      [17.5235, 78.2295] as LatLngCoord,
      [17.5195, 78.2285] as LatLngCoord,
    ],
    boundaryComparisons: [
      {
        parameter: 'Total Area Extent',
        documentBoundary: '3.20 Acres',
        documentValue: '3.20 Acres',
        governmentBoundary: '2.95 Acres',
        govtValue: '2.95 Acres',
        status: 'mismatch' as const,
        difference: '7.8% difference exceeds statutory allowable limits',
        variance: '7.8% mismatch',
      },
      {
        parameter: 'North Boundary',
        documentBoundary: 'NH-65 Highway Buffer Zone',
        documentValue: 'NH-65 Highway Buffer Zone',
        governmentBoundary: 'NH-65 Service Road',
        govtValue: 'NH-65 Service Road',
        status: 'partial' as const,
        difference: '10-meter road widening encroachment buffer',
        variance: '10m buffer shift',
      },
      {
        parameter: 'South Boundary',
        documentBoundary: 'Sy 211 Wet Lands',
        documentValue: 'Sy 211 Wet Lands',
        governmentBoundary: 'Sy 211 Wet Lands',
        govtValue: 'Sy 211 Wet Lands',
        status: 'match' as const,
        variance: 'Aligned',
      },
      {
        parameter: 'East Boundary',
        documentBoundary: 'Mandal Revenue Road',
        documentValue: 'Mandal Revenue Road',
        governmentBoundary: 'Mandal Revenue Road',
        govtValue: 'Mandal Revenue Road',
        status: 'match' as const,
        variance: 'Aligned',
      },
      {
        parameter: 'West Boundary',
        documentBoundary: 'Sy 209 Industrial Plot',
        documentValue: 'Sy 209 Industrial Plot',
        governmentBoundary: 'Sy 209/A Government Poramboke',
        govtValue: 'Sy 209/A Government Poramboke',
        status: 'mismatch' as const,
        difference: 'Document claims private land, cadastral shows Govt Poramboke',
        variance: 'Disputed boundary',
      },
    ],
    adjoiningParcels: [
      {
        id: 'adj-4',
        surveyNumber: '210/A',
        ownerName: 'M. Prabhakar Rao',
        extentAcres: 2.8,
        overlapPercentage: 11.2,
        direction: 'North-West' as const,
        hasConflict: true,
      },
      {
        id: 'adj-5',
        surveyNumber: '211',
        ownerName: 'Revenue Department (Gram Kantham)',
        extentAcres: 4.5,
        overlapPercentage: 8.5,
        direction: 'South' as const,
        hasConflict: true,
      },
    ],
  },
  {
    id: 'GIS-2026-703',
    applicationNo: 'GIS-2026-703',
    citizenName: 'K. Sunitha Devi & Anr.',
    citizenPhone: '+91 97011 55623',
    citizenEmail: 'sunitha.k@example.gov.in',
    surveyNumber: '88/1',
    subdivisionNumber: '1',
    documentType: 'Gift Settlement Deed',
    village: 'Shamshabad',
    taluk: 'Shamshabad',
    mandal: 'Shamshabad',
    district: 'Ranga Reddy',
    state: 'Telangana',
    ulpin: 'ULPIN-36-RR-SHA-088-03',
    status: 'pending_gis_review' as const,
    priority: 'urgent' as const,
    trafficLight: 'red' as const,
    overlapPercentage: 48.6,
    documentArea: 5.0,
    documentAreaAcres: 5.0,
    governmentArea: 3.8,
    govtCadastralAreaAcres: 3.8,
    overlapArea: 2.43,
    overlapAreaAcres: 2.43,
    extentAcres: 5.0,
    extentGuntas: 200,
    areaUnit: 'Acres',
    createdAt: '2026-09-07T14:10:00Z',
    documentBoundary: [
      [17.258, 78.412] as LatLngCoord,
      [17.264, 78.415] as LatLngCoord,
      [17.262, 78.421] as LatLngCoord,
      [17.255, 78.418] as LatLngCoord,
    ],
    governmentBoundary: [
      [17.259, 78.413] as LatLngCoord,
      [17.262, 78.414] as LatLngCoord,
      [17.261, 78.418] as LatLngCoord,
      [17.257, 78.416] as LatLngCoord,
    ],
    boundaryComparisons: [
      {
        parameter: 'Total Area Extent',
        documentBoundary: '5.00 Acres',
        documentValue: '5.00 Acres',
        governmentBoundary: '3.80 Acres',
        govtValue: '3.80 Acres',
        status: 'mismatch' as const,
        difference: 'Severe area deviation: Claimed extent is 31.5% larger than village cadastral record',
        variance: '31.5% discrepancy',
      },
      {
        parameter: 'North Boundary',
        documentBoundary: 'Airport Approach Road Buffer',
        documentValue: 'Airport Approach Road Buffer',
        governmentBoundary: 'Airport Authority Restricted Zone',
        govtValue: 'Airport Authority Restricted Zone',
        status: 'mismatch' as const,
        difference: 'Encroachment into RGIA Statutory Security Buffer',
        variance: 'Security buffer violation',
      },
      {
        parameter: 'South Boundary',
        documentBoundary: 'Sy 89 Agricultural Land',
        documentValue: 'Sy 89 Agricultural Land',
        governmentBoundary: 'Sy 89 Agricultural Land',
        govtValue: 'Sy 89 Agricultural Land',
        status: 'match' as const,
        variance: 'Aligned',
      },
      {
        parameter: 'East Boundary',
        documentBoundary: 'Forest Department Demarcation',
        documentValue: 'Forest Department Demarcation',
        governmentBoundary: 'Reserve Forest Boundary Pillar #14',
        govtValue: 'Reserve Forest Boundary Pillar #14',
        status: 'mismatch' as const,
        difference: 'Overlaps 1.2 Acres of Shamshabad Reserve Forest compartment',
        variance: '1.2 Ac Forest encroachment',
      },
    ],
    adjoiningParcels: [
      {
        id: 'adj-6',
        surveyNumber: '87 (RF)',
        ownerName: 'Telangana Forest Department',
        extentAcres: 120.0,
        overlapPercentage: 24.5,
        direction: 'East' as const,
        hasConflict: true,
      },
      {
        id: 'adj-7',
        surveyNumber: '88/2',
        ownerName: 'G. Mohan Krishna',
        extentAcres: 3.5,
        overlapPercentage: 18.2,
        direction: 'West' as const,
        hasConflict: true,
      },
    ],
  },
  {
    id: 'GIS-2026-704',
    applicationNo: 'GIS-2026-704',
    citizenName: 'Mohd. Abdul Qadeer',
    citizenPhone: '+91 94412 88790',
    citizenEmail: 'qadeer.abdul@example.gov.in',
    surveyNumber: '45/3',
    subdivisionNumber: '3',
    documentType: 'Sale Deed (Kraya Patram)',
    village: 'Nagaram',
    taluk: 'Keesara',
    mandal: 'Keesara',
    district: 'Medchal-Malkajgiri',
    state: 'Telangana',
    ulpin: 'ULPIN-36-MM-KEE-045-04',
    status: 'pending_gis_review' as const,
    priority: 'normal' as const,
    trafficLight: 'green' as const,
    overlapPercentage: 98.1,
    documentArea: 1.75,
    documentAreaAcres: 1.75,
    governmentArea: 1.74,
    govtCadastralAreaAcres: 1.74,
    overlapArea: 1.72,
    overlapAreaAcres: 1.72,
    extentAcres: 1.75,
    extentGuntas: 70,
    areaUnit: 'Acres',
    createdAt: '2026-09-07T16:45:00Z',
    documentBoundary: [
      [17.485, 78.585] as LatLngCoord,
      [17.488, 78.586] as LatLngCoord,
      [17.487, 78.589] as LatLngCoord,
      [17.484, 78.588] as LatLngCoord,
    ],
    governmentBoundary: [
      [17.4851, 78.5851] as LatLngCoord,
      [17.4879, 78.586] as LatLngCoord,
      [17.4869, 78.5889] as LatLngCoord,
      [17.4841, 78.5879] as LatLngCoord,
    ],
    boundaryComparisons: [
      {
        parameter: 'Total Area Extent',
        documentBoundary: '1.75 Acres',
        documentValue: '1.75 Acres',
        governmentBoundary: '1.74 Acres',
        govtValue: '1.74 Acres',
        status: 'match' as const,
        difference: 'Variance < 0.6%, perfectly within standard GPS drift limit',
        variance: '< 0.6% deviation',
      },
      {
        parameter: 'North Boundary',
        documentBoundary: 'Panchayat Tar Road',
        documentValue: 'Panchayat Tar Road',
        governmentBoundary: 'Panchayat Tar Road',
        govtValue: 'Panchayat Tar Road',
        status: 'match' as const,
        variance: 'Aligned',
      },
      {
        parameter: 'South Boundary',
        documentBoundary: 'Sy 46 Farm Land',
        documentValue: 'Sy 46 Farm Land',
        governmentBoundary: 'Sy 46 Farm Land',
        govtValue: 'Sy 46 Farm Land',
        status: 'match' as const,
        variance: 'Aligned',
      },
    ],
    adjoiningParcels: [
      {
        id: 'adj-8',
        surveyNumber: '45/2',
        ownerName: 'V. Chandraiah',
        extentAcres: 1.5,
        overlapPercentage: 0.2,
        direction: 'West' as const,
        hasConflict: false,
      },
    ],
  },
  {
    id: 'GIS-2026-705',
    applicationNo: 'GIS-2026-705',
    citizenName: 'T. Anand Rao & Smt. Vani',
    citizenPhone: '+91 98660 11234',
    citizenEmail: 'anand.rao@example.gov.in',
    surveyNumber: '312/A',
    subdivisionNumber: 'A',
    documentType: 'Development Agreement cum GPA',
    village: 'Puppalguda',
    taluk: 'Gandipet',
    mandal: 'Gandipet',
    district: 'Ranga Reddy',
    state: 'Telangana',
    ulpin: 'ULPIN-36-RR-GAN-312-05',
    status: 'pending_gis_review' as const,
    priority: 'normal' as const,
    trafficLight: 'green' as const,
    overlapPercentage: 86.5,
    documentArea: 4.1,
    documentAreaAcres: 4.1,
    governmentArea: 3.9,
    govtCadastralAreaAcres: 3.9,
    overlapArea: 3.55,
    overlapAreaAcres: 3.55,
    extentAcres: 4.1,
    extentGuntas: 164,
    areaUnit: 'Acres',
    createdAt: '2026-09-08T06:00:00Z',
    documentBoundary: [
      [17.398, 78.365] as LatLngCoord,
      [17.403, 78.367] as LatLngCoord,
      [17.401, 78.372] as LatLngCoord,
      [17.396, 78.369] as LatLngCoord,
    ],
    governmentBoundary: [
      [17.3985, 78.3655] as LatLngCoord,
      [17.4025, 78.3672] as LatLngCoord,
      [17.4005, 78.3712] as LatLngCoord,
      [17.3965, 78.3688] as LatLngCoord,
    ],
    boundaryComparisons: [
      {
        parameter: 'Total Area Extent',
        documentBoundary: '4.10 Acres',
        documentValue: '4.10 Acres',
        governmentBoundary: '3.90 Acres',
        govtValue: '3.90 Acres',
        status: 'partial' as const,
        difference: '5.1% variance. Slight buffer difference along eastern lake boundary',
        variance: '5.1% variance',
      },
      {
        parameter: 'East Boundary',
        documentBoundary: 'Puppalguda Cheruvu FTL Buffer',
        documentValue: 'Puppalguda Cheruvu FTL Buffer',
        governmentBoundary: 'Irrigation Dept Full Tank Level (FTL) Buffer 30m',
        govtValue: 'Irrigation Dept Full Tank Level (FTL) Buffer 30m',
        status: 'partial' as const,
        difference: 'Claim boundary enters 4.5m inside statutory 30m lake buffer line',
        variance: '4.5m FTL intersection',
      },
    ],
    adjoiningParcels: [
      {
        id: 'adj-9',
        surveyNumber: '313',
        ownerName: 'Telangana Irrigation Dept (Lake Water Body)',
        extentAcres: 28.0,
        overlapPercentage: 5.2,
        direction: 'East' as const,
        hasConflict: true,
      },
    ],
  },
];

const INITIAL_APPLICATIONS: GISApplication[] = RAW_APPLICATIONS.map((app) => {
  const classification = getGISClassification(app.overlapPercentage);
  return {
    ...app,
    trafficLight: classification.trafficLight,
    priority: classification.priority,
    documentBoundaryCoordinates: app.documentBoundary,
    govtBoundaryCoordinates: app.governmentBoundary,
    boundaryComparison: app.boundaryComparisons,
  };
});

const INITIAL_HISTORY: GISHistoryRecord[] = [
  {
    id: 'HIST-GIS-001',
    applicationId: 'GIS-2026-688',
    applicationNo: 'GIS-2026-688',
    citizenName: 'C. Venkateswara Rao',
    surveyNumber: '54/1',
    village: 'Kokapet',
    action: 'CONFIRMED',
    trafficLight: 'green',
    overlapPercentage: 97.4,
    remarks: 'Cadastral boundary verified against BhooNaksha digital sheet. 0.3m tolerance within limits.',
    timestamp: '2026-09-08T07:15:00Z',
    officerName: 'S. Ramakrishna',
    performedBy: 'SURV/TEL/2014/8821',
  },
  {
    id: 'HIST-GIS-002',
    applicationId: 'GIS-2026-689',
    applicationNo: 'GIS-2026-689',
    citizenName: 'M. Sriman Narayana',
    surveyNumber: '112/3',
    village: 'Kondapur',
    action: 'ADJUSTED',
    trafficLight: 'yellow',
    overlapPercentage: 88.2,
    remarks: 'Eastern coordinate snapped to official village road cadastral vector line.',
    timestamp: '2026-09-08T07:45:00Z',
    officerName: 'S. Ramakrishna',
    performedBy: 'SURV/TEL/2014/8821',
  },
  {
    id: 'HIST-GIS-003',
    applicationId: 'GIS-2026-690',
    applicationNo: 'GIS-2026-690',
    citizenName: 'K. Balaji Prasad',
    surveyNumber: '78/A',
    village: 'Narsingi',
    action: 'FLAGGED_FIELD_SURVEY',
    trafficLight: 'yellow',
    overlapPercentage: 81.0,
    remarks: 'Sent requisition to Gandipet Mandal Surveyor for DGPS rover baseline survey.',
    timestamp: '2026-09-08T08:10:00Z',
    officerName: 'S. Ramakrishna',
    performedBy: 'SURV/TEL/2014/8821',
  },
  {
    id: 'HIST-GIS-004',
    applicationId: 'GIS-2026-691',
    applicationNo: 'GIS-2026-691',
    citizenName: 'R. Janardhan Goud',
    surveyNumber: '201/1',
    village: 'Miyapur',
    action: 'REJECTED',
    trafficLight: 'red',
    overlapPercentage: 38.5,
    reason: 'Encroachment into Irrigation Nala and adjoining Sy 200.',
    remarks: 'Discrepancy exceeds 15%. Overlaps government drainage nala. Rejected under Section 24.',
    timestamp: '2026-09-08T08:35:00Z',
    officerName: 'S. Ramakrishna',
    performedBy: 'SURV/TEL/2014/8821',
  },
];

export const useGISStore = create<GISState>()(
  persist(
    (set, get) => ({
      applications: INITIAL_APPLICATIONS,
      history: INITIAL_HISTORY,
      selectedApplicationIds: [],

      toggleSelectApplication: (id) =>
        set((state) => {
          const exists = state.selectedApplicationIds.includes(id);
          return {
            selectedApplicationIds: exists
              ? state.selectedApplicationIds.filter((item) => item !== id)
              : [...state.selectedApplicationIds, id],
          };
        }),

      selectAllApplications: (ids) =>
        set(() => ({
          selectedApplicationIds: ids,
        })),

      clearSelection: () =>
        set(() => ({
          selectedApplicationIds: [],
        })),

      confirmBoundary: (id, remarks) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const newHistoryItem: GISHistoryRecord = {
            id: `HIST-GIS-${Date.now()}`,
            applicationId: app.id,
            applicationNo: app.applicationNo,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            village: app.village,
            action: 'CONFIRMED',
            trafficLight: app.trafficLight,
            overlapPercentage: app.overlapPercentage,
            remarks: remarks || 'Cadastral boundary confirmed against official GIS records.',
            timestamp: new Date().toISOString(),
            officerName: 'S. Ramakrishna',
            performedBy: 'SURV/TEL/2014/8821',
          };

          const updatedApps = state.applications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'gis_verified' as const,
                  actionStatus: 'CONFIRMED' as const,
                  actionCompletedAt: new Date().toISOString(),
                  actionCompletedBy: 'S. Ramakrishna',
                  actionRemarks: remarks || 'Cadastral boundary confirmed against official GIS records.',
                  remarks: remarks || 'Cadastral boundary confirmed against official GIS records.',
                  decisionDate: new Date().toISOString(),
                  decisionBy: 'S. Ramakrishna',
                }
              : a
          );

          return {
            applications: updatedApps,
            history: [newHistoryItem, ...state.history],
          };
        }),

      adjustBoundary: (id, adjustedBoundary, remarks) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          // Check if snapped to government boundary
          const isSnappedToGovt =
            app.governmentBoundary.length === adjustedBoundary.length &&
            adjustedBoundary.every((coord, idx) => {
              const govtCoord = app.governmentBoundary[idx];
              return (
                Math.abs(coord[0] - govtCoord[0]) < 0.0001 &&
                Math.abs(coord[1] - govtCoord[1]) < 0.0001
              );
            });

          // Calculate new document area
          const approxArea = calculateApproxAreaAcres(adjustedBoundary);
          const newDocArea =
            approxArea > 0
              ? approxArea
              : isSnappedToGovt
              ? app.govtCadastralAreaAcres
              : app.documentAreaAcres;

          // Calculate new overlap percentage
          const newOverlapPercentage = isSnappedToGovt
            ? 100.0
            : Math.min(
                99.5,
                Number((app.overlapPercentage + (100 - app.overlapPercentage) * 0.75).toFixed(1))
              );

          const classification = getGISClassification(newOverlapPercentage);
          const newOverlapAreaAcres = Number(
            ((app.govtCadastralAreaAcres * newOverlapPercentage) / 100).toFixed(2)
          );

          // Updated boundary comparisons reflecting adjustment
          const updatedComparisons = (app.boundaryComparison || app.boundaryComparisons || []).map(
            (comp) => {
              if (comp.parameter === 'Total Area Extent') {
                return {
                  ...comp,
                  documentBoundary: `${newDocArea.toFixed(2)} Acres`,
                  documentValue: `${newDocArea.toFixed(2)} Acres`,
                  status: (Math.abs(newDocArea - app.govtCadastralAreaAcres) <= 0.05
                    ? 'match'
                    : 'partial') as 'match' | 'partial' | 'mismatch',
                  difference:
                    Math.abs(newDocArea - app.govtCadastralAreaAcres) <= 0.05
                      ? 'Exact match after GIS vertex adjustment (within permissible survey tolerance)'
                      : 'Variance minimized after boundary adjustment',
                  variance: 'Adjusted alignment',
                };
              }
              if (comp.status === 'mismatch' || comp.status === 'partial') {
                return {
                  ...comp,
                  status: 'match' as const,
                  difference: 'Coordinate vertices adjusted to official cadastral vector',
                  variance: 'Resolved after adjustment',
                };
              }
              return comp;
            }
          );

          // Updated adjoining parcels reflecting adjustment
          const updatedAdjoiningParcels = (app.adjoiningParcels || []).map((adj) => ({
            ...adj,
            hasConflict: false,
            overlapPercentage: 0.0,
          }));

          const newHistoryItem: GISHistoryRecord = {
            id: `HIST-GIS-${Date.now()}`,
            applicationId: app.id,
            applicationNo: app.applicationNo,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            village: app.village,
            action: 'ADJUSTED',
            trafficLight: classification.trafficLight,
            overlapPercentage: newOverlapPercentage,
            previousOverlapPercentage: app.overlapPercentage,
            previousBoundary: app.documentBoundary,
            updatedBoundary: adjustedBoundary,
            remarks: remarks || 'Boundary coordinates adjusted and snapped to official cadastral parcels.',
            timestamp: new Date().toISOString(),
            officerName: 'S. Ramakrishna',
            performedBy: 'SURV/TEL/2014/8821',
          };

          const updatedApps = state.applications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'gis_adjusted' as const,
                  actionStatus: 'ADJUSTED' as const,
                  priority: classification.priority,
                  trafficLight: classification.trafficLight,
                  previousOverlapPercentage: app.overlapPercentage,
                  previousTrafficLight: app.trafficLight,
                  previousPriority: app.priority,
                  previousDocumentBoundary: app.documentBoundary,
                  adjustedBoundary,
                  documentBoundary: adjustedBoundary,
                  documentBoundaryCoordinates: adjustedBoundary,
                  documentArea: newDocArea,
                  documentAreaAcres: newDocArea,
                  extentAcres: newDocArea,
                  overlapPercentage: newOverlapPercentage,
                  overlapArea: newOverlapAreaAcres,
                  overlapAreaAcres: newOverlapAreaAcres,
                  boundaryComparisons: updatedComparisons,
                  boundaryComparison: updatedComparisons,
                  adjoiningParcels: updatedAdjoiningParcels,
                  remarks: remarks || 'Boundary coordinates adjusted and snapped to official cadastral parcels.',
                  actionRemarks: remarks,
                  decisionDate: new Date().toISOString(),
                  decisionBy: 'S. Ramakrishna',
                }
              : a
          );

          return {
            applications: updatedApps,
            history: [newHistoryItem, ...state.history],
          };
        }),

      flagFieldSurvey: (id, remarks) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const newHistoryItem: GISHistoryRecord = {
            id: `HIST-GIS-${Date.now()}`,
            applicationId: app.id,
            applicationNo: app.applicationNo,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            village: app.village,
            action: 'FLAGGED_FIELD_SURVEY',
            trafficLight: app.trafficLight,
            overlapPercentage: app.overlapPercentage,
            remarks: remarks || 'Flagged for Mandal Field Survey & DGPS ground truthing.',
            timestamp: new Date().toISOString(),
            officerName: 'S. Ramakrishna',
            performedBy: 'SURV/TEL/2014/8821',
          };

          const updatedApps = state.applications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'gis_flagged_field_survey' as const,
                  actionStatus: 'FIELD_SURVEY_REQUIRED' as const,
                  actionCompletedAt: new Date().toISOString(),
                  actionCompletedBy: 'S. Ramakrishna',
                  actionRemarks: remarks || 'Flagged for Mandal Field Survey & DGPS ground truthing.',
                  remarks,
                  decisionDate: new Date().toISOString(),
                  decisionBy: 'S. Ramakrishna',
                }
              : a
          );

          return {
            applications: updatedApps,
            history: [newHistoryItem, ...state.history],
          };
        }),

      rejectBoundary: (id, reason, remarks) =>
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;

          const newHistoryItem: GISHistoryRecord = {
            id: `HIST-GIS-${Date.now()}`,
            applicationId: app.id,
            applicationNo: app.applicationNo,
            citizenName: app.citizenName,
            surveyNumber: app.surveyNumber,
            village: app.village,
            action: 'REJECTED',
            trafficLight: app.trafficLight,
            overlapPercentage: app.overlapPercentage,
            reason,
            remarks: remarks || `Rejected: ${reason}`,
            timestamp: new Date().toISOString(),
            officerName: 'S. Ramakrishna',
            performedBy: 'SURV/TEL/2014/8821',
          };

          const updatedApps = state.applications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'gis_rejected' as const,
                  actionStatus: 'REJECTED' as const,
                  actionCompletedAt: new Date().toISOString(),
                  actionCompletedBy: 'S. Ramakrishna',
                  actionReason: reason,
                  actionRemarks: remarks || `Rejected: ${reason}`,
                  rejectionReason: reason,
                  remarks,
                  decisionDate: new Date().toISOString(),
                  decisionBy: 'S. Ramakrishna',
                }
              : a
          );

          return {
            applications: updatedApps,
            history: [newHistoryItem, ...state.history],
          };
        }),

      batchConfirm: (ids, remarks) =>
        set((state) => {
          const newHistoryItems: GISHistoryRecord[] = [];
          const updatedApplications = state.applications.map((app) => {
            if (ids.includes(app.id)) {
              newHistoryItems.push({
                id: `HIST-GIS-${Date.now()}-${app.id}`,
                applicationId: app.id,
                applicationNo: app.applicationNo,
                citizenName: app.citizenName,
                surveyNumber: app.surveyNumber,
                village: app.village,
                action: 'CONFIRMED',
                trafficLight: app.trafficLight,
                overlapPercentage: app.overlapPercentage,
                remarks: remarks || 'Batch confirmed by GIS Officer.',
                timestamp: new Date().toISOString(),
                officerName: 'S. Ramakrishna',
                performedBy: 'SURV/TEL/2014/8821',
              });
              return {
                ...app,
                status: 'gis_verified' as const,
                actionStatus: 'CONFIRMED' as const,
                actionCompletedAt: new Date().toISOString(),
                actionCompletedBy: 'S. Ramakrishna',
                actionRemarks: remarks || 'Batch confirmed by GIS Officer.',
                remarks,
                decisionDate: new Date().toISOString(),
                decisionBy: 'S. Ramakrishna',
              };
            }
            return app;
          });

          return {
            applications: updatedApplications,
            history: [...newHistoryItems, ...state.history],
            selectedApplicationIds: [],
          };
        }),

      batchFlag: (ids, remarks) => get().batchFlagFieldSurvey(ids, remarks),

      batchFlagFieldSurvey: (ids, remarks) =>
        set((state) => {
          const newHistoryItems: GISHistoryRecord[] = [];
          const updatedApplications = state.applications.map((app) => {
            if (ids.includes(app.id)) {
              newHistoryItems.push({
                id: `HIST-GIS-${Date.now()}-${app.id}`,
                applicationId: app.id,
                applicationNo: app.applicationNo,
                citizenName: app.citizenName,
                surveyNumber: app.surveyNumber,
                village: app.village,
                action: 'FLAGGED_FIELD_SURVEY',
                trafficLight: app.trafficLight,
                overlapPercentage: app.overlapPercentage,
                remarks: remarks || 'Batch flagged for physical field survey.',
                timestamp: new Date().toISOString(),
                officerName: 'S. Ramakrishna',
                performedBy: 'SURV/TEL/2014/8821',
              });
              return {
                ...app,
                status: 'gis_flagged_field_survey' as const,
                actionStatus: 'FIELD_SURVEY_REQUIRED' as const,
                actionCompletedAt: new Date().toISOString(),
                actionCompletedBy: 'S. Ramakrishna',
                actionRemarks: remarks || 'Batch flagged for physical field survey.',
                remarks,
                decisionDate: new Date().toISOString(),
                decisionBy: 'S. Ramakrishna',
              };
            }
            return app;
          });

          return {
            applications: updatedApplications,
            history: [...newHistoryItems, ...state.history],
            selectedApplicationIds: [],
          };
        }),

      batchReject: (ids, reason, remarks) =>
        set((state) => {
          const newHistoryItems: GISHistoryRecord[] = [];
          const updatedApplications = state.applications.map((app) => {
            if (ids.includes(app.id)) {
              newHistoryItems.push({
                id: `HIST-GIS-${Date.now()}-${app.id}`,
                applicationId: app.id,
                applicationNo: app.applicationNo,
                citizenName: app.citizenName,
                surveyNumber: app.surveyNumber,
                village: app.village,
                action: 'REJECTED',
                trafficLight: app.trafficLight,
                overlapPercentage: app.overlapPercentage,
                reason,
                remarks: remarks || `Batch rejected: ${reason}`,
                timestamp: new Date().toISOString(),
                officerName: 'S. Ramakrishna',
                performedBy: 'SURV/TEL/2014/8821',
              });
              return {
                ...app,
                status: 'gis_rejected' as const,
                actionStatus: 'REJECTED' as const,
                actionCompletedAt: new Date().toISOString(),
                actionCompletedBy: 'S. Ramakrishna',
                actionReason: reason,
                actionRemarks: remarks || `Batch rejected: ${reason}`,
                rejectionReason: reason,
                remarks,
                decisionDate: new Date().toISOString(),
                decisionBy: 'S. Ramakrishna',
              };
            }
            return app;
          });

          return {
            applications: updatedApplications,
            history: [...newHistoryItems, ...state.history],
            selectedApplicationIds: [],
          };
        }),

      getStats: () => {
        const apps = get().applications;
        const pending = apps.filter((a) => a.status === 'pending_gis_review' || a.status === 'gis_adjusted').length;
        const overlapsDetected = apps.filter(
          (a) => a.trafficLight === 'red' || a.trafficLight === 'yellow'
        ).length;
        const history = get().history;
        const resolvedToday = history.length;
        const totalVerified = history.filter(
          (h) => h.action === 'CONFIRMED' || h.action === 'ADJUSTED' || h.action === 'confirm' || h.action === 'adjust'
        ).length;
        const totalAreaAcres = apps.reduce(
          (sum, a) => sum + (a.documentAreaAcres || a.documentArea || a.extentAcres || 0),
          0
        );

        return {
          pending,
          pendingReview: pending,
          overlapsDetected,
          resolvedToday,
          totalVerified,
          totalAreaAcres,
        };
      },
    }),
    {
      name: 'bhooraksha-gis-store-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
