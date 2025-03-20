import { QUERIES } from '@/lib/queries';

export default async function Users() {
  const users = await QUERIES.getUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.display_name} (@{user.username})
          </li>
        ))}
      </ul>
    </div>
  );
}
