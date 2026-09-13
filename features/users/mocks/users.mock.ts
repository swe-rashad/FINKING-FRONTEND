import { defineMock } from '@alova/mock';
import { paginateMock } from '@/core/utils/mock-pagination';
import type { UserItem } from '../interfaces/user.interface';

const initialUsers: UserItem[] = [
  {
    id: 1,
    no: 1,
    username: 'Cavanshirhas',
    firstName: 'Cavanshir',
    lastName: 'Hasanov',
    email: 'cvnshr.mrmd@gmail.com',
    role: 'Customer',
    status: 'Active',
  },
  {
    id: 2,
    no: 2,
    username: 'Natiqsalam',
    firstName: 'Natiq',
    lastName: 'Salamov',
    email: 'natiq.salam@gmail.com',
    role: 'Employee',
    status: 'Blocked',
  },
  {
    id: 3,
    no: 3,
    username: 'Isfandiyarhas',
    firstName: 'Isfandiyar',
    lastName: 'Kahyayev',
    email: 'natiq.salam@gmail.com',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 4,
    no: 4,
    username: 'Cavanshirhas',
    firstName: 'Natiq',
    lastName: 'Hasanov',
    email: 'natiq.salam@gmail.com',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 5,
    no: 5,
    username: 'Natiqsalam',
    firstName: 'Isfandiyar',
    lastName: 'Salamov',
    email: 'natiq.salam@gmail.com',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 6,
    no: 6,
    username: 'Isfandiyarhas',
    firstName: 'Natiq',
    lastName: 'Kahyayev',
    email: 'isf.hsnv@gmail.com',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 7,
    no: 7,
    username: 'Cavanshirhas',
    firstName: 'Cavanshir',
    lastName: 'Hasanov',
    email: 'natiq.salam@gmail.com',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 8,
    no: 8,
    username: 'Natiqsalam',
    firstName: 'Natiq',
    lastName: 'Salamov',
    email: 'natiq.salam@gmail.com',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 9,
    no: 9,
    username: 'Cavanshirhas',
    firstName: 'Isfandiyar',
    lastName: 'Hasanov',
    email: 'cvnshr.mrmd@gmail.com',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 10,
    no: 10,
    username: 'Isfandiyarhas',
    firstName: 'Cavanshir',
    lastName: 'Kahyayev',
    email: 'natiq.salam@gmail.com',
    role: 'Customer',
    status: 'Active',
  },
];

const usersStore: UserItem[] = [...initialUsers];

export const usersMock = defineMock({
  '[GET]/api/users/export': ({ query }) => {
    const format = (query?.format as string) || 'csv';
    if (format === 'json') {
      return {
        data: JSON.stringify(usersStore, null, 2),
        filename: 'users-export.json',
        total: usersStore.length,
      };
    }
    const headers = ['No', 'Username', 'First Name', 'Last Name', 'Email', 'Role', 'Status'];
    const rows = usersStore.map((u, idx) => [
      idx + 1,
      `"${u.username}"`,
      `"${u.firstName || ''}"`,
      `"${u.lastName || ''}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return {
      data: csvContent,
      filename: 'users-export.csv',
      total: usersStore.length,
    };
  },

  '[GET]/api/users': ({ query }) => {
    let filtered = usersStore;
    if (query.search) {
      const search = String(query.search).toLowerCase();
      filtered = usersStore.filter(
        (u) =>
          u.username.toLowerCase().includes(search) ||
          u.firstName.toLowerCase().includes(search) ||
          u.lastName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }

    return paginateMock(filtered, query, { totalOverride: 50 });
  },

  '[POST]/api/users': ({ data }) => {
    const newId = Date.now();
    const newUser: UserItem = {
      id: newId,
      no: usersStore.length + 1,
      username: data.username,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email,
      role: data.role || 'Customer',
      status: data.status || 'Active',
    };
    usersStore.unshift(newUser);
    return newUser;
  },

  '[PUT]/api/users/{id}': ({ params, data }) => {
    const numericId = Number(params.id);
    const index = usersStore.findIndex((u) => u.id === numericId);
    if (index !== -1) {
      usersStore[index] = {
        ...usersStore[index],
        ...data,
        id: numericId,
      };
      return usersStore[index];
    }
    return { id: numericId, ...data };
  },

  '[DELETE]/api/users/{id}': ({ params }) => {
    const numericId = Number(params.id);
    const index = usersStore.findIndex((u) => u.id === numericId);
    if (index !== -1) {
      const deleted = usersStore.splice(index, 1)[0];
      return deleted;
    }
    return { id: numericId };
  },
});
