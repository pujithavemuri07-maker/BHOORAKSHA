import { useQuery } from '@tanstack/react-query';
import { citizenApi } from '../api/citizenApi';

export const useApplications = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['citizen-applications', params],
    queryFn: () => citizenApi.getApplications(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useApplicationStats = () => {
  return useQuery({
    queryKey: ['citizen-stats'],
    queryFn: () => citizenApi.getStats(),
    staleTime: 1000 * 60 * 2,
  });
};
