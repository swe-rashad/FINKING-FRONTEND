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
