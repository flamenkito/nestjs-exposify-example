import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  createUser,
  fetchUsers,
  loading,
  selectedUser,
  showCreateForm,
  stopEditing,
  updateUser,
} from '../hooks/useJsonRpc';
import type { User } from '../types/user';

function getButtonText(isLoading: boolean, isEditing: boolean): string {
  if (isLoading) {
    return isEditing ? 'Saving...' : 'Creating...';
  }
  return isEditing ? 'Save' : 'Create';
}

interface UserFormProps {
  readonly user: User | undefined;
}

export function UserForm({ user }: UserFormProps) {
  const name = useSignal(user ? user.name : '');
  const email = useSignal(user ? user.email : '');
  const formError = useSignal<string | null>(null);

  // Update form when user prop changes
  useEffect(() => {
    name.value = user ? user.name : '';
    email.value = user ? user.email : '';
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
        void fetchUsers();
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
      <form onSubmit={(e) => void handleSubmit(e)} class="create-form">
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
          {getButtonText(loading.value, !!user)}
        </button>
      </form>
    </div>
  );
}
