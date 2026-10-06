import { useQuery } from '@tanstack/react-query';
import { deoApi } from '../api/deoApi';

interface FilterParams {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const useDEOApplications = (params?: FilterParams) => {
  const statsQuery = useQuery({
    queryKey: ['deo-stats'],
    queryFn: () => deoApi.getStats(),
    staleTime: 1000 * 30,
  });

  const queueQuery = useQuery({
    queryKey: ['deo-queue', params],
    queryFn: () => deoApi.getQueue(params),
    staleTime: 1000 * 30,
  });

  return {
    data: {
      data: queueQuery.data?.data || [],
      total: queueQuery.data?.total || 0,
      page: queueQuery.data?.page || 1,
      totalPages: queueQuery.data?.totalPages || 1,
      pending: statsQuery.data?.pending || 0,
      apiFailures: statsQuery.data?.apiFailures || 0,
      reviewedToday: statsQuery.data?.reviewedToday || 0,
      sentToVerifier: statsQuery.data?.sentToVerifier || 0,
    },
    isLoading: queueQuery.isLoading || statsQuery.isLoading,
    refetch: () => {
      queueQuery.refetch();
      statsQuery.refetch();
    },
  };
};
