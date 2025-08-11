import { Component } from '@angular/core';
import { SvgIconDirective } from '../../data/services/svg-icon.service';

@Component({
  selector: 'app-sidebar',
  imports: [SvgIconDirective],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

}
