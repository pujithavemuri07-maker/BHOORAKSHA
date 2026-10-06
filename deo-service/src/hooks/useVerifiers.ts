import { useQuery } from '@tanstack/react-query';
import { deoApi } from '../api/deoApi';

export const useVerifiers = () => {
  return useQuery({
    queryKey: ['deo-verifiers'],
    queryFn: () => deoApi.getVerifiers(),
    staleTime: 1000 * 60 * 5,
  });
};
