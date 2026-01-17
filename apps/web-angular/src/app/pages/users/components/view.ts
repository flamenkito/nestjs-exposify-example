import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '../../../../generated';
import { AuthStateService } from '../../../services/auth-state.service';
import { LayoutComponent } from '../../../shared/layout.component';
import { UserListComponent } from './user-list.component';

@Component({
  selector: 'app-users',
  imports: [LayoutComponent, UserListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-layout title="Users" [loading]="usersResource.isLoading()">
      @if (usersResource.error()) {
        <div class="error">{{ usersResource.error() }}</div>
      }

      <div class="actions">
        <button class="primary icon-only" (click)="showCreateForm.set(!showCreateForm())" title="Create User">
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
        </button>
        <button class="secondary" (click)="usersResource.reload()" [disabled]="usersResource.isLoading()">
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
            [class.spin]="usersResource.isLoading()"
          >
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
        (userSelected)="showCreateForm.set(false)"
      />
    </app-layout>
  `,
})
export class View {
  readonly auth = inject(AuthStateService);

  private readonly usersService = inject(UsersService);

  showCreateForm = signal(false);

  usersResource = resource({
    params: () => (this.auth.isAuthenticated() ? {} : undefined),
    loader: () => firstValueFrom(this.usersService.getUsers()),
  });

  onUserCreated() {
    this.showCreateForm.set(false);
    this.usersResource.reload();
  }
}
