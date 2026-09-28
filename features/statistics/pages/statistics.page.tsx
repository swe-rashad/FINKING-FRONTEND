import { useState } from 'react';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { DateRangePicker } from '@/shared/components/common/DateRangePicker';
import { useStatistics } from '../hooks';
import {
  StatisticsKpiCards,
  RevenueTrendChart,
  CategoryDistributionCard,
  LastTransactionsTable,
} from '../components';
import { getFormattedRangePill } from '../utils/statistics.utils';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['dashboard']);
  return { props: { messages } };
}

export default function StatisticsPage() {
  const t = useTranslations('dashboard');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-09-30');

  const {
    transactions,
    monthlyRevenue,
    categoryDistribution,
    kpi,
    period,
    isLoading,
    hoveredPoint,
    setHoveredPoint,
  } = useStatistics({ startDate, endDate });

  const rangePill = getFormattedRangePill(startDate, endDate);

  return (
    <>
      <Head>
        <title>{t('statistics.title')}</title>
      </Head>

      <div className="w-full px-4 sm:px-6 pb-12 flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {t('statistics.title')}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-900">
              {rangePill}
            </span>
          </div>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            maxDays={365}
            onChange={({ start, end }) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>

        {/* KPI Cards Grid */}
        <StatisticsKpiCards
          kpi={kpi}
          rangePill={rangePill}
          isLoading={isLoading}
        />

        {/* Charts and Distribution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueTrendChart
            monthlyRevenue={monthlyRevenue}
            rangePill={rangePill}
            period={period}
            hoveredPoint={hoveredPoint}
            onHoverPoint={setHoveredPoint}
            isLoading={isLoading}
          />

          <CategoryDistributionCard
            categoryDistribution={categoryDistribution}
            rangePill={rangePill}
            isLoading={isLoading}
          />
        </div>

        {/* Real Transactions Table with Empty State */}
        <LastTransactionsTable
          transactions={transactions}
          rangePill={rangePill}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
