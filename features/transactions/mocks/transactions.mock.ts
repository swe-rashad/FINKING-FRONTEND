import { defineMock } from '@alova/mock';
import { paginateMock } from '@/core/utils/mock-pagination';
import type { TransactionItem } from '../interfaces/transaction.interface';

export const mockTransactionsData: TransactionItem[] = [
  {
    id: 'TXN-904812',
    no: 1,
    sender: 'Lucas Weber',
    receiver: 'BNP Paribas',
    amount: '€1,450.00',
    date: '12 Sep 2026, 14:20',
    type: 'Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-904813',
    no: 2,
    sender: 'Emma Watson',
    receiver: 'Deutsche Bank',
    amount: '€320.50',
    date: '12 Sep 2026, 13:05',
    type: 'Payment',
    status: 'Pending',
  },
  {
    id: 'TXN-904814',
    no: 3,
    sender: 'Alexandre Dupont',
    receiver: 'Barclays UK',
    amount: '€2,800.00',
    date: '11 Sep 2026, 18:45',
    type: 'Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-904815',
    no: 4,
    sender: 'Sofia Rossi',
    receiver: 'Revolut Ltd',
    amount: '€75.20',
    date: '11 Sep 2026, 16:12',
    type: 'Top-up',
    status: 'Failed',
  },
  {
    id: 'TXN-904816',
    no: 5,
    sender: 'Matteo Müller',
    receiver: 'Siemens AG',
    amount: '€4,120.00',
    date: '10 Sep 2026, 11:30',
    type: 'Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-904817',
    no: 6,
    sender: 'Camille Laurent',
    receiver: 'TotalEnergies',
    amount: '€89.00',
    date: '10 Sep 2026, 09:14',
    type: 'Payment',
    status: 'Completed',
  },
  {
    id: 'TXN-904818',
    no: 7,
    sender: 'Oliver Davies',
    receiver: 'Vodafone Group',
    amount: '€25.00',
    date: '09 Sep 2026, 20:00',
    type: 'Top-up',
    status: 'Completed',
  },
  {
    id: 'TXN-904819',
    no: 8,
    sender: 'Elena Garcia',
    receiver: 'Banco Santander',
    amount: '€630.00',
    date: '09 Sep 2026, 15:40',
    type: 'Transfer',
    status: 'Pending',
  },
  {
    id: 'TXN-904820',
    no: 9,
    sender: 'Lars Lindqvist',
    receiver: 'IKEA Supply AG',
    amount: '€1,180.00',
    date: '28 Aug 2026, 10:15',
    type: 'Payment',
    status: 'Completed',
  },
  {
    id: 'TXN-904821',
    no: 10,
    sender: 'Chloe Martin',
    receiver: 'Air France-KLM',
    amount: '€540.00',
    date: '15 Jul 2026, 08:30',
    type: 'Payment',
    status: 'Completed',
  },
  {
    id: 'TXN-904822',
    no: 11,
    sender: 'Jan De Vries',
    receiver: 'ING Group',
    amount: '€3,250.00',
    date: '22 Jun 2026, 17:10',
    type: 'Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-904823',
    no: 12,
    sender: 'Anja Schmidt',
    receiver: 'N26 Bank',
    amount: '€120.00',
    date: '14 May 2026, 11:25',
    type: 'Top-up',
    status: 'Completed',
  },
  {
    id: 'TXN-904824',
    no: 13,
    sender: 'Finn O\'Connor',
    receiver: 'Ryanair DAC',
    amount: '€185.00',
    date: '03 Apr 2026, 19:40',
    type: 'Payment',
    status: 'Completed',
  },
  {
    id: 'TXN-904825',
    no: 14,
    sender: 'Giulia Bianchi',
    receiver: 'Enel SpA',
    amount: '€95.50',
    date: '19 Mar 2026, 14:05',
    type: 'Payment',
    status: 'Completed',
  },
  {
    id: 'TXN-904826',
    no: 15,
    sender: 'Henrik Nielsen',
    receiver: 'Danske Bank',
    amount: '€2,400.00',
    date: '11 Feb 2026, 12:20',
    type: 'Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-904827',
    no: 16,
    sender: 'Clara Moreau',
    receiver: 'Crédit Agricole',
    amount: '€150.00',
    date: '25 Jan 2026, 09:50',
    type: 'Top-up',
    status: 'Completed',
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

  '[GET]/api/transactions/{id}': ({ params }) => {
    const txn =
      mockTransactionsData.find((t) => t.id === params.id) ||
      mockTransactionsData[0];

    return {
      ...txn,
      currency: 'EUR',
      merchantName: `${txn.receiver} (topup)`,
      amount: txn.amount.replace(/[^0-9.]/g, '') || '20.00',
      operationType: 'Purchase',
      statusDescription: 'Payment approved',
      cardMasked: '523915******8748',
      rrn: '602912253898',
      operationId: '260129022658452734',
      merchantId: '1201563',
      orderId: '56738073',
      subMerchantId: '202006593',
      mcc: '6012',
      terminalId: 'POST6593',
      reversal: 'YES',
      terminalSerialId: 'V1E03307',
      threeDSecure: 'NO',
    };
  },

  '[GET]/api/transactions': ({ query }) => {
    let filtered = [...mockTransactionsData];

    if (query.sender) {
      const sender = String(query.sender).toLowerCase();
      filtered = filtered.filter((t) => t.sender.toLowerCase().includes(sender));
    }

    if (query.receiver) {
      const receiver = String(query.receiver).toLowerCase();
      filtered = filtered.filter((t) => t.receiver.toLowerCase().includes(receiver));
    }

    if (query.status && query.status !== 'all') {
      const status = String(query.status).toLowerCase();
      filtered = filtered.filter((t) => t.status.toLowerCase() === status);
    }

    if (query.type && query.type !== 'all') {
      const type = String(query.type).toLowerCase();
      filtered = filtered.filter((t) => t.type.toLowerCase() === type);
    }

    if (query.minAmount) {
      const min = parseFloat(String(query.minAmount));
      if (!isNaN(min)) {
        filtered = filtered.filter((t) => {
          const num = parseFloat(t.amount.replace(/[^0-9.]/g, '')) || 0;
          return num >= min;
        });
      }
    }

    if (query.maxAmount) {
      const max = parseFloat(String(query.maxAmount));
      if (!isNaN(max)) {
        filtered = filtered.filter((t) => {
          const num = parseFloat(t.amount.replace(/[^0-9.]/g, '')) || 0;
          return num <= max;
        });
      }
    }

    return paginateMock(filtered, query);
  },
});
