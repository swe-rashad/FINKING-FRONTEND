import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { tokenService, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from './token.service';

describe('tokenService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores and retrieves auth and refresh tokens in localStorage and cookies', () => {
    tokenService.setTokens({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
    });

    expect(tokenService.getAuthToken()).toBe('access-123');
    expect(tokenService.getRefreshToken()).toBe('refresh-456');
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('access-123');
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('refresh-456');
  });

  it('accepts authToken alias in setTokens', () => {
    tokenService.setTokens({
      authToken: 'auth-legacy-token',
      refreshToken: 'refresh-789',
    });

    expect(tokenService.getAuthToken()).toBe('auth-legacy-token');
  });

  it('falls back to cookie if localStorage returns null', () => {
    document.cookie = `${AUTH_TOKEN_KEY}=cookie-token; path=/`;
    expect(tokenService.getAuthToken()).toBe('cookie-token');
  });

  it('clears tokens properly', () => {
    tokenService.setTokens({
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
    });

    expect(tokenService.isAuthenticated()).toBe(true);

    tokenService.clearTokens();

    expect(tokenService.getAuthToken()).toBeNull();
    expect(tokenService.getRefreshToken()).toBeNull();
    expect(tokenService.isAuthenticated()).toBe(false);
  });

  it('returns isAuthenticated as true when either token exists', () => {
    expect(tokenService.isAuthenticated()).toBe(false);

    localStorage.setItem(AUTH_TOKEN_KEY, 'temp-token');
    expect(tokenService.isAuthenticated()).toBe(true);
  });
});
