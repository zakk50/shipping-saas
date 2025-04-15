import { fetchUsers } from '@/services/users';

const UsersPage = async () => {
  const users = await fetchUsers();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Список пользователей</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user: any) => (
            <li key={user._id} className="border p-2 rounded mb-2">
              <p><strong>Имя:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Роль:</strong> {user.role}</p>
            </li>
          ))
        ) : (
          <li>Нет пользователей</li>
        )}
      </ul>
    </div>
  );
};

export default UsersPage;
