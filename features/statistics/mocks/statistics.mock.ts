import { defineMock } from '@alova/mock';
import type {
  StatisticsOverviewResponse,
  RevenueStatisticsDataType,
  CategoryDistributionStatisticsDataType,
  LastTransactionItem,
} from '../interfaces/statistics.interface';

const mockLastTransactions: LastTransactionItem[] = [
  {
    transactionId: 904812,
    sender: 'Lucas Weber',
    receiver: 'BNP Paribas',
    amount: 1450.0,
    currency: 'eur',
    type: 'transfer',
    status: 'completed',
    merchantName: 'BNP Paribas Transfer',
    dateOfOperation: new Date().toISOString(),
  },
  {
    transactionId: 904813,
    sender: 'Emma Watson',
    receiver: 'Deutsche Bank',
    amount: 320.5,
    currency: 'eur',
    type: 'payment',
    status: 'pending',
    merchantName: 'Deutsche Bank Checkout',
    dateOfOperation: new Date().toISOString(),
  },
  {
    transactionId: 904814,
    sender: 'Alexandre Dupont',
    receiver: 'Barclays UK',
    amount: 2800.0,
    currency: 'eur',
    type: 'transfer',
    status: 'completed',
    merchantName: 'Barclays Wire',
    dateOfOperation: new Date().toISOString(),
  },
];

export const mockStatisticsData: StatisticsOverviewResponse = {
  kpi: {
    totalRevenue: '€124,580.00',
    totalTransactions: '1,420',
    activeUsers: '890',
    avgTransaction: '€87.73',
  },
  monthlyRevenue: [
    { month: 'Jan', value: 45, label: '€2.3k' },
    { month: 'Feb', value: 85, label: '€4.2k' },
    { month: 'Mar', value: 120, label: '€6.0k' },
    { month: 'Apr', value: 95, label: '€4.8k' },
    { month: 'May', value: 160, label: '€8.0k' },
    { month: 'Jun', value: 140, label: '€7.0k' },
    { month: 'Jul', value: 200, label: '€10.0k' },
    { month: 'Aug', value: 180, label: '€9.0k' },
    { month: 'Sep', value: 230, label: '€11.5k' },
  ],
  categoryDistribution: [
    {
      name: 'Bank Transfers',
      type: 'transfer',
      percentage: 48,
      amount: '€59.8k',
      count: 680,
    },
    {
      name: 'Merchant Payments',
      type: 'payment',
      percentage: 32,
      amount: '€39.9k',
      count: 450,
    },
    {
      name: 'Account Top-ups',
      type: 'topup',
      percentage: 20,
      amount: '€24.9k',
      count: 290,
    },
  ],
  transactions: mockLastTransactions,
};

const mockRevenueOverview: RevenueStatisticsDataType = {
  period: 'yearly',
  data: [
    { date: '2026-01-01', currency: 'eur', value: 1450 },
    { date: '2026-02-01', currency: 'eur', value: 320.5 },
    { date: '2026-03-01', currency: 'eur', value: 2800 },
  ],
};

const mockCategoryDistribution: CategoryDistributionStatisticsDataType = {
  totalTransactions: 1420,
  data: [
    { type: 'transfer', value: 59800, transactionsCount: 680 },
    { type: 'payment', value: 39865.6, transactionsCount: 450 },
    { type: 'topup', value: 24914.4, transactionsCount: 290 },
  ],
};

export const statisticsMock = defineMock({
  '[GET]/api/statistics': () => mockStatisticsData,
  '[GET]/statistics/revenue-overview': () => mockRevenueOverview,
  '[GET]/statistics/category-distribution': () => mockCategoryDistribution,
  '[GET]/statistics/total-revenue': () => ({ value: 124580.0 }),
  '[GET]/statistics/total-transactions': () => ({ value: 1420 }),
  '[GET]/statistics/average-transaction-amount': () => ({ value: 87.73 }),
  '[GET]/statistics/active-users': () => ({ value: 890 }),
  '[GET]/statistics/get-last-transactions': () => mockLastTransactions,
  '[POST]/statistics/export': () => ({ data: 'mock_export_data', filename: 'statistics-export.csv' }),
});
