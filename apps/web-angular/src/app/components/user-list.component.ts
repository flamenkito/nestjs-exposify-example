import { Component, input } from '@angular/core';
import { UserDto } from '../../generated';
import { UserCardComponent } from './user-card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent],
  template: `
    @if (loading() && !users()?.length) {
      <p class="loading">Loading users...</p>
    } @else if (!users()?.length) {
      <p class="empty">No users found. Create one below!</p>
    } @else {
      <div class="user-grid">
        @for (user of users(); track user.id) {
          <app-user-card [user]="user" />
        }
      </div>
    }
  `,
})
export class UserListComponent {
  users = input<UserDto[] | undefined>();
  loading = input(false);
}
