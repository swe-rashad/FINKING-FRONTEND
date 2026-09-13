import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/features/dashboard';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { Button } from '@/shared/components/common/button';
import ExportIcon from '@/features/dashboard/components/icons/ExportIcon';
import EditIcon from '@/features/dashboard/components/icons/EditIcon';
import ActiveIcon from '@/features/dashboard/components/icons/ActiveIcon';
import DeclinedIcon from '@/features/dashboard/components/icons/DeclinedIcon';
import { UserFormModal } from '../components/UserFormModal';
import { usersApi } from '../api/users.api';
import type { UserDetailsItem, UpdateUserDto } from '../interfaces/user.interface';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['dashboard']);
  return { props: { messages } };
}

export default function UserDetailsPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<UserDetailsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    usersApi
      .getUserById(String(id))
      .send()
      .then((res) => {
        setUser(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load user details:', err);
        setIsLoading(false);
      });
  }, [id]);

  const handleUpdateUser = async (data: UpdateUserDto) => {
    if (!user) return;
    try {
      const updated = await usersApi.updateUser(user.id, data).send();
      setUser((prev) => (prev ? { ...prev, ...updated } : prev));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="w-full px-4 sm:px-8 pb-12 flex flex-col">
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3" />
            Loading user details...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-8 pb-12 flex flex-col max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium mb-4 text-gray-500">
          <Link
            href="/dashboard/users"
            className="text-primary-500 hover:text-primary-600 transition-colors"
          >
            {t('userDetails.breadcrumbParent')}
          </Link>
          <span className="text-gray-300 font-normal">&gt;</span>
          <span className="text-gray-800">{t('userDetails.breadcrumbCurrent')}</span>
        </nav>

        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {t('userDetails.title')}
          </h1>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={<ExportIcon size={16} />}
              onClick={() => {
                alert(`User details for ${user.username} shared.`);
              }}
              className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              {t('userDetails.actions.share')}
            </Button>

            <Button
              variant="primary"
              icon={<EditIcon size={16} />}
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2.5"
            >
              {t('userDetails.actions.edit')}
            </Button>
          </div>
        </div>

        {/* Two-Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Card: Main Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-6 pb-2 border-b border-gray-50">
              {t('userDetails.mainDetailsTitle')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.dateRegistered')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.registeredDate || '29.01.2026 16:14:24'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.role')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.role}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.username')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.username}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.status')}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  {user.status === 'Active' ? (
                    <ActiveIcon size={13} className="text-emerald-500" />
                  ) : (
                    <DeclinedIcon size={13} className="text-red-500" />
                  )}
                  {user.status}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.fullName')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.phone')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.phone || '+49 152 2345678'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.email')}
                </p>
                <p className="text-sm font-semibold text-gray-900 break-all">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.statusDescription')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.status === 'Active'
                    ? 'Verified & Approved'
                    : 'Account Restricted'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: Additional Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-6 pb-2 border-b border-gray-50">
              {t('userDetails.additionalDetailsTitle')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.userId')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {`USR-${String(user.id).padStart(6, '0')}`}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.accountTier')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.accountTier || 'Enterprise Business'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.kycVerification')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.kycStatus || 'Level 3 Completed'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.lastLogin')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.lastLogin || '14 Sep 2026, 01:15:22'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.country')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.country || 'European Union (DE)'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.ipAddress')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {user.ipAddress || '194.67.210.14'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.twoFactor')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.twoFactorEnabled || 'YES'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('userDetails.fields.branch')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.branch || 'Frankfurt Main Branch'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <UserFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onSubmit={handleUpdateUser}
        />
      </div>
    </DashboardLayout>
  );
}
