import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import UserIcon from '@/features/dashboard/components/icons/UserIcon';
import ChevronDownIcon from '@/features/dashboard/components/icons/ChevronDownIcon';
import LogoutIcon from '@/features/dashboard/components/icons/LogoutIcon';

interface UserProfileDropdownProps {
  name?: string;
  company?: string;
}

export default function UserProfileDropdown({
  name,
  company,
}: UserProfileDropdownProps) {
  const t = useTranslations('dashboard');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const displayName = name ?? t('layout.userProfile.defaultName');
  const displayCompany = company ?? t('layout.userProfile.defaultCompany');

  useClickOutside(ref, useCallback(() => setOpen(false), []));

  function handleLogout() {
    setOpen(false);
    router.push('/auth/login');
  }

  return (
    <div ref={ref} className="relative">
      <button
        id="user-profile-dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer select-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--color-brand-lightest)' }}
        >
          <UserIcon size={18} color="var(--color-brand-main)" />
        </div>

        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-gray-900">{displayName}</span>
          <span className="text-xs text-gray-400">{displayCompany}</span>
        </div>

        <span className="hidden sm:inline-flex">
          <ChevronDownIcon
            size={16}
            color="#9ca3af"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
          />
        </span>
      </button>

      {open && (
        <div
          id="user-profile-dropdown-menu"
          role="menu"
          className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden"
          style={{ animation: 'fadeInUp 0.15s ease both' }}
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{displayCompany}</p>
          </div>

          <button
            id="user-profile-logout-btn"
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
          >
            <LogoutIcon size={16} />
            {t('layout.userProfile.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
