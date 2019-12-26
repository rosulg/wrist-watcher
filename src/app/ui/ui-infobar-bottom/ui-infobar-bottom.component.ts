import { Component, OnInit } from '@angular/core';
import {SidebarNotificationService} from '../../services/sidebar-notification.service';

@Component({
  selector: 'app-ui-infobar-bottom',
  templateUrl: './ui-infobar-bottom.component.html',
  styleUrls: []
})
export class UiInfobarBottomComponent implements OnInit {

  constructor(private sidebarNotificationService: SidebarNotificationService) { }

  ngOnInit() {
  }

  onSliderChanged (value: number): void {
    this.sidebarNotificationService.notify({slideValue: value});
  }

}
