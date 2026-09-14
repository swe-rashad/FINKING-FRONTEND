import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/common/Button';
import { Input, inputTypesEnum } from '@/shared/components/common/Input';
import { Select } from '@/shared/components/common/Select';
import { CloseIcon, FilterIcon } from '@/shared/components/icons';
import { useEscapeKey, useLockBodyScroll } from '@/shared/hooks';
import type { UsersFilters } from '../../interfaces/user.interface';

interface UsersFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: UsersFilters;
  onApply: (filters: Partial<UsersFilters>) => void;
  onReset: () => void;
}

export function UsersFilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: UsersFilterModalProps) {
  const t = useTranslations('dashboard');
  const tShared = useTranslations('shared');
  const [name, setName] = useState(filters.name || '');
  const [email, setEmail] = useState(filters.email || '');
  const [role, setRole] = useState(filters.role || 'all');
  const [status, setStatus] = useState(filters.status || 'all');

  useEscapeKey(onClose, isOpen);
  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onApply({
      name: name.trim(),
      email: email.trim(),
      role,
      status,
    });
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setRole('all');
    setStatus('all');
    onReset();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="users-filter-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-7 relative z-10 border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <FilterIcon size={18} />
            </div>
            <h2 id="users-filter-title" className="text-lg font-bold text-gray-900">
              {t('users.filterModal.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tShared('common.close')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {t('users.filterModal.description')}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="filter-name"
            name="name"
            type={inputTypesEnum.Text}
            label={t('users.filterModal.nameLabel')}
            placeholder={t('users.filterModal.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            id="filter-email"
            name="email"
            type={inputTypesEnum.Email}
            label={t('users.filterModal.emailLabel')}
            placeholder={t('users.filterModal.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              id="filter-role"
              name="role"
              label={t('users.filterModal.roleLabel')}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'all', label: t('users.filterModal.allRoles') },
                { value: 'Customer', label: t('users.roles.customer') },
                { value: 'Employee', label: t('users.roles.employee') },
              ]}
            />

            <Select
              id="filter-status"
              name="status"
              label={t('users.filterModal.statusLabel')}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'all', label: t('users.filterModal.allStatuses') },
                { value: 'Active', label: t('users.status.active') },
                { value: 'Blocked', label: t('users.status.blocked') },
              ]}
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleReset}
            >
              {t('users.filterModal.reset')}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onClose}
              >
                {t('users.filterModal.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
              >
                {t('users.filterModal.apply')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
