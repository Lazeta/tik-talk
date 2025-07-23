import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Profile {
  http = inject(HttpClient);

  baseApiUrl = 'http://icherniakov.ru/yt-course/';

  getTestAccounts(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}account/test_accounts`);
  }
}
