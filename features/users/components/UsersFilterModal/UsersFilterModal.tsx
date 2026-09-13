import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/common/button';
import { Input, inputTypesEnum } from '@/shared/components/common/Input';
import CloseIcon from '@/features/dashboard/components/icons/CloseIcon';
import FilterIcon from '@/features/dashboard/components/icons/FilterIcon';
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
  const [name, setName] = useState(filters.name || '');
  const [email, setEmail] = useState(filters.email || '');
  const [role, setRole] = useState(filters.role || 'all');
  const [status, setStatus] = useState(filters.status || 'all');

  useEffect(() => {
    if (!isOpen) return;
    queueMicrotask(() => {
      setName(filters.name || '');
      setEmail(filters.email || '');
      setRole(filters.role || 'all');
      setStatus(filters.status || 'all');
    });
  }, [isOpen, filters]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-7 relative z-10 border border-gray-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <FilterIcon size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {t('users.filterModal.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
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
            <div>
              <label
                htmlFor="filter-role"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                {t('users.filterModal.roleLabel')}
              </label>
              <select
                id="filter-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
              >
                <option value="all">{t('users.filterModal.allRoles')}</option>
                <option value="Customer">{t('users.roles.customer')}</option>
                <option value="Employee">{t('users.roles.employee')}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-status"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                {t('users.filterModal.statusLabel')}
              </label>
              <select
                id="filter-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
              >
                <option value="all">{t('users.filterModal.allStatuses')}</option>
                <option value="Active">{t('users.status.active')}</option>
                <option value="Blocked">{t('users.status.blocked')}</option>
              </select>
            </div>
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
