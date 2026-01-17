import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <header class="header">
        <div class="header-content">
          <div class="brand">
            <img src="exposify-logo.png" alt="Exposify" class="brand-logo" />
            <h1>{{ title() }}</h1>
          </div>
          <div class="user-info">
            <span>Welcome, {{ auth.currentUser()?.name }}</span>
            <button class="secondary" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
        @if (loading()) {
          <div class="progress-bar">
            <div class="progress-bar-indeterminate"></div>
          </div>
        }
      </header>

      <ng-content />
    </div>
  `,
})
export class LayoutComponent {
  private readonly router = inject(Router);
  readonly auth = inject(AuthStateService);

  title = input('');
  loading = input(false);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
