import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, { logout, clearError } from './auth.slice';
import type { AuthState } from './auth.slice';
import { createMockUser } from '@/test/test-utils';

describe('auth.slice', () => {
  let initialState: AuthState;

  beforeEach(() => {
    initialState = {
      currentUser: createMockUser({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'customer',
        status: 'active',
      }),
      accessToken: 'sample-access-token',
      refreshToken: 'sample-refresh-token',
      isAuthenticated: true,
      isLoading: false,
      error: 'Some previous error',
    };
  });

  it('handles logout by clearing user and tokens', () => {
    const nextState = authReducer(initialState, logout());
    expect(nextState.currentUser).toBeNull();
    expect(nextState.accessToken).toBeNull();
    expect(nextState.refreshToken).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.error).toBeNull();
  });

  it('handles clearError by resetting error to null', () => {
    const nextState = authReducer(initialState, clearError());
    expect(nextState.error).toBeNull();
    expect(nextState.currentUser).toEqual(initialState.currentUser);
  });
});
