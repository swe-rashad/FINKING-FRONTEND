import { alovaInstance } from '@/core/api/alova';
import type {
  LoginCredentials,
  AuthResponse,
  AuthTokens,
  UserProfile,
} from '../interfaces/auth.interface';

export const authApi = {
  login(credentials: LoginCredentials) {
    return alovaInstance.Post<AuthResponse>('/api/auth/login', credentials);
  },

  refreshToken(refreshToken: string) {
    return alovaInstance.Post<AuthTokens>('/api/auth/refresh', {
      refreshToken,
    });
  },

  getProfile() {
    return alovaInstance.Get<UserProfile>('/api/auth/profile');
  },
};
