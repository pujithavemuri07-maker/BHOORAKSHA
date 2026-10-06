import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gisApi } from '../api/gisApi';
import toast from 'react-hot-toast';

export const useFlagFieldSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, remarks }: { applicationId: string; remarks: string }) =>
      gisApi.flagFieldSurvey(applicationId, remarks),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['gis-queue'] });
      queryClient.invalidateQueries({ queryKey: ['gis-application', vars.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['gis-history'] });
      queryClient.invalidateQueries({ queryKey: ['gis-stats'] });
      toast.success('Flagged for Mandal Field DGPS Ground Survey');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to flag for field survey');
    },
  });
};
