import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http: HttpClient = inject(HttpClient);

  getTestAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`/yt-course/account/test_accounts`);
  }
}
