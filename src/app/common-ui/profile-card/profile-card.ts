import { Component, Input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from "../../data/helpers/pipes/img-url-pipe";

@Component({
  selector: 'app-profile-card',
  imports: [ImgUrlPipe],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss'
})
export class ProfileCard {
  @Input() profile!: Profile;
}