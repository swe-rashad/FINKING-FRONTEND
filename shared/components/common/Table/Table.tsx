import { ReactNode } from 'react';
import type { TableProps } from './table.type';

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  rowClassName,
  emptyMessage = 'No data available',
  isLoading = false,
  className = '',
}: TableProps<T>) {
  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="hidden md:block w-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                {columns.map((column) => {
                  const alignClass = getAlignClass(column.align);
                  return (
                    <th
                      key={column.key}
                      style={column.width ? { width: column.width } : undefined}
                      className={`px-4 py-3.5 text-xs font-semibold text-gray-900 ${alignClass} ${column.headerClassName ?? ''}`}
                    >
                      {column.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const rowKey = keyExtractor(item, index);
                  const customRowClass = rowClassName ? rowClassName(item, index) : '';

                  return (
                    <tr
                      key={rowKey}
                      onClick={() => onRowClick?.(item, index)}
                      className={`border-b border-gray-100/80 last:border-b-0 transition-colors duration-150 ${
                        onRowClick ? 'cursor-pointer hover:bg-gray-50/70' : 'hover:bg-gray-50/40'
                      } ${customRowClass}`}
                    >
                      {columns.map((column) => {
                        const alignClass = getAlignClass(column.align);
                        let cellContent: ReactNode = null;

                        if (column.render) {
                          cellContent = column.render(item, index);
                        } else if (column.accessor) {
                          cellContent = String(item[column.accessor] ?? '');
                        }

                        return (
                          <td
                            key={column.key}
                            style={column.width ? { width: column.width } : undefined}
                            className={`px-4 py-3.5 text-sm ${alignClass} ${column.className ?? ''}`}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-400 shadow-xs">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
              <span>Loading...</span>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-400 shadow-xs">
            {emptyMessage}
          </div>
        ) : (
          data.map((item, index) => {
            const rowKey = keyExtractor(item, index);
            const customRowClass = rowClassName ? rowClassName(item, index) : '';

            return (
              <div
                key={rowKey}
                onClick={() => onRowClick?.(item, index)}
                className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col gap-2.5 transition-colors ${
                  onRowClick ? 'cursor-pointer active:bg-gray-50' : ''
                } ${customRowClass}`}
              >
                {columns.map((column) => {
                  let cellContent: ReactNode = null;
                  if (column.render) {
                    cellContent = column.render(item, index);
                  } else if (column.accessor) {
                    cellContent = String(item[column.accessor] ?? '');
                  }

                  if (!column.header) {
                    return (
                      <div key={column.key} className="flex items-center justify-end pt-2.5 mt-1 border-t border-gray-100">
                        {cellContent}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={column.key}
                      className="flex items-center justify-between text-sm py-0.5"
                    >
                      <span className="text-xs font-semibold text-gray-500">{column.header}</span>
                      <div className="font-medium text-gray-900 text-right">{cellContent}</div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Table;
