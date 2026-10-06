import { useQuery } from '@tanstack/react-query';
import { verifierApi } from '../api/verifierApi';
import { useVerifierStore } from '../store/verifierStore';

export const useVerifierApplication = (id?: string) => {
  const storeApplications = useVerifierStore((s) => s.applications);

  return useQuery({
    queryKey: ['verifier-application', id, storeApplications],
    queryFn: () => verifierApi.getApplicationById(id),
    initialData: () => storeApplications.find((a) => a.id === id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};
