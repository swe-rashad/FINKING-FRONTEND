import type { CurrentUserResponse } from '@/features/users/interfaces/user.interface';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  CUSTOMER = 'customer',
}

export type PermissionAction =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'users:block'
  | 'transactions:read'
  | 'transactions:export'
  | 'merchant:read'
  | 'merchant:update';

export function canAccess(
  user: CurrentUserResponse | null,
  action: PermissionAction | string
): boolean {
  if (!user) return false;
  if (user.status === 'blocked') return false;

  const role = String(user.role);
  if (role === UserRole.ADMIN) return true;

  if (action === 'statistics:read' || action === 'statistics:export') {
    return false;
  }

  const permissions = user.permissions;

  if (Array.isArray(permissions)) {
    return permissions.includes(action as PermissionAction);
  }

  switch (action) {
    case 'users:read':
    case 'users:create':
      return role === UserRole.EMPLOYEE;
    case 'users:update':
    case 'users:delete':
    case 'users:block':
      return false;
    case 'transactions:read':
      return role === UserRole.EMPLOYEE || role === UserRole.CUSTOMER;
    case 'transactions:export':
      return false;
    case 'merchant:read':
    case 'merchant:update':
      return role === UserRole.EMPLOYEE;
    default:
      return false;
  }
}

export function hasPathAccess(
  user: CurrentUserResponse | null,
  path: string
): boolean {
  if (!user) return true;
  if (user.status === 'blocked') return false;

  const role = String(user.role);

  if (path.includes('/dashboard/statistics')) {
    return role === UserRole.ADMIN;
  }

  if (path.includes('/dashboard/users')) {
    return canAccess(user, 'users:read');
  }

  if (path.includes('/dashboard/transactions')) {
    return canAccess(user, 'transactions:read');
  }

  return true;
}

export function getDefaultDashboardRoute(user: CurrentUserResponse | null): string {
  if (hasPathAccess(user, '/dashboard/statistics')) return '/dashboard/statistics';
  if (hasPathAccess(user, '/dashboard/transactions')) return '/dashboard/transactions';
  if (hasPathAccess(user, '/dashboard/users')) return '/dashboard/users';
  return '/dashboard/transactions';
}
