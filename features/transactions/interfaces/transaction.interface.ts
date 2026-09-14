export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';
export type TransactionType = 'Transfer' | 'Payment' | 'Top-up';

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
  status: 'all' | TransactionStatus;
  type: 'all' | TransactionType;
  sender: string;
  receiver: string;
  minAmount?: string;
  maxAmount?: string;
}

