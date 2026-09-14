import type { Method } from 'alova';
import { tokenService } from '@/core/auth/token.service';
import { toast } from '@/shared/components/common/Toast';
import { isMockEnabled } from '@/core/api/alova';

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
      toast.error('Something went wrong');
      handleUnauthorizedLogout();
      throw new Error('Authentication failed');
    }

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      toast.error('Something went wrong');
      handleUnauthorizedLogout();
      throw new Error('Session expired: No refresh token available');
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        let data: { authToken?: string; refreshToken?: string };

        if (isMockEnabled()) {
          const timestamp = Date.now();
          data = {
            authToken: `mock_jwt_access_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
            refreshToken: `mock_jwt_refresh_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
          };
        } else {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
          const refreshUrl = `${apiBase}/api/auth/refresh`;
          const refreshResponse = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshResponse.ok) {
            throw new Error('Refresh token rejected');
          }

          data = await refreshResponse.json();
        }

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
        toast.error('Something went wrong');
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
          toast.error('Something went wrong');
          reject(new Error('Session expired during token refresh'));
        }
      });
    });
  }

  // Handle other non-ok HTTP responses (4xx, 5xx)
  if (response && !response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const cloned = response.clone();
      const errorData = await cloned.json();
      if (errorData?.message) {
        errorMessage =
          typeof errorData.message === 'string'
            ? errorData.message
            : errorData.message[0] || 'Something went wrong';
      }
    } catch {
      // Body is not JSON
    }

    toast.error(errorMessage || 'Something went wrong');
    throw new Error(errorMessage || 'Something went wrong');
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
