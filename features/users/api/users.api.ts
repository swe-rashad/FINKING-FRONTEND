import { alovaInstance } from '@/core/api/alova';
import type {
  UserItem,
  PaginatedResponse,
  CreateUserDto,
  UpdateUserDto,
} from '../interfaces/user.interface';

export const usersApi = {
  getUsers(page = 1, limit = 10, search = '') {
    return alovaInstance.Get<PaginatedResponse<UserItem>>('/api/users', {
      params: { page, limit, search },
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
};
