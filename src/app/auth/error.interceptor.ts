import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {HttpErrorStateService} from '../core/api/http-error-state.service';
import {catchError, throwError} from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorState = inject(HttpErrorStateService);

  // TODO: clear the banner on a successful response (errorState.clear() in a
  // tap), otherwise a stale error message lingers after the next request succeeds.
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        errorState.setFromHttpError(error);
      }
      return throwError(() => error);
    })
  );
};
