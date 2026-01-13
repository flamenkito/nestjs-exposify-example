import { useEffect } from 'preact/hooks';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import { fetchUsers, error, loading } from './hooks/useJsonRpc';

export function App() {
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div class="container">
      <h1>Users</h1>

      {error.value && <div class="error">{error.value}</div>}

      <div class="actions">
        <button class="secondary" onClick={fetchUsers} disabled={loading.value}>
          {loading.value ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <UserList />
      <UserForm />
    </div>
  );
}
