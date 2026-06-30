import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {ROUTE_URLS} from '../core/constants/routes.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree([ROUTE_URLS.LOGIN], {
    queryParams: { returnUrl: state.url }
  });
};
