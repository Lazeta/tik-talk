import { Component, inject } from '@angular/core';
import { SvgIconDirective } from '../../data/services/svg-icon.service';
import { SubscriberCard } from "./subscriber-card/subscriber-card";
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from "../../data/helpers/pipes/img-url-pipe";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIconDirective, RouterLink, SubscriberCard, AsyncPipe, ImgUrlPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  profileService = inject(ProfileService)
  subscribers$ = this.profileService.getSubscribersShortList()

  me = this.profileService.me

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: ''
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    },
  ]

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }
}