import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gisApi } from '../api/gisApi';
import toast from 'react-hot-toast';

export const useReject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      reason,
      remarks,
    }: {
      applicationId: string;
      reason: string;
      remarks: string;
    }) => gisApi.rejectBoundary(applicationId, reason, remarks),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['gis-queue'] });
      queryClient.invalidateQueries({ queryKey: ['gis-application', vars.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['gis-history'] });
      queryClient.invalidateQueries({ queryKey: ['gis-stats'] });
      toast.success('Boundary Rejected & Encroachment Notice Issued');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to reject boundary');
    },
  });
};
