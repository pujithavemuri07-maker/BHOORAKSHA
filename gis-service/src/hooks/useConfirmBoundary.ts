import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gisApi } from '../api/gisApi';
import toast from 'react-hot-toast';

export const useConfirmBoundary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, remarks }: { applicationId: string; remarks?: string }) =>
      gisApi.confirmBoundary(applicationId, remarks),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['gis-queue'] });
      queryClient.invalidateQueries({ queryKey: ['gis-application', vars.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['gis-history'] });
      queryClient.invalidateQueries({ queryKey: ['gis-stats'] });
      toast.success('Boundary Confirmed & Verified with Cadastral Map');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to confirm boundary');
    },
  });
};
