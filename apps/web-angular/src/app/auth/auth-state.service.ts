import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService, AuthUser, LoginDto, Role } from '~/generated';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly authService = inject(AuthService);

  readonly token = signal<string | null>(localStorage.getItem('token'));

  readonly currentUser = signal<AuthUser<Role> | null>(
    JSON.parse(localStorage.getItem('user') || 'null') as AuthUser<Role> | null,
  );

  readonly isAuthenticated = computed(() => !!this.token());

  private loginRequest = signal<LoginDto | undefined>(undefined);

  loginResource = resource({
    params: () => this.loginRequest(),
    loader: async ({ params }) => {
      if (!params) return undefined;
      const result = await firstValueFrom(this.authService.login(params));
      this.token.set(result.accessToken);
      this.currentUser.set(result.user);
      localStorage.setItem('token', result.accessToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result;
    },
  });

  login(email: string, password: string): void {
    this.loginRequest.set({ email, password });
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.loginRequest.set(undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
