import { defineMock } from '@alova/mock';
import { paginateMock } from '@/core/utils/mock-pagination';
import type { UserItem } from '../interfaces/user.interface';

const initialUsers: UserItem[] = [
  {
    id: 1,
    no: 1,
    username: 'lucasweber',
    firstName: 'Lucas',
    lastName: 'Weber',
    email: 'lucas.weber@company.de',
    role: 'Customer',
    status: 'Active',
  },
  {
    id: 2,
    no: 2,
    username: 'emmawatson',
    firstName: 'Emma',
    lastName: 'Watson',
    email: 'emma.watson@enterprise.co.uk',
    role: 'Employee',
    status: 'Blocked',
  },
  {
    id: 3,
    no: 3,
    username: 'alexdupont',
    firstName: 'Alexandre',
    lastName: 'Dupont',
    email: 'alexandre.dupont@banque.fr',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 4,
    no: 4,
    username: 'sofiarossi',
    firstName: 'Sofia',
    lastName: 'Rossi',
    email: 'sofia.rossi@finanza.it',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 5,
    no: 5,
    username: 'matteomueller',
    firstName: 'Matteo',
    lastName: 'Müller',
    email: 'matteo.mueller@corp.de',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 6,
    no: 6,
    username: 'camillelaurent',
    firstName: 'Camille',
    lastName: 'Laurent',
    email: 'camille.laurent@finance.fr',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 7,
    no: 7,
    username: 'oliverdavies',
    firstName: 'Oliver',
    lastName: 'Davies',
    email: 'oliver.davies@investments.co.uk',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 8,
    no: 8,
    username: 'elenagarcia',
    firstName: 'Elena',
    lastName: 'Garcia',
    email: 'elena.garcia@banco.es',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 9,
    no: 9,
    username: 'larslindqvist',
    firstName: 'Lars',
    lastName: 'Lindqvist',
    email: 'lars.lindqvist@nordic.se',
    role: 'Employee',
    status: 'Active',
  },
  {
    id: 10,
    no: 10,
    username: 'charlottedubois',
    firstName: 'Charlotte',
    lastName: 'Dubois',
    email: 'charlotte.dubois@capital.fr',
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
    let filtered = [...usersStore];
    if (query.name) {
      const name = String(query.name).toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(name) ||
          u.firstName.toLowerCase().includes(name) ||
          u.lastName.toLowerCase().includes(name) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(name)
      );
    }
    if (query.email) {
      const email = String(query.email).toLowerCase();
      filtered = filtered.filter((u) => u.email.toLowerCase().includes(email));
    }
    if (query.role && query.role !== 'all') {
      const role = String(query.role).toLowerCase();
      filtered = filtered.filter((u) => u.role.toLowerCase() === role);
    }
    if (query.status && query.status !== 'all') {
      const status = String(query.status).toLowerCase();
      filtered = filtered.filter((u) => u.status.toLowerCase() === status);
    }

    return paginateMock(filtered, query);
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
