import type {
  CurrencyEnumType,
  TransactionTypeEnumType,
  TransactionStatusEnumType,
} from '@/features/statistics/interfaces/statistics.interface';

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';
export type TransactionType = 'Transfer' | 'Payment' | 'Top-up';

export interface GetTransactionsDto {
  page?: number;
  limit?: number;
  sender?: string;
  receiver?: string;
  currency?: CurrencyEnumType;
  type?: TransactionTypeEnumType;
  status?: TransactionStatusEnumType;
  dateFrom?: string;
  dateTo?: string;
  merchantName?: string;
  rrn?: number;
  operationId?: number;
  mcc?: number;
  merchantId?: number;
  terminalId?: string;
}

export interface BackendTransaction {
  transactionId: number;
  sender: string;
  receiver: string;
  amount: number;
  currency: CurrencyEnumType;
  type: TransactionTypeEnumType;
  status: TransactionStatusEnumType;
  dateOfOperation: string | Date;
  merchantName?: string;
  rrn?: string;
  operationId?: number;
  mcc?: number;
  merchantId?: number;
  terminalId?: string;
}

export interface TransactionItem {
  id: string;
  no: number;
  sender: string;
  receiver: string;
  amount: string;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
}

export interface TransactionDetailsItem extends TransactionItem {
  operationId?: string;
  merchantId?: string;
  merchantName?: string;
  subMerchantId?: string;
  orderId?: string;
  mcc?: string;
  terminalId?: string;
  terminalSerialId?: string;
  cardMasked?: string;
  rrn?: string;
  reversal?: string;
  threeDSecure?: string;
  statusDescription?: string;
  currency?: string;
  operationType?: string;
}

export interface TransactionsFilters {
  status: 'all' | TransactionStatus | TransactionStatusEnumType;
  type: 'all' | TransactionType | TransactionTypeEnumType;
  sender: string;
  receiver: string;
  minAmount?: string;
  maxAmount?: string;
  merchantName?: string;
  currency?: CurrencyEnumType;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedTransactionsResponse {
  data: (BackendTransaction | TransactionItem)[];
  total: number;
  totalItems?: number;
  page: number;
  limit: number;
  totalPages: number;
}
