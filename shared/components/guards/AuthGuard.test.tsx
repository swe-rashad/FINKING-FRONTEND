import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthGuard, GuestGuard } from './AuthGuard';
import { tokenService } from '@/core/auth/token.service';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    pathname: '/dashboard',
    asPath: '/dashboard',
    query: {},
    isReady: true,
  }),
}));

describe('AuthGuard & GuestGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthGuard', () => {
    it('renders children when user is authenticated', () => {
      vi.spyOn(tokenService, 'isAuthenticated').mockReturnValue(true);

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('redirects to /auth/login when user is unauthenticated', () => {
      vi.spyOn(tokenService, 'isAuthenticated').mockReturnValue(false);

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login')
      );
    });
  });

  describe('GuestGuard', () => {
    it('renders children when user is unauthenticated (guest)', () => {
      vi.spyOn(tokenService, 'isAuthenticated').mockReturnValue(false);

      render(
        <GuestGuard>
          <div>Public Login Form</div>
        </GuestGuard>
      );

      expect(screen.getByText('Public Login Form')).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('redirects authenticated user away to dashboard', () => {
      vi.spyOn(tokenService, 'isAuthenticated').mockReturnValue(true);

      render(
        <GuestGuard>
          <div>Public Login Form</div>
        </GuestGuard>
      );

      expect(screen.queryByText('Public Login Form')).not.toBeInTheDocument();
      expect(mockReplace).toHaveBeenCalledWith('/dashboard/statistics');
    });
  });
});
