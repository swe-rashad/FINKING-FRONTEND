import { defineMock } from '@alova/mock';
import type { AuthResponse, AuthTokens } from '../interfaces/auth.interface';

export const authMock = defineMock({
  '[GET]/api/auth/profile': () => {
    return {
      id: 1,
      name: 'Rashad Yusifli',
      email: 'rashad.yusifli@finking.com',
      company: 'Finking Financial',
      role: 'Administrator',
    };
  },

  '[POST]/api/auth/login': ({ data }) => {
    const timestamp = Date.now();
    const email = data?.email || 'rashad.yusifli@finking.com';
    const username = email.split('@')[0];

    const response: AuthResponse = {
      authToken: `mock_jwt_access_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
      refreshToken: `mock_jwt_refresh_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
      user: {
        id: 1,
        email,
        username,
        role: 'Admin',
      },
    };

    return response;
  },

  '[POST]/api/auth/refresh': ({ data }) => {
    const timestamp = Date.now();
    const incomingToken = data?.refreshToken;

    if (!incomingToken) {
      return {
        status: 401,
        statusText: 'Unauthorized: Missing refresh token',
      };
    }

    const response: AuthTokens = {
      authToken: `mock_jwt_access_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
      refreshToken: `mock_jwt_refresh_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
    };

    return response;
  },
});
