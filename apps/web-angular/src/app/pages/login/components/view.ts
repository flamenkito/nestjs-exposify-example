import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../services/auth-state.service';
import { SignalInputDirective } from '../../../shared/signal-input.directive';

@Component({
  selector: 'app-login',
  imports: [SignalInputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-container">
      <div class="login-box">
        <div class="login-brand">
          <img src="exposify-logo.png" alt="Exposify" class="login-logo" />
        </div>
        @if (auth.loginResource.error()) {
          <div class="error">{{ auth.loginResource.error() }}</div>
        }
        <form (submit)="handleSubmit($event)">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [signal]="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [signal]="password" required />
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
export class View {
  private readonly router = inject(Router);

  readonly auth = inject(AuthStateService);

  email = signal('admin@example.com');

  password = signal('password');

  constructor() {
    effect(() => {
      if (this.auth.loginResource.value()) {
        void this.router.navigate(['']);
      }
    });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.auth.login(this.email(), this.password());
  }
}
