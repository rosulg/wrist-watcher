import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/engine.service';
import {SidebarNotificationService} from '../../services/sidebar-notification.service';

@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: ['./ui-sidebar-left.component.css']
})
export class UiSidebarLeftComponent {

  private rotate = false;
  private backward = false;

  constructor(private sidebarNotificationService: SidebarNotificationService) { }

  toggleForward () {
    this.backward = !this.backward;
    this.sidebarNotificationService.notify({backward: this.backward, rotate: this.rotate});
  }

  toggleRotation() {
    this.rotate = !this.rotate;
    this.sidebarNotificationService.notify({rotate: this.rotate, backward: this.backward});
  }

}
