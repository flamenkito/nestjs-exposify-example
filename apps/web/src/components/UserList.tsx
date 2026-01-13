import { users, loading } from '../hooks/useJsonRpc';
import { UserCard } from './UserCard';

export function UserList() {
  if (loading.value && users.value.length === 0) {
    return <p class="loading">Loading users...</p>;
  }

  if (users.value.length === 0) {
    return <p class="empty">No users found. Create one below!</p>;
  }

  return (
    <div class="user-grid">
      {users.value.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
