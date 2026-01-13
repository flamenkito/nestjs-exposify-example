import { signal } from '@preact/signals';
import { login, loading, error } from '../hooks/useJsonRpc';

const email = signal('admin@example.com');
const password = signal('password');

export function LoginForm() {
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await login(email.value, password.value);
  };

  return (
    <div class="login-container">
      <div class="login-box">
        <h1>Login</h1>
        {error.value && <div class="error">{error.value}</div>}
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email.value}
              onInput={(e) => (email.value = (e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password.value}
              onInput={(e) => (password.value = (e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <button type="submit" class="primary" disabled={loading.value}>
            {loading.value ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p class="hint">Use: admin@example.com / password</p>
      </div>
    </div>
  );
}
