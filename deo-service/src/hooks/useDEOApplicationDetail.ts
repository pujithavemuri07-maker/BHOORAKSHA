import { useQuery } from '@tanstack/react-query';
import { deoApi } from '../api/deoApi';

export const useDEOApplicationDetail = (id?: string) => {
  return useQuery({
    queryKey: ['deo-application-detail', id],
    queryFn: () => (id ? deoApi.getApplicationById(id) : null),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });
};
