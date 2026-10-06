import { useQuery } from '@tanstack/react-query';
import { revenueApi } from '../api/revenueApi';
import { useRevenueStore } from '../store/revenueStore';

export const useRevenueQueue = (params?: { status?: string; search?: string; limit?: number }) => {
  const storeApplications = useRevenueStore((s) => s.applications);

  return useQuery({
    queryKey: ['revenueQueue', params?.status, params?.search, storeApplications.length],
    queryFn: async () => {
      const data = await revenueApi.getQueue(params);
      const stats = await revenueApi.getStats();
      return {
        data: params?.limit ? data.slice(0, params.limit) : data,
        total: stats.total,
        pending: stats.pending,
        approved: stats.approved,
        rejected: stats.rejected,
        mutations: stats.mutations,
        certificates: stats.certificates,
      };
    },
  });
};
