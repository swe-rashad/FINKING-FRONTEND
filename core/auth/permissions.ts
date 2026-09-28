import type { CurrentUserResponse } from '@/features/users/interfaces/user.interface';

export function hasPermission(
  user: CurrentUserResponse | null,
  path: string
): boolean {
  if (!user) return true;

  const role = String(user.role);

  if (user.status === 'blocked') {
    return false;
  }

  if (role === 'admin') {
    return true;
  }

  const permissions = user.permissions || [];

  if (path.includes('/dashboard/users')) {
    if (permissions.length > 0) return permissions.includes('users:read');
    return role === 'admin' || role === 'employee';
  }

  if (path.includes('/dashboard/statistics')) {
    if (permissions.length > 0) return permissions.includes('statistics:read');
    return role === 'admin' || role === 'employee';
  }

  if (path.includes('/dashboard/transactions')) {
    if (permissions.length > 0) return permissions.includes('transactions:read');
    return true;
  }

  return true;
}

export function getDefaultDashboardRoute(user: CurrentUserResponse | null): string {
  if (hasPermission(user, '/dashboard/statistics')) return '/dashboard/statistics';
  if (hasPermission(user, '/dashboard/transactions')) return '/dashboard/transactions';
  if (hasPermission(user, '/dashboard/users')) return '/dashboard/users';
  return '/dashboard/transactions';
}
