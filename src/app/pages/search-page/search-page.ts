import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
import { ProfileCard } from "../../common-ui/profile-card/profile-card";

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, ProfileCard],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage {
  profileService: ProfileService = inject(ProfileService);
  profiles: Profile[] = [];

  constructor() {
    this.profileService.getAccounts()
    .subscribe((data: Profile[]) => {
      this.profiles = data;
      // console.log('Полученные данные:', this.profiles);
    })
  }
}
