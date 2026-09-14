import { alovaInstance } from '@/core/api/alova';
import type {
  TransactionItem,
  TransactionDetailsItem,
  TransactionsFilters,
} from '../interfaces/transaction.interface';

export interface PaginatedTransactionsResponse {
  data: TransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionExportResponse {
  data: string;
  filename: string;
  total: number;
}

export const transactionsApi = {
  getTransactions(page = 1, limit = 10, filters?: Partial<TransactionsFilters>) {
    return alovaInstance.Get<PaginatedTransactionsResponse>('/api/transactions', {
      params: {
        page,
        limit,
        ...(filters?.status && filters.status !== 'all' ? { status: filters.status } : {}),
        ...(filters?.type && filters.type !== 'all' ? { type: filters.type } : {}),
        ...(filters?.sender ? { sender: filters.sender } : {}),
        ...(filters?.receiver ? { receiver: filters.receiver } : {}),
        ...(filters?.minAmount ? { minAmount: filters.minAmount } : {}),
        ...(filters?.maxAmount ? { maxAmount: filters.maxAmount } : {}),
      },
    });
  },

  getTransactionById(id: string) {
    return alovaInstance.Get<TransactionDetailsItem>(`/api/transactions/${id}`);
  },

  exportTransactions(format: 'csv' | 'json' = 'csv', email?: string) {
    return alovaInstance.Get<TransactionExportResponse>('/api/transactions/export', {
      params: { format, email },
    });
  },
};
