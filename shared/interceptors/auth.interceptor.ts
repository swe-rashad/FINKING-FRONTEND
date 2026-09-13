import type { Method } from 'alova';
import { tokenService } from '@/core/auth/token.service';

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function handleUnauthorizedLogout() {
  tokenService.clearTokens();
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/login')) {
    const currentPath = window.location.pathname + window.location.search;
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
  }
}

export const authRequestInterceptor = (method: Method) => {
  const token = tokenService.getAuthToken();
  if (token) {
    method.config.headers = method.config.headers || {};
    method.config.headers.Authorization = `Bearer ${token}`;
  }
};

export const authResponseInterceptor = async (
  response: Response,
  method: Method
): Promise<unknown> => {
  if (response && response.status === 401) {
    const isAuthEndpoint =
      method.url.includes('/api/auth/login') ||
      method.url.includes('/api/auth/refresh');

    if (isAuthEndpoint) {
      handleUnauthorizedLogout();
      throw new Error('Authentication failed');
    }

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      handleUnauthorizedLogout();
      throw new Error('Session expired: No refresh token available');
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh token rejected');
        }

        const data = await refreshResponse.json();
        if (data && data.authToken) {
          tokenService.setTokens({
            authToken: data.authToken,
            refreshToken: data.refreshToken || refreshToken,
          });
          onRefreshed(data.authToken);
          return await method.send();
        } else {
          throw new Error('Invalid refresh response');
        }
      } catch (err) {
        onRefreshed(null);
        handleUnauthorizedLogout();
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((newToken) => {
        if (newToken) {
          resolve(method.send());
        } else {
          reject(new Error('Session expired during token refresh'));
        }
      });
    });
  }

  if (response && typeof response.json === 'function') {
    try {
      return await response.json();
    } catch {
      return response;
    }
  }

  return response;
};
