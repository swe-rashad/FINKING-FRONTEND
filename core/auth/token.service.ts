export const AUTH_TOKEN_KEY = 'finking_auth_token';
export const REFRESH_TOKEN_KEY = 'finking_refresh_token';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export const tokenService = {
  getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) return token;
    } catch { }
    return getCookie(AUTH_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const token = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (token) return token;
    } catch { }
    return getCookie(REFRESH_TOKEN_KEY);
  },

  setTokens({
    authToken,
    refreshToken,
  }: {
    authToken: string;
    refreshToken: string;
  }): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch { }
    setCookie(AUTH_TOKEN_KEY, authToken, 1);
    setCookie(REFRESH_TOKEN_KEY, refreshToken, 7);
  },

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch { }
    removeCookie(AUTH_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getAuthToken() || this.getRefreshToken());
  },
};
