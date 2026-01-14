import { Component, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthStateService } from './services/auth-state.service';
import { UsersService } from '../generated';
import { LoginFormComponent } from './components/login-form.component';
import { UserListComponent } from './components/user-list.component';
import { UserFormComponent } from './components/user-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginFormComponent, UserListComponent, UserFormComponent],
  template: `
    @if (!auth.isAuthenticated()) {
      <app-login-form />
    } @else {
      <div class="container">
        <header class="header">
          <h1>Users</h1>
          <div class="user-info">
            <span>Welcome, {{ auth.currentUser()?.name }}</span>
            <button class="secondary" (click)="auth.logout()">Logout</button>
          </div>
        </header>

        @if (usersResource.error()) {
          <div class="error">{{ usersResource.error() }}</div>
        }

        <div class="actions">
          <button class="secondary" (click)="usersResource.reload()" [disabled]="usersResource.isLoading()">
            {{ usersResource.isLoading() ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <app-user-list [users]="usersResource.value()" [loading]="usersResource.isLoading()" />
        <app-user-form (created)="usersResource.reload()" />
      </div>
    }
  `,
})
export class AppComponent {
  readonly auth = inject(AuthStateService);
  private readonly usersService = inject(UsersService);

  usersResource = resource({
    loader: () => firstValueFrom(this.usersService.getUsers()),
  });
}
