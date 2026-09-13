import { alovaInstance } from '@/core/api/alova';
import type {
  UserItem,
  PaginatedResponse,
  CreateUserDto,
  UpdateUserDto,
  UsersFilters,
} from '../interfaces/user.interface';

export interface UserExportResponse {
  data: string;
  filename: string;
  total: number;
}

export const usersApi = {
  getUsers(page = 1, limit = 10, filters?: Partial<UsersFilters>) {
    return alovaInstance.Get<PaginatedResponse<UserItem>>('/api/users', {
      params: {
        page,
        limit,
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.role && filters.role !== 'all' ? { role: filters.role } : {}),
        ...(filters?.status && filters.status !== 'all' ? { status: filters.status } : {}),
      },
    });
  },

  createUser(data: CreateUserDto) {
    return alovaInstance.Post<UserItem>('/api/users', data);
  },

  updateUser(id: number, data: UpdateUserDto) {
    return alovaInstance.Put<UserItem>(`/api/users/${id}`, data);
  },

  deleteUser(id: number) {
    return alovaInstance.Delete<UserItem>(`/api/users/${id}`);
  },

  exportUsers(format: 'csv' | 'json' = 'csv', email?: string) {
    return alovaInstance.Get<UserExportResponse>('/api/users/export', {
      params: { format, email },
    });
  },
};
