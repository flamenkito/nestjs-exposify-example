import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { byId } from '@example/utils';
import { UserResource, UsersFacade } from '~/generated';
import { UserCardComponent } from './user-card.component';
import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'app-user-list',
  imports: [UserCardComponent, UserFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="user-list-container">
      <div class="table-wrapper">
        <table class="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            @if (loading() && !users()?.length) {
              <tr>
                <td colspan="2" class="table-placeholder">Loading users...</td>
              </tr>
            } @else if (!users()?.length) {
              <tr>
                <td colspan="2" class="table-placeholder">No users found</td>
              </tr>
            } @else {
              @for (user of users(); track user.id) {
                <tr [class.selected]="isSelected(user)" (click)="selectUser(user)">
                  <td>{{ user.attributes.name }}</td>
                  <td>{{ user.attributes.email }}</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      @if (showCreateForm()) {
        <app-user-form (created)="onCreated()" />
      } @else if (editing()) {
        <app-user-form [user]="selectedUser()!" (created)="onUpdated()" />
      } @else if (selectedUser()) {
        <app-user-card
          [user]="selectedUser()!"
          [deleting]="deleting()"
          (edit)="editing.set(true)"
          (delete)="onDelete()"
        />
      }
    </div>
  `,
})
export class UserListComponent {
  private readonly usersFacade = inject(UsersFacade);

  users = input<UserResource[] | undefined>();

  loading = input(false);

  showCreateForm = input(false);

  created = output<void>();

  deleted = output<void>();

  userSelected = output<void>();

  selectedUser = signal<UserResource | null>(null);

  deleting = signal(false);

  editing = signal(false);

  constructor() {
    effect(() => {
      if (this.showCreateForm()) {
        this.selectedUser.set(null);
      }
    });
  }

  isSelected(user: UserResource): boolean {
    const selected = this.selectedUser();
    return selected !== null && byId(selected.id)(user);
  }

  selectUser(user: UserResource) {
    if (this.isSelected(user)) {
      this.selectedUser.set(null);
    } else {
      this.selectedUser.set(user);
      this.userSelected.emit();
    }
  }

  onCreated() {
    this.created.emit();
  }

  onUpdated() {
    this.editing.set(false);
    this.selectedUser.set(null);
    this.created.emit();
  }

  onDelete() {
    const user = this.selectedUser();
    if (!user) return;

    this.deleting.set(true);
    this.usersFacade.deleteUser({ id: user.id }).subscribe({
      next: () => {
        this.deleting.set(false);
        this.selectedUser.set(null);
        this.deleted.emit();
      },
      error: () => {
        this.deleting.set(false);
      },
    });
  }
}
