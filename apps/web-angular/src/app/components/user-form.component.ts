import { Component, inject, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService, UserDto } from '../../generated';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="user-card">
      <h3>{{ user() ? 'Edit User' : 'Create User' }}</h3>
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      <form (ngSubmit)="handleSubmit()" class="create-form">
        <input
          type="text"
          placeholder="Name"
          [(ngModel)]="name"
          name="name"
          required
        />
        <input
          type="email"
          placeholder="Email"
          [(ngModel)]="email"
          name="email"
          required
        />
        <button type="submit" class="primary" [disabled]="loading()">
          {{ loading() ? (user() ? 'Saving...' : 'Creating...') : (user() ? 'Save' : 'Create') }}
        </button>
      </form>
    </div>
  `,
})
export class UserFormComponent {
  private readonly usersService = inject(UsersService);

  user = input<UserDto>();
  created = output<void>();

  name = signal('');
  email = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.name.set(u.name);
        this.email.set(u.email);
      }
    });
  }

  handleSubmit() {
    const nameVal = this.name().trim();
    const emailVal = this.email().trim();
    if (!nameVal || !emailVal) return;

    this.loading.set(true);
    this.error.set(null);

    const u = this.user();
    const request$ = u
      ? this.usersService.updateUser({ id: u.id, name: nameVal, email: emailVal })
      : this.usersService.createUser({ name: nameVal, email: emailVal });

    request$.subscribe({
      next: () => {
        this.name.set('');
        this.email.set('');
        this.loading.set(false);
        this.created.emit();
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
