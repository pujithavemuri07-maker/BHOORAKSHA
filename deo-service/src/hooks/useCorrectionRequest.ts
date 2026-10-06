import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deoApi } from '../api/deoApi';

export const useCorrectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { applicationId: string; reason: string; remarks?: string }) =>
      deoApi.requestCorrection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deo-queue'] });
      queryClient.invalidateQueries({ queryKey: ['deo-stats'] });
      queryClient.invalidateQueries({ queryKey: ['deo-history'] });
    },
  });
};
