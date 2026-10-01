import { describe, it, expect } from 'vitest';
import {
  isSafeInternalPath,
  getSafeRedirectPath,
  getPostLoginRedirect,
} from './safe-redirect';

describe('safe-redirect utility', () => {
  describe('isSafeInternalPath', () => {
    it('returns true for valid internal paths', () => {
      expect(isSafeInternalPath('/dashboard')).toBe(true);
      expect(isSafeInternalPath('/dashboard/users?sort=asc')).toBe(true);
      expect(isSafeInternalPath('/auth/login')).toBe(true);
    });

    it('returns false for non-string or empty values', () => {
      expect(isSafeInternalPath('')).toBe(false);
      expect(isSafeInternalPath(null)).toBe(false);
      expect(isSafeInternalPath(undefined)).toBe(false);
      expect(isSafeInternalPath(123)).toBe(false);
      expect(isSafeInternalPath({})).toBe(false);
    });

    it('rejects external URLs and protocol-relative URLs', () => {
      expect(isSafeInternalPath('https://evil.com')).toBe(false);
      expect(isSafeInternalPath('http://evil.com')).toBe(false);
      expect(isSafeInternalPath('javascript:alert(1)')).toBe(false);
      expect(isSafeInternalPath('//evil.com')).toBe(false);
      expect(isSafeInternalPath('/\\evil.com')).toBe(false);
      expect(isSafeInternalPath('evil.com')).toBe(false);
    });
  });

  describe('getSafeRedirectPath', () => {
    it('returns valid path when provided', () => {
      expect(getSafeRedirectPath('/dashboard/transactions')).toBe('/dashboard/transactions');
    });

    it('resolves first element if given an array of query param strings', () => {
      expect(getSafeRedirectPath(['/dashboard/users', '/other'])).toBe('/dashboard/users');
    });

    it('returns default fallback when given unsafe or invalid path', () => {
      expect(getSafeRedirectPath('https://malicious.com')).toBe('/dashboard/statistics');
      expect(getSafeRedirectPath(undefined)).toBe('/dashboard/statistics');
    });

    it('returns custom fallback when provided', () => {
      expect(getSafeRedirectPath('https://malicious.com', '/custom-fallback')).toBe('/custom-fallback');
    });
  });

  describe('getPostLoginRedirect', () => {
    it('returns target internal path when valid', () => {
      expect(getPostLoginRedirect('/dashboard/users')).toBe('/dashboard/users');
    });

    it('returns null for root or auth paths to avoid redirect loops', () => {
      expect(getPostLoginRedirect('/')).toBeNull();
      expect(getPostLoginRedirect('/auth/login')).toBeNull();
      expect(getPostLoginRedirect('/auth/signup')).toBeNull();
    });

    it('returns null for invalid or malicious paths', () => {
      expect(getPostLoginRedirect('//evil.com')).toBeNull();
      expect(getPostLoginRedirect(null)).toBeNull();
    });
  });
});
