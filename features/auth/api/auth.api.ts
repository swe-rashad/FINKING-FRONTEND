import { alovaInstance } from '@/core/api/alova';
import type { LoginCredentials, SignUpCredentials, AuthResponse, AuthTokens } from '../interfaces/auth.interface';

export const authApi = {
  signIn(credentials: LoginCredentials) {
    return alovaInstance.Post<AuthResponse>('/auth/sign-in', credentials);
  },

  signUp(credentials: SignUpCredentials) {
    return alovaInstance.Post<AuthResponse>('/auth/sign-up', credentials);
  },

  refreshToken(refreshToken: string) {
    return alovaInstance.Get<AuthTokens>('/auth/refresh-token', {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  },

  logout() {
    return alovaInstance.Post<{ message: string }>('/auth/logout');
  },
};
