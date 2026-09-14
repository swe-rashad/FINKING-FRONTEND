import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useClickOutside, useEscapeKey } from '@/shared/hooks';
import { UserIcon, ChevronDownIcon, LogoutIcon } from '@/shared/components/icons';
import { tokenService } from '@/core/auth/token.service';
import { authApi } from '@/features/auth/api/auth.api';
import type { UserProfile } from '@/features/auth/interfaces/auth.interface';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let cancelled = false;

    authApi
      .getProfile()
      .send()
      .then((res) => {
        if (!cancelled && res?.name) {
          setProfile(res);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = name ?? profile?.name ?? t('layout.userProfile.defaultName');
  const displayCompany =
    company ?? profile?.company ?? t('layout.userProfile.defaultCompany');

  useClickOutside(ref, close);
  useEscapeKey(close, open);

  function handleLogout() {
    close();
    tokenService.clearTokens();
    router.replace('/auth/login');
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer select-none items-center gap-2.5 rounded-xl p-1 transition-colors duration-200 hover:bg-gray-100 sm:px-3 sm:py-2"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('layout.userProfile.menuLabel')}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-lightest">
          <UserIcon size={20} className="text-brand-main" />
        </div>

        <div className="hidden flex-col items-start leading-tight sm:flex">
          <span className="text-sm font-semibold text-gray-900">{displayName}</span>
          <span className="text-xs text-gray-400">{displayCompany}</span>
        </div>

        <span className="hidden sm:inline-flex">
          <ChevronDownIcon
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1 shadow-lg [animation:fadeInUp_0.15s_ease_both]"
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="truncate text-xs text-gray-400">{displayCompany}</p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 transition-colors duration-150 hover:bg-red-50"
          >
            <LogoutIcon size={16} />
            {t('layout.userProfile.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
