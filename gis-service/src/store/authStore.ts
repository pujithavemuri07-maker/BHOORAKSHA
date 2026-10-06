import { useAuthStore as useSharedAuthStore } from '@shared/store/authStore';
import { UserResponse } from '@shared/types/user';

export type GISUser = UserResponse;

export const useAuthStore: any = (selector?: (state: any) => any) => {
  const store = useSharedAuthStore();

  const state = {
    user: store.user,
    token: store.token,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: (userOrCredentials: any, token?: string) => {
      if (typeof userOrCredentials === 'object' && !userOrCredentials.password) {
        store.setSession({
          access_token: token || userOrCredentials.token || 'real-jwt',
          refresh_token: token || userOrCredentials.token || 'real-jwt',
          token_type: 'bearer',
          expires_in: 86400,
          user: userOrCredentials,
        });
      } else if (userOrCredentials?.email && userOrCredentials?.password) {
        return store.login(userOrCredentials);
      }
    },
    loginWithCredentials: store.login,
    loginWithOtp: store.loginWithOtp,
    logout: store.logout,
    updateUser: store.updateUser,
    updateProfile: store.updateUser,
    initializeAuth: store.initializeAuth,
    clearError: store.clearError,
  };

  return selector ? selector(state) : state;
};

useAuthStore.getState = () => {
  const store = useSharedAuthStore.getState();
  return {
    user: store.user,
    token: store.token,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    loginWithCredentials: store.login,
    loginWithOtp: store.loginWithOtp,
    logout: store.logout,
    updateUser: store.updateUser,
    updateProfile: store.updateUser,
    initializeAuth: store.initializeAuth,
    clearError: store.clearError,
  };
};

export { useSharedAuthStore };
export default useAuthStore;
