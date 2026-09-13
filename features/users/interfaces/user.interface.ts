export type UserRole = 'Customer' | 'Employee';
export type UserStatus = 'Active' | 'Blocked';

export interface UserItem {
  id: number;
  no: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export type CreateUserDto = Omit<UserItem, 'id' | 'no'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
