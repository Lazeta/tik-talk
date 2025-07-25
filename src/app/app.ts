import { Component, inject } from '@angular/core';
import { ProfileCard } from "./common-ui/profile-card/profile-card";
import { ProfileService } from './data/services/profile.service';
import { CommonModule } from '@angular/common';
import { Profile } from './data/interfaces/profile.interface';

@Component({
  selector: 'app-root',
  imports: [ProfileCard, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  profileService: ProfileService = inject(ProfileService);
  profiles: Profile[] = [];

  constructor() {
    this.profileService.getTestAccounts()
    .subscribe((data: Profile[]) => {
      this.profiles = data;
      console.log('Полученные данные:', this.profiles);
    })
  }
}
