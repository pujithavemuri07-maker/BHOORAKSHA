import { apiClient } from './client';
import {
  GISApplication,
  GISHistoryRecord,
  GISStatsResponse,
  LatLngCoord,
} from './types';
import { useGISStore } from '../store/gisStore';

const USE_LIVE_API = import.meta.env.VITE_USE_LIVE_API === 'true';

export const gisApi = {
  getStats: async (): Promise<GISStatsResponse> => {
    if (!USE_LIVE_API) {
      return useGISStore.getState().getStats();
    }
    try {
      const response = await apiClient.get<GISStatsResponse>('/gis/stats');
      return response.data;
    } catch {
      return useGISStore.getState().getStats();
    }
  },

  getQueue: async (params?: {
    trafficLight?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<GISApplication[]> => {
    if (!USE_LIVE_API) {
      let apps = useGISStore.getState().applications;
      if (params?.trafficLight && params.trafficLight !== 'all') {
        apps = apps.filter((a) => a.trafficLight === params.trafficLight);
      }
      if (params?.status && params.status !== 'all') {
        apps = apps.filter((a) => a.status === params.status);
      }
      if (params?.priority && params.priority !== 'all') {
        apps = apps.filter((a) => a.priority === params.priority);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        apps = apps.filter(
          (a) =>
            a.citizenName.toLowerCase().includes(q) ||
            a.surveyNumber.toLowerCase().includes(q) ||
            a.village.toLowerCase().includes(q) ||
            a.id.toLowerCase().includes(q)
        );
      }
      return apps;
    }

    try {
      const response = await apiClient.get<GISApplication[]>('/gis/queue', { params });
      return response.data;
    } catch {
      return useGISStore.getState().applications;
    }
  },

  getApplication: async (id: string): Promise<GISApplication> => {
    if (!USE_LIVE_API) {
      const app = useGISStore.getState().applications.find((a) => a.id === id);
      if (!app) throw new Error('Application not found');
      return app;
    }

    try {
      const response = await apiClient.get<GISApplication>(`/gis/application/${id}`);
      return response.data;
    } catch {
      const app = useGISStore.getState().applications.find((a) => a.id === id);
      if (!app) throw new Error('Application not found');
      return app;
    }
  },

  confirmBoundary: async (id: string, remarks?: string): Promise<void> => {
    useGISStore.getState().confirmBoundary(id, remarks);
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/gis/confirm/${id}`, { remarks });
      } catch (err) {
        console.warn('Backend confirm API failed, local store updated', err);
      }
    }
  },

  adjustBoundary: async (
    id: string,
    adjustedBoundary: LatLngCoord[],
    remarks?: string
  ): Promise<void> => {
    useGISStore.getState().adjustBoundary(id, adjustedBoundary, remarks);
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/gis/adjust/${id}`, { adjustedBoundary, remarks });
      } catch (err) {
        console.warn('Backend adjust API failed, local store updated', err);
      }
    }
  },

  flagFieldSurvey: async (id: string, remarks: string): Promise<void> => {
    useGISStore.getState().flagFieldSurvey(id, remarks);
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/gis/flag-field-survey/${id}`, { remarks });
      } catch (err) {
        console.warn('Backend flag field survey failed, local store updated', err);
      }
    }
  },

  rejectBoundary: async (id: string, reason: string, remarks: string): Promise<void> => {
    useGISStore.getState().rejectBoundary(id, reason, remarks);
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/gis/reject/${id}`, { reason, remarks });
      } catch (err) {
        console.warn('Backend reject API failed, local store updated', err);
      }
    }
  },

  getHistory: async (): Promise<GISHistoryRecord[]> => {
    if (!USE_LIVE_API) {
      return useGISStore.getState().history;
    }
    try {
      const response = await apiClient.get<GISHistoryRecord[]>('/gis/history');
      return response.data;
    } catch {
      return useGISStore.getState().history;
    }
  },

  batchConfirm: async (ids: string[], remarks?: string): Promise<void> => {
    useGISStore.getState().batchConfirm(ids, remarks);
    if (USE_LIVE_API) {
      try {
        await apiClient.post('/gis/batch/confirm', { ids, remarks });
      } catch (err) {
        console.warn('Backend batch confirm failed', err);
      }
    }
  },

  batchFlag: async (ids: string[], remarks: string): Promise<void> => {
    useGISStore.getState().batchFlag(ids, remarks);
    if (USE_LIVE_API) {
      try {
        await apiClient.post('/gis/batch/flag', { ids, remarks });
      } catch (err) {
        console.warn('Backend batch flag failed', err);
      }
    }
  },

  batchReject: async (ids: string[], reason: string, remarks: string): Promise<void> => {
    useGISStore.getState().batchReject(ids, reason, remarks);
    if (USE_LIVE_API) {
      try {
        await apiClient.post('/gis/batch/reject', { ids, reason, remarks });
      } catch (err) {
        console.warn('Backend batch reject failed', err);
      }
    }
  },
};
