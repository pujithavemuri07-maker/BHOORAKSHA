import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gisApi } from '../api/gisApi';
import { LatLngCoord } from '../api/types';
import toast from 'react-hot-toast';

export const useAdjustBoundary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      boundaryData,
      remarks,
    }: {
      applicationId: string;
      boundaryData: LatLngCoord[];
      remarks?: string;
    }) => gisApi.adjustBoundary(applicationId, boundaryData, remarks),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['gis-queue'] });
      queryClient.invalidateQueries({ queryKey: ['gis-application', vars.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['gis-history'] });
      queryClient.invalidateQueries({ queryKey: ['gis-stats'] });
      toast.success('Boundary Adjusted & Snapped to Cadastral Benchmarks');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to adjust boundary');
    },
  });
};
