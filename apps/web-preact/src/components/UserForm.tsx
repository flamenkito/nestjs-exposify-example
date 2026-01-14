import { signal } from '@preact/signals';
import { createUser, loading } from '../hooks/useJsonRpc';

const name = signal('');
const email = signal('');

export function UserForm() {
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!name.value.trim() || !email.value.trim()) return;

    const result = await createUser({
      name: name.value.trim(),
      email: email.value.trim(),
    });

    if (result) {
      name.value = '';
      email.value = '';
    }
  };

  return (
    <div class="form-section">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div class="form-row">
          <input
            type="text"
            placeholder="Name"
            value={name.value}
            onInput={(e) => (name.value = (e.target as HTMLInputElement).value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email.value}
            onInput={(e) => (email.value = (e.target as HTMLInputElement).value)}
            required
          />
          <button type="submit" class="primary" disabled={loading.value}>
            {loading.value ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
