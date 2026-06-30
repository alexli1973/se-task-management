import {computed, inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ApiClientService} from '../core/api/api-client.service';
import {STORAGE_KEYS} from '../core/constants/storage.constants';
import {IAuthSession, ILoginCredentials, IUser} from './auth.models';
import {map, Observable, tap} from 'rxjs';
import {ROUTE_URLS} from '../core/constants/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly router = inject(Router);

  private readonly storageKey = STORAGE_KEYS.AUTH_SESSION;

  readonly session = signal<IAuthSession | null>(this.readSession());
  readonly isLoggedIn = computed(() => !!this.session());

  login(credentials: ILoginCredentials): Observable<IAuthSession> {
    return this.api.get<IUser[]>('/users', { email: credentials.email }).pipe(
      map(users => {
        const user = users[0];

        if (!user || user.password !== credentials.password) {
          throw new Error('Invalid email or password');
        }

        return {
          id: Number(user.id),
          name: user.name,
          email: user.email,
          token: user.token,
        };
      }),
      tap(session => this.setSession(session))
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    this.session.set(null);
    this.router.navigateByUrl(ROUTE_URLS.LOGIN);
  }

  getToken(): string | null {
    return this.session()?.token ?? null;
  }

  getCurrentUserId(): number | null {
    return this.session()?.id ?? null;
  }

  private setSession(session: IAuthSession): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(session));
    this.session.set(session);
  }

  private readSession(): IAuthSession | null {
    const rawSession = sessionStorage.getItem(this.storageKey);

    if (!rawSession) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawSession) as IAuthSession;
      return {...parsed, id: Number(parsed.id)};
    } catch {
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
