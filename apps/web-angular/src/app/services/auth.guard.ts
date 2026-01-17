import { inject } from '@angular/core';
import { AuthStateService } from './auth-state.service';

export const authGuard = (): boolean => {
  const auth = inject(AuthStateService);

  return auth.isAuthenticated();
};
