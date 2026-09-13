import { useMemo } from 'react';
import type { PaginationProps } from './pagination.type';
import { ArrowLeftIcon, ArrowRightIcon } from '@/features/dashboard/components/icons/ArrowIcons';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  siblingCount = 1,
  className = '',
}: PaginationProps) {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1 sm:gap-2 select-none py-6 ${className}`}
    >
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={previousLabel}
        className={`h-8 sm:h-9 px-2 sm:px-3 flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-150 ${
          isFirstPage
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer'
        }`}
      >
        <ArrowLeftIcon size={14} className="shrink-0" />
        <span className="hidden sm:inline">{previousLabel}</span>
      </button>

      <div className="flex items-center gap-1">
        {paginationRange.map((pageNumber, idx) => {
          if (pageNumber === '...') {
            return (
              <span
                key={`dots-${idx}`}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs sm:text-sm text-gray-400"
              >
                &#8230;
              </span>
            );
          }

          const page = pageNumber as number;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-white border border-gray-200/90 text-gray-900 font-semibold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={nextLabel}
        className={`h-8 sm:h-9 px-2 sm:px-3 flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-150 ${
          isLastPage
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer'
        }`}
      >
        <span className="hidden sm:inline">{nextLabel}</span>
        <ArrowRightIcon size={14} className="shrink-0" />
      </button>
    </nav>
  );
}

export default Pagination;
