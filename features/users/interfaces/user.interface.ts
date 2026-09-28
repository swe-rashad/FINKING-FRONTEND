import type { UserStatusEnumType, UserRolesEnumType } from '../types/user.type';

export interface BackendUser {
  id: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  email: string;
  name: string;
  lastname: string;
  verificated: boolean;
  status: UserStatusEnumType;
  role: UserRolesEnumType;
}

export type CurrentUserResponse = BackendUser;

export interface CreateUserDto {
  email: string;
  password?: string;
  name?: string;
  lastname?: string;
  verificated?: boolean;
  status?: UserStatusEnumType;
  role?: UserRolesEnumType;
}

export type UpdateUserDto = Partial<CreateUserDto>;

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersFilters {
  name: string;
  email: string;
  role: string;
  status: string;
}
