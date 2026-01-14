import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { createUser, updateUser, loading, showCreateForm, stopEditing, fetchUsers, selectedUser } from '../hooks/useJsonRpc';
import type { User } from '../types/user';

interface UserFormProps {
  user?: User;
}

export function UserForm({ user }: UserFormProps) {
  const name = useSignal(user?.name ?? '');
  const email = useSignal(user?.email ?? '');
  const formError = useSignal<string | null>(null);

  // Update form when user prop changes
  useEffect(() => {
    name.value = user?.name ?? '';
    email.value = user?.email ?? '';
    formError.value = null;
  }, [user?.id]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!name.value.trim() || !email.value.trim()) return;

    formError.value = null;

    if (user) {
      // Update existing user
      const result = await updateUser(user.id, name.value.trim(), email.value.trim());

      if (result) {
        name.value = '';
        email.value = '';
        stopEditing();
        selectedUser.value = null;
        fetchUsers();
      }
    } else {
      // Create new user
      const result = await createUser(name.value.trim(), email.value.trim());

      if (result) {
        name.value = '';
        email.value = '';
        showCreateForm.value = false;
      }
    }
  };

  return (
    <div class="user-card">
      <h3>{user ? 'Edit User' : 'Create User'}</h3>
      {formError.value && <div class="error">{formError.value}</div>}
      <form onSubmit={handleSubmit} class="create-form">
        <input
          type="text"
          placeholder="Name"
          value={name.value}
          onInput={(e) => (name.value = (e.target as HTMLInputElement).value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email.value}
          onInput={(e) => (email.value = (e.target as HTMLInputElement).value)}
        />
        <button type="submit" class="primary" disabled={loading.value}>
          {loading.value
            ? user
              ? 'Saving...'
              : 'Creating...'
            : user
              ? 'Save'
              : 'Create'}
        </button>
      </form>
    </div>
  );
}
