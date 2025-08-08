import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private baseApiUrl = '/yt-course/';

  getTestAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`).pipe(
      catchError(error => {
        console.error('Failed to get test accounts', error);
        return throwError(() => new Error('Failed to load test accounts'));
      })
    );
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`).pipe(
      catchError(error => {
        console.error('Failed to get profile', error);
        return throwError(() => new Error('Failed to load profile'));
      })
    );
  }
}
