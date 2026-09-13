import { defineMock } from '@alova/mock';
import { paginateMock } from '@/core/utils/mock-pagination';
import type { TransactionItem } from '../interfaces/transaction.interface';

const mockTransactionsData: TransactionItem[] = [
  {
    id: 'TXN-904812',
    no: 1,
    sender: 'Lucas Weber',
    receiver: 'BNP Paribas',
    amount: '$1,450.00',
    date: '12 Sep 2026, 14:20',
    type: 'Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-904813',
    no: 2,
    sender: 'Emma Watson',
    receiver: 'Deutsche Bank',
    amount: '$320.50',
    date: '12 Sep 2026, 13:05',
    type: 'Payment',
    status: 'Pending',
  },
  {
    id: 'TXN-904814',
    no: 3,
    sender: 'Alexandre Dupont',
    receiver: 'Barclays UK',
    amount: '$2,800.00',
    date: '11 Sep 2026, 18:45',
    type: 'Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-904815',
    no: 4,
    sender: 'Sofia Rossi',
    receiver: 'Revolut Ltd',
    amount: '$75.20',
    date: '11 Sep 2026, 16:12',
    type: 'Top-up',
    status: 'Failed',
  },
  {
    id: 'TXN-904816',
    no: 5,
    sender: 'Matteo Müller',
    receiver: 'Siemens AG',
    amount: '$4,120.00',
    date: '10 Sep 2026, 11:30',
    type: 'Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-904817',
    no: 6,
    sender: 'Camille Laurent',
    receiver: 'TotalEnergies',
    amount: '$89.00',
    date: '10 Sep 2026, 09:14',
    type: 'Payment',
    status: 'Completed',
  },
  {
    id: 'TXN-904818',
    no: 7,
    sender: 'Oliver Davies',
    receiver: 'Vodafone Group',
    amount: '$25.00',
    date: '09 Sep 2026, 20:00',
    type: 'Top-up',
    status: 'Completed',
  },
  {
    id: 'TXN-904819',
    no: 8,
    sender: 'Elena Garcia',
    receiver: 'Banco Santander',
    amount: '$630.00',
    date: '09 Sep 2026, 15:40',
    type: 'Transfer',
    status: 'Pending',
  },
];

export const transactionsMock = defineMock({
  '[GET]/api/transactions/export': ({ query }) => {
    const format = (query?.format as string) || 'csv';
    if (format === 'json') {
      return {
        data: JSON.stringify(mockTransactionsData, null, 2),
        filename: 'transactions-export.json',
        total: mockTransactionsData.length,
      };
    }
    const headers = ['ID', 'No', 'Sender', 'Receiver', 'Amount', 'Date', 'Type', 'Status'];
    const rows = mockTransactionsData.map((t) => [
      `"${t.id}"`,
      t.no,
      `"${t.sender}"`,
      `"${t.receiver}"`,
      `"${t.amount}"`,
      `"${t.date}"`,
      `"${t.type}"`,
      `"${t.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return {
      data: csvContent,
      filename: 'transactions-export.csv',
      total: mockTransactionsData.length,
    };
  },

  '[GET]/api/transactions': ({ query }) => {
    return paginateMock(mockTransactionsData, query);
  },
});
