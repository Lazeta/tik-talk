import { Component, inject } from '@angular/core';
import { ProfileCard } from "./common-ui/profile-card/profile-card";
import { Profile } from './data/services/profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ProfileCard, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  profileService = inject(Profile);
  profiles: any = []

  constructor() {
    this.profileService.getTestAccounts()
    .subscribe((variable: any) => {
      this.profiles = variable;
    })
  }
}
