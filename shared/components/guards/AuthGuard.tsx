import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { tokenService } from '@/core/auth/token.service';
import { getPostLoginRedirect, getSafeRedirectPath } from '@/core/auth/safe-redirect';
import { useIsClient } from '@/shared/hooks';

interface AuthGuardProps {
  children: ReactNode;
}

function GuardSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
        {label ? (
          <span className="text-xs font-medium text-gray-400">{label}</span>
        ) : null}
      </div>
    </div>
  );
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const t = useTranslations('shared');
  const isClient = useIsClient();
  const isAuthorized = isClient && tokenService.isAuthenticated();

  useEffect(() => {
    if (!router.isReady || !isClient || isAuthorized) return;

    const redirectUrl = getPostLoginRedirect(router.asPath);
    router.replace(
      redirectUrl
        ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
        : '/auth/login'
    );
  }, [isAuthorized, isClient, router]);

  if (!isAuthorized) {
    return <GuardSpinner label={t('common.loading')} />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const isAuthenticated = isClient && tokenService.isAuthenticated();

  useEffect(() => {
    if (!router.isReady || !isClient || !isAuthenticated) return;
    router.replace(getSafeRedirectPath(router.query.redirect));
  }, [isAuthenticated, isClient, router]);

  if (!isClient || isAuthenticated) {
    return <GuardSpinner />;
  }

  return <>{children}</>;
}

export default AuthGuard;
