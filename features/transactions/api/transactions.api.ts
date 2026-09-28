import { alovaInstance } from '@/core/api/alova';
import type {
  TransactionDetailsItem,
  TransactionsFilters,
  PaginatedTransactionsResponse,
} from '../interfaces/transaction.interface';

export interface TransactionExportResponse {
  data: string;
  filename: string;
  total: number;
}

export const transactionsApi = {
  getTransactions(
    page = 1,
    limit = 10,
    filters?: Partial<TransactionsFilters>
  ) {
    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (filters?.sender) params.sender = filters.sender;
    if (filters?.receiver) params.receiver = filters.receiver;
    if (filters?.merchantName) params.merchantName = filters.merchantName;
    if (filters?.currency) params.currency = filters.currency;
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters?.dateTo) params.dateTo = filters.dateTo;

    if (filters?.status && (filters.status as string) !== 'all') {
      params.status = String(filters.status).toLowerCase();
    }
    if (filters?.type && (filters.type as string) !== 'all') {
      params.type = String(filters.type).toLowerCase();
    }
    if (filters?.minAmount) params.minAmount = filters.minAmount;
    if (filters?.maxAmount) params.maxAmount = filters.maxAmount;

    return alovaInstance.Get<PaginatedTransactionsResponse>('/transactions', {
      params,
    });
  },

  getTransactionById(id: string | number) {
    return alovaInstance.Get<TransactionDetailsItem>(`/transactions/${id}`);
  },

  exportTransactions(payload?: Record<string, unknown>) {
    return alovaInstance.Post<TransactionExportResponse>('/transactions/export', payload || {});
  },
};
