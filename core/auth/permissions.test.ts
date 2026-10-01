import { describe, it, expect } from 'vitest';
import {
  canAccess,
  hasPathAccess,
  getDefaultDashboardRoute,
} from './permissions';
import { createMockUser } from '@/test/test-utils';

describe('permissions utility', () => {
  const adminUser = createMockUser({
    id: 1,
    name: 'Admin User',
    email: 'admin@finking.com',
    role: 'admin',
    status: 'active',
  });

  const employeeUser = createMockUser({
    id: 2,
    name: 'Employee User',
    email: 'employee@finking.com',
    role: 'employee',
    status: 'active',
  });

  const customerUser = createMockUser({
    id: 3,
    name: 'Customer User',
    email: 'customer@finking.com',
    role: 'customer',
    status: 'active',
  });

  const blockedUser = createMockUser({
    id: 4,
    name: 'Blocked User',
    email: 'blocked@finking.com',
    role: 'admin',
    status: 'blocked',
  });

  describe('canAccess', () => {
    it('returns false when user is null', () => {
      expect(canAccess(null, 'users:read')).toBe(false);
    });

    it('returns false when user is blocked, even if admin', () => {
      expect(canAccess(blockedUser, 'users:read')).toBe(false);
      expect(canAccess(blockedUser, 'transactions:read')).toBe(false);
    });

    it('grants all permissions to admin', () => {
      expect(canAccess(adminUser, 'users:read')).toBe(true);
      expect(canAccess(adminUser, 'users:create')).toBe(true);
      expect(canAccess(adminUser, 'users:delete')).toBe(true);
      expect(canAccess(adminUser, 'transactions:export')).toBe(true);
    });

    it('denies statistics actions to non-admin even if employee', () => {
      expect(canAccess(employeeUser, 'statistics:read')).toBe(false);
      expect(canAccess(employeeUser, 'statistics:export')).toBe(false);
    });

    it('checks explicit permissions array when available on user', () => {
      const userWithCustomPerms = createMockUser({
        ...employeeUser,
        permissions: ['transactions:read', 'transactions:export'],
      });
      expect(canAccess(userWithCustomPerms, 'transactions:read')).toBe(true);
      expect(canAccess(userWithCustomPerms, 'transactions:export')).toBe(true);
      expect(canAccess(userWithCustomPerms, 'users:read')).toBe(false);
    });

    it('falls back to role default permissions when permissions array is absent', () => {
      expect(canAccess(employeeUser, 'users:read')).toBe(true);
      expect(canAccess(employeeUser, 'users:create')).toBe(true);
      expect(canAccess(employeeUser, 'users:delete')).toBe(false);
      expect(canAccess(employeeUser, 'transactions:read')).toBe(true);
      expect(canAccess(employeeUser, 'transactions:export')).toBe(false);

      expect(canAccess(customerUser, 'transactions:read')).toBe(true);
      expect(canAccess(customerUser, 'users:read')).toBe(false);
    });
  });

  describe('hasPathAccess', () => {
    it('returns true when user is null (public / unauthenticated check handled elsewhere)', () => {
      expect(hasPathAccess(null, '/dashboard/users')).toBe(true);
    });

    it('returns false for blocked users', () => {
      expect(hasPathAccess(blockedUser, '/dashboard/transactions')).toBe(false);
    });

    it('restricts /dashboard/statistics to admin only', () => {
      expect(hasPathAccess(adminUser, '/dashboard/statistics')).toBe(true);
      expect(hasPathAccess(employeeUser, '/dashboard/statistics')).toBe(false);
      expect(hasPathAccess(customerUser, '/dashboard/statistics')).toBe(false);
    });

    it('checks users permission for /dashboard/users', () => {
      expect(hasPathAccess(adminUser, '/dashboard/users')).toBe(true);
      expect(hasPathAccess(employeeUser, '/dashboard/users')).toBe(true);
      expect(hasPathAccess(customerUser, '/dashboard/users')).toBe(false);
    });

    it('checks transactions permission for /dashboard/transactions', () => {
      expect(hasPathAccess(adminUser, '/dashboard/transactions')).toBe(true);
      expect(hasPathAccess(employeeUser, '/dashboard/transactions')).toBe(true);
      expect(hasPathAccess(customerUser, '/dashboard/transactions')).toBe(true);
    });
  });

  describe('getDefaultDashboardRoute', () => {
    it('returns /dashboard/statistics for admin', () => {
      expect(getDefaultDashboardRoute(adminUser)).toBe('/dashboard/statistics');
    });

    it('returns /dashboard/transactions for employee if statistics not accessible', () => {
      expect(getDefaultDashboardRoute(employeeUser)).toBe('/dashboard/transactions');
    });

    it('returns fallback route for null user', () => {
      expect(getDefaultDashboardRoute(null)).toBe('/dashboard/statistics');
    });
  });
});
