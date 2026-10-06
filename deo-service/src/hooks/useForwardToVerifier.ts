import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deoApi } from '../api/deoApi';

export const useForwardToVerifier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { applicationId: string; verifierId: string; remarks?: string }) =>
      deoApi.forwardToVerifier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deo-queue'] });
      queryClient.invalidateQueries({ queryKey: ['deo-stats'] });
      queryClient.invalidateQueries({ queryKey: ['deo-history'] });
    },
  });
};
