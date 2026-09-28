import React from 'react';
import { useTranslations } from 'next-intl';
import type { CategoryDistributionItem } from '../interfaces/statistics.interface';
import { EmptyState } from './EmptyState';

interface CategoryDistributionCardProps {
  categoryDistribution: CategoryDistributionItem[];
  rangePill: string;
  isLoading?: boolean;
}

export function CategoryDistributionCard({
  categoryDistribution,
  rangePill,
  isLoading = false,
}: CategoryDistributionCardProps) {
  const t = useTranslations('dashboard');

  const hasData = categoryDistribution.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            {t('statistics.charts.categoryBreakdown')}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {t('statistics.charts.categorySubtitle')}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-900">
          {rangePill}
        </span>
      </div>

      {isLoading ? (
        <div className="w-full h-44 sm:h-52 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <div className="py-6">
          <EmptyState
            title="No category distribution"
            description="No transaction categories were found for the selected period."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 my-auto">
          {categoryDistribution.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{cat.amount}</span>
                  <span className="text-gray-400 font-medium">
                    ({cat.percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(0, cat.percentage))}%`,
                    backgroundColor: 'var(--color-brand-main)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryDistributionCard;
