import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { DashboardLayout, ExportModal } from '@/features/dashboard';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { Table, Column } from '@/shared/components/common/Table';
import { Pagination } from '@/shared/components/common/Pagination';
import { Button } from '@/shared/components/common/button';
import { useToast } from '@/shared/components/common/Toast';
import FilterIcon from '@/features/dashboard/components/icons/FilterIcon';
import ExportIcon from '@/features/dashboard/components/icons/ExportIcon';
import ActiveIcon from '@/features/dashboard/components/icons/ActiveIcon';
import DeclinedIcon from '@/features/dashboard/components/icons/DeclinedIcon';
import { ArrowRightIcon } from '@/features/dashboard/components/icons/ArrowIcons';
import type { TransactionItem } from '../interfaces/transaction.interface';
import { transactionsApi } from '../api/transactions.api';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['dashboard']);
  return { props: { messages } };
}

export default function TransactionsPage() {
  const router = useRouter();
  const t = useTranslations('dashboard');
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchTransactions = useCallback((page: number) => {
    transactionsApi
      .getTransactions(page, 10)
      .send()
      .then((res) => {
        setTransactions(res.data);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, fetchTransactions]);

  const handleExportSubmit = async (email: string, format: 'csv' | 'json') => {
    await transactionsApi.exportTransactions(format, email).send();
    showToast({
      type: 'success',
      title: t('exportModal.title'),
      message: t('exportModal.toastSuccess'),
    });
  };

  const columns: Column<TransactionItem>[] = [
    {
      key: 'no',
      header: t('transactions.columns.no'),
      width: '3.25rem',
      render: (item) => (
        <span className={item.status === 'Failed' ? 'text-gray-400 font-normal' : 'text-gray-900 font-medium'}>
          {item.no}
        </span>
      ),
    },
    {
      key: 'id',
      header: t('transactions.columns.id'),
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-gray-800">
          {item.id}
        </span>
      ),
    },
    {
      key: 'sender',
      header: t('transactions.columns.sender'),
      render: (item) => (
        <span className={item.status === 'Failed' ? 'text-gray-400' : 'text-gray-900 font-medium'}>
          {item.sender}
        </span>
      ),
    },
    {
      key: 'receiver',
      header: t('transactions.columns.receiver'),
      render: (item) => (
        <span className="text-gray-600">
          {item.receiver}
        </span>
      ),
    },
    {
      key: 'amount',
      header: t('transactions.columns.amount'),
      render: (item) => (
        <span className="font-semibold text-gray-900">
          {item.amount}
        </span>
      ),
    },
    {
      key: 'date',
      header: t('transactions.columns.date'),
      render: (item) => (
        <span className="text-gray-500 text-xs">
          {item.date}
        </span>
      ),
    },
    {
      key: 'type',
      header: t('transactions.columns.type'),
      render: (item) => (
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
          {item.type}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('transactions.columns.status'),
      render: (item) => {
        if (item.status === 'Completed') {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E8F8EE] text-[#12B76A]">
              <ActiveIcon size={14} className="text-[#12B76A]" />
              <span>{t('transactions.status.completed')}</span>
            </span>
          );
        }
        if (item.status === 'Pending') {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{t('transactions.status.pending')}</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FEF3F2] text-[#F04438]">
            <DeclinedIcon size={14} className="text-[#F04438]" />
            <span>{t('transactions.status.failed')}</span>
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '3rem',
      render: (item) => (
        <div className="flex items-center justify-end w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowRightIcon size={14} />}
            iconPosition="right"
            className="w-full sm:hidden text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/transactions/${item.id}`);
            }}
          >
            Details
          </Button>
          <button
            type="button"
            title="Details"
            aria-label="View transaction details"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/transactions/${item.id}`);
            }}
            className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-auto cursor-pointer shrink-0"
          >
            <ArrowRightIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>{`${t('transactions.title')} | FINKING`}</title>
      </Head>
      <div className="w-full px-4 sm:px-6 pb-12 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {t('transactions.title')}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              icon={<FilterIcon size={16} />}
            >
              {t('transactions.actions.filter')}
            </Button>

            <Button
              variant="secondary"
              icon={<ExportIcon size={16} />}
              onClick={() => setIsExportModalOpen(true)}
            >
              {t('transactions.actions.export')}
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-medium mb-3">
          {t('transactions.rowCount', { count: totalCount })}
        </p>

        <Table<TransactionItem>
          columns={columns}
          data={transactions}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => router.push(`/dashboard/transactions/${item.id}`)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          previousLabel={t('transactions.pagination.previous')}
          nextLabel={t('transactions.pagination.next')}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          title={t('transactions.title')}
          onSubmit={handleExportSubmit}
        />
      </div>
    </DashboardLayout>
  );
}