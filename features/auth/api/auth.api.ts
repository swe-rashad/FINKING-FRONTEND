import { alovaInstance } from '@/core/api/alova';
import type {
  LoginCredentials,
  AuthResponse,
  AuthTokens,
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
};
