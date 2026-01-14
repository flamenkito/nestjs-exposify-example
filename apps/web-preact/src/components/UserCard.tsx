import type { User } from '../types/user';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div class="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p class="id">{user.id}</p>
    </div>
  );
}
