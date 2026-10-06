import { useQuery } from '@tanstack/react-query';
import { citizenApi } from '../api/citizenApi';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['citizen-notifications'],
    queryFn: () => citizenApi.getNotifications(),
    refetchInterval: 30000,
  });
};
