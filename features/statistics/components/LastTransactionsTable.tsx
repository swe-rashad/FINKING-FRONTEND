import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Table, Column } from '@/shared/components/common/Table';
import { Button } from '@/shared/components/common/Button';
import {
  ActiveIcon,
  DeclinedIcon,
  ArrowRightIcon,
} from '@/shared/components/icons';
import type {
  LastTransactionItem,
  TransactionTypeEnumType,
  TransactionStatusEnumType,
} from '../interfaces/statistics.interface';
import {
  formatCurrency,
  formatTransactionDate,
  CATEGORY_DISPLAY_NAMES,
} from '../utils/statistics.utils';
import { EmptyState } from './EmptyState';

interface LastTransactionsTableProps {
  transactions: LastTransactionItem[];
  rangePill: string;
  isLoading?: boolean;
}

function formatType(type: TransactionTypeEnumType) {
  const label = CATEGORY_DISPLAY_NAMES[type] || type;
  switch (type) {
    case 'transfer':
      return {
        label,
        className: 'bg-blue-50 text-blue-700',
      };
    case 'payment':
      return {
        label,
        className: 'bg-purple-50 text-purple-700',
      };
    case 'topup':
      return {
        label,
        className: 'bg-emerald-50 text-emerald-700',
      };
    default:
      return {
        label,
        className: 'bg-gray-100 text-gray-700',
      };
  }
}

export function LastTransactionsTable({
  transactions,
  rangePill,
  isLoading = false,
}: LastTransactionsTableProps) {
  const t = useTranslations('dashboard');

  const formatStatus = (status: TransactionStatusEnumType) => {
    switch (status) {
      case 'completed':
        return {
          label: t('statistics.status.active'),
          className: 'bg-[#E8F8EE] text-[#12B76A]',
          icon: <ActiveIcon size={14} className="text-[#12B76A]" />,
        };
      case 'failed':
        return {
          label: t('statistics.status.inactive'),
          className: 'bg-[#FEF3F2] text-[#F04438]',
          icon: <DeclinedIcon size={14} className="text-[#F04438]" />,
        };
      case 'pending':
      default:
        return {
          label: 'Pending',
          className: 'bg-amber-50 text-amber-700',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />,
        };
    }
  };

  const columns: Column<LastTransactionItem>[] = [
    {
      key: 'transactionId',
      header: t('statistics.columns.no'),
      width: '4.5rem',
      render: (item) => (
        <span className="text-gray-900 font-medium">#{item.transactionId}</span>
      ),
    },
    {
      key: 'merchant',
      header: 'Merchant / Counterparty',
      render: (item) => {
        const title = item.merchantName || item.receiver || item.sender;
        const sub = item.merchantName ? item.receiver || item.sender : item.sender;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{title}</span>
            {sub && sub !== title && (
              <span className="text-xs text-gray-400">{sub}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'type',
      header: t('statistics.columns.category'),
      render: (item) => {
        const typeInfo = formatType(item.type);
        return (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md ${typeInfo.className}`}
          >
            {typeInfo.label}
          </span>
        );
      },
    },
    {
      key: 'amount',
      header: t('statistics.columns.revenue'),
      render: (item) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(Number(item.amount) || 0, item.currency)}
        </span>
      ),
    },
    {
      key: 'dateOfOperation',
      header: 'Date',
      render: (item) => (
        <span className="text-gray-500 text-xs">
          {formatTransactionDate(item.dateOfOperation)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('statistics.columns.status'),
      render: (item) => {
        const statusInfo = formatStatus(item.status);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '3.5rem',
      render: (item) => (
        <div className="flex items-center justify-end w-full sm:w-auto">
          <Link
            href={`/dashboard/transactions/${item.transactionId}`}
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRightIcon size={14} />}
              iconPosition="right"
              className="w-full sm:hidden text-gray-700"
            >
              {t('statistics.actions.details')}
            </Button>
            <span
              title={t('statistics.actions.details')}
              aria-label={t('statistics.actions.viewDetails')}
              className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-auto cursor-pointer shrink-0"
            >
              <ArrowRightIcon size={16} />
            </span>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-900">Latest Operations</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-900">
            {rangePill}
          </span>
        </div>
        <p className="text-xs text-gray-400 font-medium">
          {t('statistics.rowCount', { count: transactions.length })}
        </p>
      </div>

      {transactions.length === 0 && !isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xs">
          <EmptyState
            title="No transactions found"
            description="There are no operations recorded for this selected time frame."
          />
        </div>
      ) : (
        <Table<LastTransactionItem>
          columns={columns}
          data={transactions}
          isLoading={isLoading}
          keyExtractor={(item) => item.transactionId}
          emptyMessage={
            <EmptyState
              title="No transactions found"
              description="There are no operations recorded for this selected time frame."
            />
          }
        />
      )}
    </div>
  );
}

export default LastTransactionsTable;
