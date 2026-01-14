import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../generated';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-section">
      <h2>Create User</h2>
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      <form (ngSubmit)="handleSubmit()">
        <div class="form-row">
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
            {{ loading() ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class UserFormComponent {
  private readonly usersService = inject(UsersService);

  created = output<void>();

  name = signal('');
  email = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  handleSubmit() {
    const nameVal = this.name().trim();
    const emailVal = this.email().trim();
    if (!nameVal || !emailVal) return;

    this.loading.set(true);
    this.error.set(null);

    this.usersService.createUser({ name: nameVal, email: emailVal }).subscribe({
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
