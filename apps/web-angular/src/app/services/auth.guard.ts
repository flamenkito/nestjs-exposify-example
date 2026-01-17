import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

export const authGuard = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
