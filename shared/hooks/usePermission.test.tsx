import React, { PropsWithChildren } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore, createMockUser } from '@/test/test-utils';
import { usePermission } from './usePermission';

describe('usePermission', () => {
  it('returns false for actions when user is null', () => {
    const store = createTestStore({
      auth: {
        currentUser: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.currentUser).toBeNull();
    expect(result.current.canUsersRead).toBe(false);
    expect(result.current.canTransactionsRead).toBe(false);
    expect(result.current.canStatisticsRead).toBe(false);
  });

  it('correctly reports permissions for admin user', () => {
    const store = createTestStore({
      auth: {
        currentUser: createMockUser({
          id: 1,
          name: 'Super Admin',
          email: 'admin@finking.com',
          role: 'admin',
          status: 'active',
        }),
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.canUsersRead).toBe(true);
    expect(result.current.canUsersCreate).toBe(true);
    expect(result.current.canStatisticsRead).toBe(true);
    expect(result.current.canStatisticsExport).toBe(true);
    expect(result.current.canAccessPath('/dashboard/statistics')).toBe(true);
  });

  it('correctly reports permissions for employee user', () => {
    const store = createTestStore({
      auth: {
        currentUser: createMockUser({
          id: 2,
          name: 'Staff Member',
          email: 'emp@finking.com',
          role: 'employee',
          status: 'active',
        }),
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.canUsersRead).toBe(true);
    expect(result.current.canUsersCreate).toBe(true);
    expect(result.current.canStatisticsRead).toBe(false);
    expect(result.current.canAccessPath('/dashboard/statistics')).toBe(false);
  });
});
