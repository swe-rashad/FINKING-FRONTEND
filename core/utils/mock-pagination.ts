export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginateMock<T>(
  items: T[],
  query?: Record<string, unknown>,
  options?: { defaultLimit?: number; totalOverride?: number }
): PaginatedResult<T> {
  const page = Math.max(Number(query?.page) || 1, 1);
  const limit = Math.max(Number(query?.limit) || options?.defaultLimit || 10, 1);
  const total = options?.totalOverride ?? items.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const startIndex = (page - 1) * limit;
  const data = items.slice(
    startIndex % (items.length || 1),
    (startIndex % (items.length || 1)) + limit
  );

  return {
    data: data.length > 0 ? data : items.slice(0, limit),
    total,
    page,
    limit,
    totalPages,
  };
}
