import React from 'react';
import { useTranslations } from 'next-intl';
import type { StatisticsKpiData } from '../interfaces/statistics.interface';

interface StatisticsKpiCardsProps {
  kpi: StatisticsKpiData;
  rangePill: string;
  isLoading?: boolean;
}

export function StatisticsKpiCards({
  kpi,
  rangePill,
  isLoading = false,
}: StatisticsKpiCardsProps) {
  const t = useTranslations('dashboard');

  const cards = [
    {
      key: 'totalRevenue',
      label: t('statistics.kpi.totalRevenue'),
      value: kpi.totalRevenue,
    },
    {
      key: 'totalTransactions',
      label: t('statistics.kpi.totalTransactions'),
      value: kpi.totalTransactions,
    },
    {
      key: 'activeUsers',
      label: t('statistics.kpi.activeUsers'),
      value: kpi.activeUsers,
    },
    {
      key: 'avgTransaction',
      label: t('statistics.kpi.avgTransaction'),
      value: kpi.avgTransaction,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
              {card.label}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-900 shrink-0">
              {rangePill}
            </span>
          </div>

          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                {card.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatisticsKpiCards;
