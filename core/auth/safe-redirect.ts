const DEFAULT_REDIRECT = '/dashboard/statistics';

export function isSafeInternalPath(path: unknown): path is string {
  if (typeof path !== 'string' || path.length === 0) {
    return false;
  }

  if (!path.startsWith('/')) {
    return false;
  }

  if (path.startsWith('//') || path.startsWith('/\\')) {
    return false;
  }

  if (path.includes('://')) {
    return false;
  }

  return true;
}

export function getSafeRedirectPath(
  path: unknown,
  fallback = DEFAULT_REDIRECT
): string {
  const value = Array.isArray(path) ? path[0] : path;
  return isSafeInternalPath(value) ? value : fallback;
}

export function getPostLoginRedirect(asPath: unknown): string | null {
  const path = getSafeRedirectPath(asPath, '');
  if (!path || path === '/' || path.startsWith('/auth/')) {
    return null;
  }
  return path;
}
