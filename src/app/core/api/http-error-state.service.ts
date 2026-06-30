import {computed, Injectable, signal} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorStateService {
  private readonly _message = signal<string | null>(null);
  readonly message = computed(() => this._message());

  setFromHttpError(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this._message.set('אין חיבור לשרת');
      return;
    }

    if (error.status >= 500) {
      this._message.set('שגיאת שרת');
      return;
    }

    if (error.status === 401) {
      this._message.set('נדרשת התחברות');
      return;
    }

    if (error.status === 403) {
      this._message.set('אין הרשאה');
      return;
    }

    this._message.set('הבקשה נכשלה');
  }

  setMessage(message: string): void {
    this._message.set(message);
  }

  clear(): void {
    this._message.set(null);
  }
}


