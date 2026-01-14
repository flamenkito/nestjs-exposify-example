import { Component, inject, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthStateService } from './services/auth-state.service';
import { UsersService } from '../generated';
import { LoginFormComponent } from './components/login-form.component';
import { UserListComponent } from './components/user-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginFormComponent, UserListComponent],
  template: `
    @if (!auth.isAuthenticated()) {
      <app-login-form />
    } @else {
      <div class="container">
        <header class="header">
          <div class="header-content">
            <div class="brand">
              <img src="exposify-logo.png" alt="Exposify" class="brand-logo" />
              <h1>Users</h1>
            </div>
            <div class="user-info">
              <span>Welcome, {{ auth.currentUser()?.name }}</span>
              <button class="secondary" (click)="auth.logout()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
          @if (usersResource.isLoading()) {
            <div class="progress-bar">
              <div class="progress-bar-indeterminate"></div>
            </div>
          }
        </header>

        @if (usersResource.error()) {
          <div class="error">{{ usersResource.error() }}</div>
        }

        <div class="actions">
          <button class="primary icon-only" (click)="showCreateForm.set(!showCreateForm())" title="Create User">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button class="secondary" (click)="usersResource.reload()" [disabled]="usersResource.isLoading()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.spin]="usersResource.isLoading()">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Refresh
          </button>
        </div>

        <app-user-list
          [users]="usersResource.value()"
          [loading]="usersResource.isLoading()"
          [showCreateForm]="showCreateForm()"
          (created)="onUserCreated()"
          (deleted)="usersResource.reload()"
          (userSelected)="showCreateForm.set(false)" />
      </div>
    }
  `,
})
export class AppComponent {
  readonly auth = inject(AuthStateService);
  private readonly usersService = inject(UsersService);

  showCreateForm = signal(false);

  usersResource = resource({
    loader: () => firstValueFrom(this.usersService.getUsers()),
  });

  onUserCreated() {
    this.showCreateForm.set(false);
    this.usersResource.reload();
  }
}
