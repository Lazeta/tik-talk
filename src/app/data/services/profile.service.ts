import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Profile } from '../interfaces/profile.interface';
import { Pageble } from '../interfaces/pageble.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  baseApiUrl = '/yt-course/';

  getAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`).pipe(
      catchError(error => {
        console.error('Failed to get test accounts', error);
        return throwError(() => new Error('Failed to load test accounts'));
      })
    );
  }

  getSubscribersShortList() {
    return this.http.get<Pageble<Profile>>(`account/subscribers/`).pipe(
      map(response => response.items.slice(0, 3))
    )
  }

  me(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`).pipe(
      // catchError(error => {
      //   console.error('Failed to get profile', error);
      //   return throwError(() => new Error('Failed to load profile'));
      // })
    );
  }
}
