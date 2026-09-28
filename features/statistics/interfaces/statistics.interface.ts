// NestJS DTO Models & Types from FINKING-BACKEND

export interface GetStatisticsDto {
  startDate?: string | Date;
  endDate?: string | Date;
}

export const RevenuePeriodEnum = {
  Weekly: 'weekly',
  Monthly: 'monthly',
  Yearly: 'yearly',
} as const;

export type RevenuePeriodEnumType =
  (typeof RevenuePeriodEnum)[keyof typeof RevenuePeriodEnum];

export const currencyEnum = {
  Eur: 'eur',
  Usd: 'usd',
  Gbp: 'gbp',
} as const;

export type CurrencyEnumType =
  (typeof currencyEnum)[keyof typeof currencyEnum];

export const transactionTypeEnum = {
  Payment: 'payment',
  TopUp: 'topup',
  Transfer: 'transfer',
} as const;

export type TransactionTypeEnumType =
  (typeof transactionTypeEnum)[keyof typeof transactionTypeEnum];

export const transactionStatusEnum = {
  Failed: 'failed',
  Completed: 'completed',
  Pending: 'pending',
} as const;

export type TransactionStatusEnumType =
  (typeof transactionStatusEnum)[keyof typeof transactionStatusEnum];

export interface RevenueStatisticsItem {
  date?: string;
  currency: CurrencyEnumType;
  value: number;
}

export interface RevenueStatisticsDataType {
  period: RevenuePeriodEnumType;
  data: RevenueStatisticsItem[];
}

export interface CategoryDistributionItemData {
  type: TransactionTypeEnumType;
  value: number;
  transactionsCount: number;
}

export interface CategoryDistributionStatisticsDataType {
  totalTransactions: number;
  data: CategoryDistributionItemData[];
}

export interface TotalRevenueResponse {
  value: number | string;
}

export interface TotalTransactionsResponse {
  value: number;
}

export interface AverageTransactionAmountResponse {
  value: number;
}

export interface ActiveUsersResponse {
  value: number;
}

export interface LastTransactionItem {
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
}

// UI Models

export interface MonthlyRevenueItem {
  month: string;
  value: number;
  label: string;
}

export interface CategoryDistributionItem {
  name: string;
  type: TransactionTypeEnumType;
  percentage: number;
  amount: string;
  count: number;
}

export interface StatisticsKpiData {
  totalRevenue: string;
  totalTransactions: string;
  activeUsers: string;
  avgTransaction: string;
}

export interface StatisticsOverviewResponse {
  transactions: LastTransactionItem[];
  monthlyRevenue: MonthlyRevenueItem[];
  categoryDistribution: CategoryDistributionItem[];
  kpi: StatisticsKpiData;
  period?: RevenuePeriodEnumType;
}
