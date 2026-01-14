import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>Login</h1>
        @if (auth.loginResource.error()) {
          <div class="error">{{ auth.loginResource.error() }}</div>
        }
        <form (ngSubmit)="handleSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>
          <button type="submit" class="primary" [disabled]="auth.loginResource.isLoading()">
            {{ auth.loginResource.isLoading() ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p class="hint">Use: admin&#64;example.com / password</p>
      </div>
    </div>
  `,
})
export class LoginFormComponent {
  readonly auth = inject(AuthStateService);

  email = signal('admin@example.com');
  password = signal('password');

  handleSubmit() {
    this.auth.login(this.email(), this.password());
  }
}
