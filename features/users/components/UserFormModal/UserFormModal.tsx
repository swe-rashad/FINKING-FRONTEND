import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/common/Button';
import { Input, inputTypesEnum } from '@/shared/components/common/Input';
import { Select } from '@/shared/components/common/Select';
import { CloseIcon } from '@/shared/components/icons';
import { useEscapeKey, useLockBodyScroll } from '@/shared/hooks';
import type { UserItem, CreateUserDto, UserRole, UserStatus } from '../../interfaces/user.interface';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserItem | null;
  onSubmit: (data: CreateUserDto) => Promise<void>;
}

export function UserFormModal({ isOpen, onClose, user, onSubmit }: UserFormModalProps) {
  const t = useTranslations('dashboard');
  const tShared = useTranslations('shared');
  const isEdit = Boolean(user);

  const [username, setUsername] = useState(user?.username ?? '');
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'Customer');
  const [status, setStatus] = useState<UserStatus>(user?.status ?? 'Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEscapeKey(onClose, isOpen);
  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      setError(t('users.modal.validationError'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role,
        status,
      });
    } catch {
      setError(t('users.modal.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? t('users.modal.editTitle') : t('users.modal.createTitle')}
          </h2>
          <Button
            variant="secondary"
            onClick={onClose}
            aria-label={tShared('common.close')}
            className="w-9 h-9 !p-0 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <CloseIcon size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type={inputTypesEnum.Text}
              label={`${t('users.modal.usernameLabel')} *`}
              placeholder={t('users.modal.usernamePlaceholder')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              type={inputTypesEnum.Email}
              label={`${t('users.modal.emailLabel')} *`}
              placeholder={t('users.modal.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type={inputTypesEnum.Text}
              label={t('users.modal.firstNameLabel')}
              placeholder={t('users.modal.firstNamePlaceholder')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <Input
              type={inputTypesEnum.Text}
              label={t('users.modal.lastNameLabel')}
              placeholder={t('users.modal.lastNamePlaceholder')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="user-role-select"
              label={t('users.modal.roleLabel')}
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { value: 'Customer', label: t('users.roles.customer') },
                { value: 'Employee', label: t('users.roles.employee') },
              ]}
            />

            <Select
              id="user-status-select"
              label={t('users.modal.statusLabel')}
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              options={[
                { value: 'Active', label: t('users.status.active') },
                { value: 'Blocked', label: t('users.status.blocked') },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('users.actions.cancel')}
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={isSubmitting}
            >
              {isEdit ? t('users.modal.submitEdit') : t('users.modal.submitCreate')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;
