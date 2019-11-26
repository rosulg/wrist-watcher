import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/engine.service';
import {SidebarNotificationService} from '../../services/sidebar-notification.service';

@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: []
})
export class UiSidebarLeftComponent implements OnInit {

  message: number;

  private rotate = false;

  constructor(private data: EngineService, private sidebarNotificationService: SidebarNotificationService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }

  front(){
    this.data.changeMessage(5)
  }

  back(){
    this.data.changeMessage(-7)
  }

  toggleRotation() {
    this.rotate = !this.rotate;
    this.sidebarNotificationService.notify({rotate: this.rotate});
  }

}
