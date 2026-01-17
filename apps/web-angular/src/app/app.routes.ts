import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        loadChildren: () => import('./pages/login/routes').then(m => m.default)
      },
      {
        path: 'users',
        canActivate: [authGuard],
        loadChildren: () => import('./pages/users/routes').then(m => m.default)
      },
      {
        path: '**',
        redirectTo: 'users',
      }
    ]
  }
];
