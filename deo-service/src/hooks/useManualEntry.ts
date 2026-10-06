import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deoApi } from '../api/deoApi';
import { ManualEntryPayload } from '../api/types';

export const useManualEntry = (applicationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ManualEntryPayload) => {
      if (!applicationId) throw new Error('Application ID required');
      return deoApi.submitManualEntry(applicationId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deo-queue'] });
      queryClient.invalidateQueries({ queryKey: ['deo-stats'] });
      queryClient.invalidateQueries({ queryKey: ['deo-application-detail', applicationId] });
    },
  });
};
