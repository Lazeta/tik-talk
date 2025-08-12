import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Profile } from '../interfaces/profile.interface';
import { Pageble } from '../interfaces/pageble.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private baseApiUrl = '/yt-course/';

  getAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`).pipe(
      catchError(error => {
        console.error('Failed to get test accounts', error);
        return throwError(() => new Error('Failed to load test accounts'));
      })
    );
  }

  getSubscribersShortList() {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`).pipe(
      map(response => response.items.slice(0, 3))
    )
  }

  me = signal<Profile | null>(null)

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`).pipe(
      tap(res => this.me.set(res))
    ).pipe(
      catchError(error => {
        console.error('Failed to get profile', error);
        return throwError(() => new Error('Failed to load profile'));
      })
    )
  }
}
