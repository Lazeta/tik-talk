import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router)
  private cookieService = inject(CookieService)
  
  private baseApiUrl = '/yt-course/auth/';
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  token: string | null = null;
  refreshToken: string | null = null;

  constructor () {
    this.loadTokensFromStorage();
  }
  private loadTokensFromStorage(): void {
    this.token = this.cookieService.get('token')
    this.refreshToken = this.cookieService.get('refreshToken')
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

  login(payload: { username: string, password: string }): Observable<TokenResponse> {
    const formData = new FormData();

    formData.append('username', payload.username);
    formData.append('password', payload.password);

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}token`,
      formData,
    ).pipe(
      tap(response => this.saveTokens(response))
    )
  }

  refreshAuthToken(): Observable<TokenResponse> {
    if (!this.refreshToken) {
      return throwError(() => new Error('No refresh token available'))
    }

    return this.http.post<TokenResponse>
      (`${this.baseApiUrl}refresh`,
        { refresh_token: this.refreshToken },
      ).pipe(
        tap(response => this.saveTokens(response)),
        catchError(error => {
          this.logout()
          return throwError(() => error)
        })
      )
  }
  logout(): void {
    this.cookieService.delete(this.tokenKey);
    this.cookieService.delete(this.refreshTokenKey);
    this.token = null
    this.refreshToken = null
    this.router.navigate(['login'])
  }

  private saveTokens(response: TokenResponse): void {
    this.token = response.access_token
    this.refreshToken = response.refresh_token

    this.cookieService.set(this.tokenKey, this.token, {
      path: '/',
      secure: true,
      sameSite: 'Strict'
    })

    this.cookieService.set(this.refreshTokenKey, this.refreshToken, {
      path: '/',
      secure: true,
      sameSite: 'Strict'
    })
  }
}
