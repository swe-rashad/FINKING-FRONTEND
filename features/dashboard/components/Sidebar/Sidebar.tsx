import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import LogoSvg from '@/assets/icons/logo.svg';
import LogoMarkSvg from '@/assets/icons/logo-mark.svg';
import NavItem from '@/features/dashboard/components/NavItem/NavItem';
import UsersIcon from '@/features/dashboard/components/icons/UsersIcon';
import TransactionsIcon from '@/features/dashboard/components/icons/TransactionsIcon';
import StatisticsIcon from '@/features/dashboard/components/icons/StatisticsIcon';
import SidebarArrowIcon from '@/features/dashboard/components/icons/SidebarArrowIcon';
import { CloseIcon } from '@/shared/components/icons';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  {
    href: '/dashboard/statistics',
    labelKey: 'layout.navs.statistics',
    icon: StatisticsIcon,
  },
  {
    href: '/dashboard/users',
    labelKey: 'layout.navs.users',
    icon: UsersIcon,
  },
  {
    href: '/dashboard/transactions',
    labelKey: 'layout.navs.transactions',
    icon: TransactionsIcon,
  },
] as const;

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const compact = collapsed && !mobileOpen;

  const toggleTitle = compact
    ? t('layout.sidebar.expand')
    : t('layout.sidebar.collapse');

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={onMobileClose}
          aria-label={t('layout.sidebar.close')}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        aria-label={t('layout.sidebar.navigation')}
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen || undefined}
        className={`z-50 box-border flex h-full shrink-0 flex-col bg-white px-4 py-8 transition-all duration-300 ease-in-out ${
          mobileOpen
            ? 'fixed inset-y-0 left-0 flex w-60 min-w-60 shadow-2xl'
            : 'relative hidden md:flex'
        } ${compact ? 'md:w-[4.5rem] md:min-w-[4.5rem]' : 'md:w-60 md:min-w-60'}`}
      >
        <div
          className={`mb-8 flex items-center ${
            compact ? 'justify-center' : 'justify-between px-2'
          }`}
        >
          <div className="flex items-center">
            {compact ? (
              <Image
                src={LogoMarkSvg}
                width={36}
                height={36}
                alt={t('layout.logoMarkAlt')}
                priority
                className="block h-8 w-8 object-contain"
              />
            ) : (
              <Image
                src={LogoSvg}
                width={150}
                height={34}
                alt={t('layout.logoAlt')}
                priority
                className="block h-8 w-auto object-contain"
              />
            )}
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            aria-label={t('layout.sidebar.close')}
            className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 md:hidden"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {!compact && (
            <span className="mb-1 px-3 text-xs font-semibold tracking-wider text-gray-400">
              {t('layout.products')}
            </span>
          )}
          <nav aria-label={t('layout.sidebar.navigation')} className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
              const text = t(labelKey);
              const active =
                router.pathname === href ||
                router.pathname.startsWith(`${href}/`);

              return (
                <NavItem
                  key={href}
                  href={href}
                  text={text}
                  active={active}
                  collapsed={compact}
                  icon={
                    <Icon
                      size={20}
                      className={active ? 'text-brand-main' : 'text-gray-500'}
                    />
                  }
                  onClick={onMobileClose}
                />
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={onToggle}
          title={toggleTitle}
          aria-label={toggleTitle}
          aria-pressed={collapsed}
          className="absolute -right-5 bottom-10 z-30 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-brand-main text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-brand-dark active:scale-95 md:flex"
        >
          <span
            className={`flex items-center justify-center transition-transform duration-300 ease-in-out ${
              compact ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <SidebarArrowIcon size={20} color="#FFFFFF" />
          </span>
        </button>
      </aside>
    </>
  );
}
