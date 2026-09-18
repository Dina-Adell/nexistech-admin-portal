import { Injectable } from '@angular/core';
import { Observable, delay, of, switchMap, throwError } from 'rxjs';

import { AuthSession, LoginRequest } from '../models/auth.models';

/** Key used to remember the last e-mail address on this device. */
const REMEMBERED_EMAIL_KEY = 'nexistech.remembered-email';

/**
 * Talks to the identity API.
 *
 * The network call is mocked here so the page can be demoed on its own.
 * Replace the body of `signIn()` with an `HttpClient.post()` call to
 * `POST /api/v1/auth/login` and add `provideHttpClient()` in `app.config.ts`.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Demo credentials, kept only for the standalone preview. */
  private readonly demoEmail = 'admin@nexistech.io';
  private readonly demoPassword = 'NexisTech@2026';

  signIn(request: LoginRequest): Observable<AuthSession> {
    return of(request).pipe(
      delay(900),
      switchMap((credentials) => {
        const matches =
          credentials.email.trim().toLowerCase() === this.demoEmail &&
          credentials.password === this.demoPassword;

        if (!matches) {
          return throwError(
            () =>
              new Error(
                'That e-mail and password do not match an active account.',
              ),
          );
        }

        this.persistEmail(credentials);

        return of<AuthSession>({
          token: 'demo.jwt.token',
          expiresIn: 3600,
          user: {
            id: 'usr_01HZ',
            email: this.demoEmail,
            displayName: 'Cloud Administrator',
            role: 'admin',
          },
        });
      }),
    );
  }

  /** E-mail stored on the previous successful sign-in, if any. */
  readRememberedEmail(): string {
    return this.safeStorage()?.getItem(REMEMBERED_EMAIL_KEY) ?? '';
  }

  private persistEmail({ email, rememberMe }: LoginRequest): void {
    const storage = this.safeStorage();
    if (!storage) {
      return;
    }

    if (rememberMe) {
      storage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
    } else {
      storage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  }

  /** localStorage is unavailable during SSR and in hardened browsers. */
  private safeStorage(): Storage | null {
    try {
      return typeof localStorage === 'undefined' ? null : localStorage;
    } catch {
      return null;
    }
  }
}
