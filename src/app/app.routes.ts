import {Routes} from '@angular/router';
import {INFRA_ROUTES} from './core/constants/routes.constants';
import {authGuard} from './auth/auth.guard';

export const routes: Routes = [
  {
    path: INFRA_ROUTES.LOGIN,
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login),
  },
  {
    path: INFRA_ROUTES.DASHBOARD,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: INFRA_ROUTES.DASHBOARD,
  },
  {
    path: '**',
    redirectTo: INFRA_ROUTES.DASHBOARD,
  },
];
