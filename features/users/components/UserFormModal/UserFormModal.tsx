import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/common/button';
import { Input, inputTypesEnum } from '@/shared/components/common/Input';
import CloseIcon from '@/features/dashboard/components/icons/CloseIcon';
import type { UserItem, CreateUserDto, UserRole, UserStatus } from '../../interfaces/user.interface';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserItem | null;
  onSubmit: (data: CreateUserDto) => Promise<void>;
}

export function UserFormModal({ isOpen, onClose, user, onSubmit }: UserFormModalProps) {
  const t = useTranslations('dashboard');
  const isEdit = Boolean(user);

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Customer');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status);
    } else {
      setUsername('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('Customer');
      setStatus('Active');
    }
    setError(null);
  }, [user, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      setError('Please fill out all required fields.');
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
      setError('An error occurred while saving.');
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
        style={{ animation: 'fadeInUp 0.2s ease-out' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? t('users.modal.editTitle') : t('users.modal.createTitle')}
          </h2>
          <Button
            variant="secondary"
            onClick={onClose}
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
              placeholder="e.g. cavanshirhas"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              type={inputTypesEnum.Email}
              label={`${t('users.modal.emailLabel')} *`}
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type={inputTypesEnum.Text}
              label={t('users.modal.firstNameLabel')}
              placeholder="e.g. Cavanshir"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <Input
              type={inputTypesEnum.Text}
              label={t('users.modal.lastNameLabel')}
              placeholder="e.g. Hasanov"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <p className="text-sm mb-1 font-medium text-gray-700">
                {t('users.modal.roleLabel')}
              </p>
              <div className="h-12 relative box-border rounded-xl bg-form-element-bg border border-transparent focus-within:border-primary-500 focus-within:bg-white transition-all">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-full box-border px-4 rounded-xl text-sm text-gray-900 bg-transparent outline-none cursor-pointer"
                >
                  <option value="Customer">Customer</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm mb-1 font-medium text-gray-700">
                {t('users.modal.statusLabel')}
              </p>
              <div className="h-12 relative box-border rounded-xl bg-form-element-bg border border-transparent focus-within:border-primary-500 focus-within:bg-white transition-all">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full h-full box-border px-4 rounded-xl text-sm text-gray-900 bg-transparent outline-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
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
