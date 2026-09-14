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
import CloseIcon from '@/features/dashboard/components/icons/CloseIcon';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const t = useTranslations('dashboard');
  const router = useRouter();

  const navItems = [
    {
      href: '/dashboard/statistics',
      text: t('layout.navs.statistics'),
      icon: StatisticsIcon,
    },
    {
      href: '/dashboard/users',
      text: t('layout.navs.users'),
      icon: UsersIcon,
    },
    {
      href: '/dashboard/transactions',
      text: t('layout.navs.transactions'),
      icon: TransactionsIcon,
    },
  ];

  const toggleTitle = collapsed
    ? t('layout.sidebar.expand')
    : t('layout.sidebar.collapse');

  const handleNavClick = (href: string) => {
    router.push(href);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`h-full bg-white box-border flex flex-col py-8 px-4 transition-all duration-300 ease-in-out shrink-0 z-50 ${
          mobileOpen
            ? 'fixed inset-y-0 left-0 shadow-2xl flex w-60 min-w-60'
            : 'hidden md:flex relative'
        } ${collapsed ? 'md:w-[4.5rem] md:min-w-[4.5rem]' : 'md:w-60 md:min-w-60'}`}
      >
        <div className={`mb-8 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
          <div className="flex items-center">
            {collapsed ? (
              <Image
                src={LogoMarkSvg}
                width={36}
                height={36}
                alt={t('layout.logoMarkAlt')}
                priority
                className="h-8 w-8 object-contain block"
              />
            ) : (
              <Image
                src={LogoSvg}
                width={150}
                height={34}
                alt={t('layout.logoAlt')}
                priority
                className="h-8 w-auto object-contain block"
              />
            )}
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 md:hidden cursor-pointer"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          {!collapsed && (
            <span className="text-xs font-semibold text-gray-400 px-3 mb-1 tracking-wider">
              {t('layout.products')}
            </span>
          )}
          <nav className="flex flex-col gap-1">
            {navItems.map(({ href, text, icon: Icon }) => {
              const active = router.pathname === href;
              return (
                <NavItem
                  key={href}
                  text={collapsed ? '' : text}
                  active={active}
                  collapsed={collapsed}
                  icon={
                    <Icon
                      size={20}
                      color={active ? 'var(--color-brand-main)' : '#6B7280'}
                    />
                  }
                  onClick={() => handleNavClick(href)}
                />
              );
            })}
          </nav>
        </div>

        <button
          id="sidebar-toggle-btn"
          onClick={onToggle}
          title={toggleTitle}
          aria-label={toggleTitle}
          style={{ backgroundColor: 'var(--color-brand-main)' }}
          className="hidden md:flex absolute -right-5 bottom-10 w-10 h-10 rounded-full hover:bg-[var(--color-brand-dark)] text-white items-center justify-center shadow-md cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-30"
        >
          <span
            className="flex items-center justify-center transition-transform duration-300 ease-in-out"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <SidebarArrowIcon size={20} color="#FFFFFF" />
          </span>
        </button>
      </aside>
    </>
  );
}
