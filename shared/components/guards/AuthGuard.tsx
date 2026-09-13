import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { tokenService } from '@/core/auth/token.service';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!tokenService.isAuthenticated()) {
      const redirectUrl =
        router.asPath && router.asPath !== '/' && router.asPath !== '/auth/login'
          ? router.asPath
          : undefined;

      router.replace(
        redirectUrl
          ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
          : '/auth/login'
      );
    } else {
      queueMicrotask(() => {
        setIsAuthorized(true);
      });
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F9F9]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
          <span className="text-xs font-medium text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (tokenService.isAuthenticated()) {
      const redirect = (router.query.redirect as string) || '/dashboard/statistics';
      router.replace(redirect);
    } else {
      queueMicrotask(() => {
        setIsGuest(true);
      });
    }
  }, [router]);

  if (!isGuest) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGuard;
