import {HttpInterceptorFn} from '@angular/common/http';
import {authInterceptor} from '../../auth/auth.interceptor';
import {errorInterceptor} from '../../auth/error.interceptor';

export const httpInterceptors: HttpInterceptorFn[] = [
  authInterceptor,
  errorInterceptor
];
