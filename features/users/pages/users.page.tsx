import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/features/dashboard';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { Table, Column } from '@/shared/components/common/Table';
import { Pagination } from '@/shared/components/common/Pagination';
import { Button } from '@/shared/components/common/button';
import FilterIcon from '@/features/dashboard/components/icons/FilterIcon';
import ExportIcon from '@/features/dashboard/components/icons/ExportIcon';
import CreateUserIcon from '@/features/dashboard/components/icons/CreateUserIcon';
import ActiveIcon from '@/features/dashboard/components/icons/ActiveIcon';
import DeclinedIcon from '@/features/dashboard/components/icons/DeclinedIcon';
import EditIcon from '@/features/dashboard/components/icons/EditIcon';
import { useUsers } from '../hooks/useUsers';
import { usersApi } from '../api/users.api';
import { UserFormModal } from '../components/UserFormModal';
import { downloadFile } from '@/shared/utils/download';
import type { UserItem } from '../interfaces/user.interface';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['dashboard']);
  return { props: { messages } };
}

export default function UsersPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const {
    users,
    totalCount,
    currentPage,
    totalPages,
    isLoading,
    setPage,
    isCreateModalOpen,
    isEditModalOpen,
    activeUser,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    createUser,
    updateUser,
  } = useUsers();

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await usersApi.exportUsers('csv').send();
      if (res && res.data) {
        downloadFile(res.data, res.filename || 'users-export.csv');
      }
    } catch (err) {
      console.error('Failed to export users:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const columns: Column<UserItem>[] = [
    {
      key: 'no',
      header: t('users.columns.no'),
      width: '3.25rem',
      render: (item) => (
        <span
          className={item.status === 'Blocked' ? 'text-gray-400 font-normal' : 'text-gray-900 font-medium'}
        >
          {item.no}
        </span>
      ),
    },
    {
      key: 'username',
      header: t('users.columns.username'),
      render: (item) => (
        <span
          className={item.status === 'Blocked' ? 'text-gray-400 font-normal' : 'text-gray-900 font-medium'}
        >
          {item.username}
        </span>
      ),
    },
    {
      key: 'firstName',
      header: t('users.columns.firstName'),
      render: (item) => (
        <span className={item.status === 'Blocked' ? 'text-gray-400' : 'text-gray-600'}>
          {item.firstName}
        </span>
      ),
    },
    {
      key: 'lastName',
      header: t('users.columns.lastName'),
      render: (item) => (
        <span className={item.status === 'Blocked' ? 'text-gray-400' : 'text-gray-600'}>
          {item.lastName}
        </span>
      ),
    },
    {
      key: 'email',
      header: t('users.columns.email'),
      render: (item) => (
        <span className={item.status === 'Blocked' ? 'text-gray-400' : 'text-gray-600'}>
          {item.email}
        </span>
      ),
    },
    {
      key: 'role',
      header: t('users.columns.role'),
      render: (item) => (
        <span className={item.status === 'Blocked' ? 'text-gray-400' : 'text-gray-600'}>
          {item.role}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('users.columns.status'),
      render: (item) => {
        const isActive = item.status === 'Active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              isActive ? 'bg-[#E8F8EE] text-[#12B76A]' : 'bg-[#FEF3F2] text-[#F04438]'
            }`}
          >
            {isActive ? (
              <ActiveIcon size={14} className="text-[#12B76A]" />
            ) : (
              <DeclinedIcon size={14} className="text-[#F04438]" />
            )}
            <span>{item.status}</span>
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '5.5rem',
      render: (item) => (
        <div className="flex items-center justify-end ml-auto w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            icon={<EditIcon size={14} className="text-primary-500" />}
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(item);
            }}
            className="flex-1 sm:flex-initial text-primary-900 bg-primary-50 hover:bg-primary-100/80 border border-primary-200/60 font-semibold"
          >
            <span className="inline sm:hidden">{t('users.actions.editUser')}</span>
            <span className="hidden sm:inline">{t('users.actions.edit')}</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 pb-12 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {t('users.title')}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              icon={<FilterIcon size={16} />}
            >
              {t('users.actions.filter')}
            </Button>

            <Button
              variant="secondary"
              icon={<ExportIcon size={16} />}
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : t('users.actions.export')}
            </Button>

            <Button
              variant="primary"
              icon={<CreateUserIcon size={18} />}
              onClick={openCreateModal}
            >
              {t('users.actions.createUser')}
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-medium mb-3">
          {t('users.rowCount', { count: totalCount })}
        </p>

        <Table<UserItem>
          columns={columns}
          data={users}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => router.push(`/dashboard/users/${item.id}`)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          previousLabel={t('users.pagination.previous')}
          nextLabel={t('users.pagination.next')}
        />

        <UserFormModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSubmit={async (data) => {
            await createUser(data);
          }}
        />

        <UserFormModal
          isOpen={isEditModalOpen}
          user={activeUser}
          onClose={closeEditModal}
          onSubmit={async (data) => {
            if (activeUser) {
              await updateUser(activeUser.id, data);
            }
          }}
        />
      </div>
    </DashboardLayout>
  );
}
