import { useEffect } from 'preact/hooks';
import { LoginForm } from './components/LoginForm';
import { UserList } from './components/UserList';
import { currentUser, error, fetchUsers, isAuthenticated, loading, logout, toggleCreateForm } from './hooks/useJsonRpc';

// SVG Icons
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={spinning ? 'spin' : ''}
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

export function App() {
  useEffect(() => {
    if (isAuthenticated.value) {
      void fetchUsers();
    }
  }, [isAuthenticated.value]);

  if (!isAuthenticated.value) {
    return <LoginForm />;
  }

  return (
    <div class="container">
      <header class="header">
        <div class="header-content">
          <div class="brand">
            <img src="exposify-logo.png" alt="Exposify" class="brand-logo" />
            <h1>Users</h1>
          </div>
          <div class="user-info">
            <span>Welcome, {currentUser.value?.name}</span>
            <button class="secondary" onClick={logout}>
              <LogoutIcon />
              Logout
            </button>
          </div>
        </div>
        {loading.value && (
          <div class="progress-bar">
            <div class="progress-bar-indeterminate"></div>
          </div>
        )}
      </header>

      {error.value && <div class="error">{error.value}</div>}

      <div class="actions">
        <button class="primary icon-only" onClick={toggleCreateForm} title="Create User">
          <PlusIcon />
        </button>
        <button class="secondary" onClick={() => void fetchUsers()} disabled={loading.value}>
          <RefreshIcon spinning={loading.value} />
          Refresh
        </button>
      </div>

      <UserList />
    </div>
  );
}
