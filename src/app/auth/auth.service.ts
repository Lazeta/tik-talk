import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);

  // Используем абсолютный URL для избежания CORS-проблем в development
  private baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';
  
  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';

  token: string | null = null;
  refreshToken: string | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage(): void {
    this.token = this.cookieService.get(this.tokenKey);  // Используем this.tokenKey
    this.refreshToken = this.cookieService.get(this.refreshTokenKey);
  }

  get isAuthenticated(): boolean {
    return !!this.token && !this.isTokenExpired(this.token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  login(payload: { username: string; password: string }): Observable<TokenResponse> {
    const body = new URLSearchParams();
    body.set('username', payload.username);
    body.set('password', payload.password);
    body.set('grant_type', 'password');

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}token`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).pipe(
      tap((response) => this.saveTokens(response)),
      // catchError((error) => {
      //   console.error('Login error:', error);
      //   return throwError(() => error);
      // })
    );
  }

  refreshAuthToken(): Observable<TokenResponse> {
    // if (!this.refreshToken) {
    //   return throwError(() => new Error('No refresh token available'));
    // }

    // Убедитесь, что сервер ожидает именно такое название поля (refresh_token)
    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}refresh`,
      { refresh_token: this.refreshToken },  // или 'refreshToken', если сервер требует так
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).pipe(
      tap((response) => this.saveTokens(response)),
      // catchError((error) => {
      //   this.logout();
      //   return throwError(() => error);
      // })
    );
  }

  logout(): void {
    this.cookieService.delete(this.tokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  private saveTokens(response: TokenResponse): void {
    this.token = response.access_token;
    this.refreshToken = response.refresh_token;

    this.cookieService.set(this.tokenKey, this.token, {
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });

    this.cookieService.set(this.refreshTokenKey, this.refreshToken, {
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });
  }
}