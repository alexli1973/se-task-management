import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environments';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isApiRequest = req.url.startsWith(environment.apiBaseUrl);

  if (!token || !isApiRequest || req.headers.has('Authorization')) {
    return next(req);
  }

  const requestWithAuth = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(requestWithAuth);
};
