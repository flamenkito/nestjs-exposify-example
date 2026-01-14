import { useEffect } from 'preact/hooks';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import { LoginForm } from './components/LoginForm';
import {
  fetchUsers,
  error,
  loading,
  isAuthenticated,
  currentUser,
  logout,
} from './hooks/useJsonRpc';

export function App() {
  useEffect(() => {
    if (isAuthenticated.value) {
      fetchUsers();
    }
  }, [isAuthenticated.value]);

  if (!isAuthenticated.value) {
    return <LoginForm />;
  }

  return (
    <div class="container">
      <header class="header">
        <h1>Users</h1>
        <div class="user-info">
          <span>Welcome, {currentUser.value?.name}</span>
          <button class="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

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
