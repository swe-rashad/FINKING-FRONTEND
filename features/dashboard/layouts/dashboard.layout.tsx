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

const SIDEBAR_COLLAPSED_KEY = 'finking_sidebar_collapsed';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [collapsed, setCollapsed] = useLocalStorageBoolean(SIDEBAR_COLLAPSED_KEY);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
            {children}
          </div>
        </main>
      </section>
    </AuthGuard>
  );
}
