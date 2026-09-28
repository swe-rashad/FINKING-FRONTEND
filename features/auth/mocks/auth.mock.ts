import { defineMock } from '@alova/mock';
import type { AuthResponse, AuthTokens } from '../interfaces/auth.interface';

const mockSignIn = () => {
  const timestamp = Date.now();

  const response: AuthResponse = {
    accessToken: `mock_jwt_access_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
    refreshToken: `mock_jwt_refresh_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
  };

  return response;
};

const mockRefresh = () => {
  const timestamp = Date.now();
  const response: AuthTokens = {
    accessToken: `mock_jwt_access_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
    refreshToken: `mock_jwt_refresh_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
  };

  return response;
};

export const authMock = defineMock({
  '[GET]/users/current': () => {
    return {
      id: 68,
      createdAt: '2026-09-17T10:05:39.483Z',
      updatedAt: '2026-09-17T10:05:39.483Z',
      email: 'swe.rfffassssssdhawwwsdww@gmail.com',
      name: 'Rashad',
      lastname: 'Yusifli',
      verificated: true,
      status: 'active',
      role: 'admin',
    };
  },

  '[GET]/auth/profile': () => {
    return {
      id: 68,
      name: 'Rashad Yusifli',
      email: 'swe.rfffassssssdhawwwsdww@gmail.com',
      company: 'Finking Financial',
      role: 'admin',
    };
  },

  '[POST]/auth/sign-in': mockSignIn,
  '[POST]/api/auth/login': mockSignIn,

  '[GET]/auth/refresh-token': mockRefresh,
  '[POST]/api/auth/refresh': mockRefresh,
  '[POST]/auth/logout': () => ({ message: 'Logged out successfully' }),
});

