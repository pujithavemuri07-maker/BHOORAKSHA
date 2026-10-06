import { useQuery } from '@tanstack/react-query';
import { citizenApi } from '../api/citizenApi';

export const useApplicationDetail = (id?: string) => {
  return useQuery({
    queryKey: ['citizen-application-detail', id],
    queryFn: () => (id ? citizenApi.getApplicationById(id) : null),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
};
