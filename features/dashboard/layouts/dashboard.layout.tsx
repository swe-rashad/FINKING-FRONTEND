import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Sidebar from '@/features/dashboard/components/Sidebar/Sidebar';
import UserProfileDropdown from '@/features/dashboard/components/UserProfileDropdown/UserProfileDropdown';
import MenuToggleIcon from '@/features/dashboard/components/icons/MenuToggleIcon';
import LogoSvg from '@/assets/icons/logo.svg';
import { AuthGuard } from '@/shared/components/guards';
import {
  useEscapeKey,
  useLocalStorageBoolean,
  useLockBodyScroll,
} from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { fetchCurrentUser } from '@/features/auth';
import { getDefaultDashboardRoute, hasPermission } from '@/core/auth/permissions';

const SIDEBAR_COLLAPSED_KEY = 'finking_sidebar_collapsed';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [collapsed, setCollapsed] = useLocalStorageBoolean(SIDEBAR_COLLAPSED_KEY);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    const closeMobileSidebar = () => setMobileSidebarOpen(false);
    router.events.on('routeChangeComplete', closeMobileSidebar);
    return () => {
      router.events.off('routeChangeComplete', closeMobileSidebar);
    };
  }, [router.events]);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  useEscapeKey(closeMobileSidebar, mobileSidebarOpen);
  useLockBodyScroll(mobileSidebarOpen);

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, [setCollapsed]);

  const isAllowed = hasPermission(currentUser, router.pathname);

  return (
    <AuthGuard>
      <section className="relative flex h-screen w-full overflow-hidden bg-gray-50">
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={closeMobileSidebar}
        />
        <main className="flex h-full w-full flex-col overflow-hidden md:gap-6">
          <header className="z-30 flex h-20 min-h-20 w-full shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-xs sm:px-6 md:justify-end md:border-b-0 md:bg-transparent md:shadow-none">
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="-ml-1.5 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
                aria-label={t('layout.sidebar.open')}
                aria-expanded={mobileSidebarOpen}
                aria-controls="dashboard-sidebar"
              >
                <MenuToggleIcon size={24} />
              </button>
              <Image
                src={LogoSvg}
                width={155}
                height={40}
                alt={t('layout.logoAlt')}
                className="block h-10 w-auto object-contain"
                priority
              />
            </div>
            <UserProfileDropdown />
          </header>
          <div className="min-h-0 w-full flex-1 overflow-y-auto pt-3 md:pt-0">
            {isAllowed ? (
              children
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                  You do not have the required permissions to view this section. Please contact your administrator if you believe this is an error.
                </p>
                <button
                  type="button"
                  onClick={() => router.replace(getDefaultDashboardRoute(currentUser))}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-brand-main px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-dark"
                >
                  Return to Available Dashboard
                </button>
              </div>
            )}
          </div>
        </main>
      </section>
    </AuthGuard>
  );
}
