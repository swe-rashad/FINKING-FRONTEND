import { alovaInstance } from '@/core/api/alova';
import type {
  BackendUser,
  CurrentUserResponse,
  PaginatedResponse,
  CreateUserDto,
  UpdateUserDto,
  UsersFilters,
  PaginationDto,
} from '../interfaces/user.interface';

export const usersApi = {
  getUsers(page = 1, limit = 10, filters?: Partial<UsersFilters & PaginationDto>) {
    return alovaInstance.Get<PaginatedResponse<BackendUser>>('/users', {
      params: {
        page,
        limit,
        ...(filters?.name ? { name: filters.name } : {}),
        ...(filters?.email ? { email: filters.email } : {}),
        ...(filters?.role && filters.role !== 'all' ? { role: filters.role } : {}),
        ...(filters?.status && filters.status !== 'all' ? { status: filters.status } : {}),
      },
    });
  },

  getUserById(id: number) {
    return alovaInstance.Get<BackendUser>(`/users/${id}`);
  },

  createUser(data: CreateUserDto) {
    return alovaInstance.Post<BackendUser>('/users/create', data);
  },

  updateUser(id: number, data: UpdateUserDto) {
    return alovaInstance.Patch<BackendUser>(`/users/${id}`, data);
  },

  blockUser(id: number) {
    return alovaInstance.Patch<BackendUser>(`/users/${id}/block`);
  },

  deleteUser(id: number) {
    return alovaInstance.Delete<void>(`/users/${id}`);
  },

  getCurrentUser() {
    return alovaInstance.Get<CurrentUserResponse>('/users/current');
  },
};
