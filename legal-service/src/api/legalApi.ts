import { apiClient } from './client';
import { LegalApplication, HistoryRecord, StatsResponse } from './types';
import { useLegalStore } from '../store/legalStore';

const USE_LIVE_API = import.meta.env.VITE_USE_LIVE_API === 'true';

export const legalApi = {
  getStats: async (): Promise<StatsResponse> => {
    if (!USE_LIVE_API) {
      return useLegalStore.getState().getStats();
    }
    try {
      const response = await apiClient.get<StatsResponse>('/legal/stats');
      return response.data;
    } catch {
      return useLegalStore.getState().getStats();
    }
  },

  getQueue: async (params?: {
    severity?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<LegalApplication[]> => {
    if (!USE_LIVE_API) {
      let apps = useLegalStore.getState().applications;
      if (params?.severity && params.severity !== 'all') {
        apps = apps.filter((a) => a.severity === params.severity);
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
            a.id.toLowerCase().includes(q)
        );
      }
      return apps;
    }

    try {
      const response = await apiClient.get<LegalApplication[]>('/legal/queue', { params });
      return response.data;
    } catch {
      return useLegalStore.getState().applications;
    }
  },

  getApplication: async (id: string): Promise<LegalApplication> => {
    if (!USE_LIVE_API) {
      const app = useLegalStore.getState().applications.find((a) => a.id === id);
      if (!app) throw new Error('Application not found');
      return app;
    }

    try {
      const response = await apiClient.get<LegalApplication>(`/legal/application/${id}`);
      return response.data;
    } catch {
      const app = useLegalStore.getState().applications.find((a) => a.id === id);
      if (!app) throw new Error('Application not found');
      return app;
    }
  },

  clearApplication: async (id: string, opinion: string): Promise<void> => {
    useLegalStore.getState().clearApplication(id, opinion);
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/legal/clear/${id}`, { opinion });
      } catch (err) {
        console.warn('Backend clear API failed, updated local store', err);
      }
    }
  },

  flagApplication: async (id: string, reason: string, opinion: string): Promise<void> => {
    useLegalStore.getState().flagApplication(id, reason, opinion);
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/legal/flag/${id}`, { reason, opinion });
      } catch (err) {
        console.warn('Backend flag API failed, updated local store', err);
      }
    }
  },

  blockApplication: async (
    id: string,
    reason: string,
    opinion: string,
    legalReferences: string[]
  ): Promise<void> => {
    useLegalStore.getState().blockApplication(id, reason, opinion, legalReferences);
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/legal/block/${id}`, { reason, opinion, legalReferences });
      } catch (err) {
        console.warn('Backend block API failed, updated local store', err);
      }
    }
  },

  escalateApplication: async (id: string, remarks: string): Promise<void> => {
    useLegalStore.getState().escalateApplication(id, remarks);
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/legal/escalate/${id}`, { remarks });
      } catch (err) {
        console.warn('Backend escalate API failed, updated local store', err);
      }
    }
  },

  saveOpinionDraft: async (id: string, opinion: string): Promise<void> => {
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/legal/opinion/${id}`, { opinion });
      } catch (err) {
        console.warn('Draft save sync warning', err);
      }
    }
  },

  getHistory: async (): Promise<HistoryRecord[]> => {
    if (!USE_LIVE_API) {
      return useLegalStore.getState().history;
    }
    try {
      const response = await apiClient.get<HistoryRecord[]>('/legal/history');
      return response.data;
    } catch {
      return useLegalStore.getState().history;
    }
  },

  batchClear: async (ids: string[], opinion: string): Promise<void> => {
    useLegalStore.getState().batchClear(ids, opinion);
    if (USE_LIVE_API) {
      try {
        await apiClient.post('/legal/batch-clear', { ids, opinion });
      } catch (err) {
        console.warn('Backend batch clear failed', err);
      }
    }
  },

  batchFlag: async (ids: string[], reason: string, opinion: string): Promise<void> => {
    useLegalStore.getState().batchFlag(ids, reason, opinion);
    if (USE_LIVE_API) {
      try {
        await apiClient.post('/legal/batch-flag', { ids, reason, opinion });
      } catch (err) {
        console.warn('Backend batch flag failed', err);
      }
    }
  },

  batchBlock: async (
    ids: string[],
    reason: string,
    opinion: string,
    legalReferences: string[]
  ): Promise<void> => {
    useLegalStore.getState().batchBlock(ids, reason, opinion, legalReferences);
    if (USE_LIVE_API) {
      try {
        await apiClient.post('/legal/batch-block', { ids, reason, opinion, legalReferences });
      } catch (err) {
        console.warn('Backend batch block failed', err);
      }
    }
  },
};
