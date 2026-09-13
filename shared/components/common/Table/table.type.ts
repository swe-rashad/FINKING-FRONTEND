import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: ReactNode;
  accessor?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  onRowClick?: (item: T, index: number) => void;
  rowClassName?: (item: T, index: number) => string;
  emptyMessage?: ReactNode;
  isLoading?: boolean;
  className?: string;
}
