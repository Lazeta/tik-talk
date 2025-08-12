import { Component, Input } from '@angular/core';
import { Profile } from '../../../data/interfaces/profile.interface';

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [],
  templateUrl: './subscriber-card.html',
  styleUrls: ['./subscriber-card.scss']
})
export class SubscriberCard {
  @Input() profile?: Profile;
}
