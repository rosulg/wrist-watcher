import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/engine.service';
import {SidebarNotificationService} from '../../services/sidebar-notification.service';
import { SimpleMenu } from 'simple-sidenav';
import { SimpleAnimation } from 'simple-sidenav/lib/interfaces/simple-animation';

@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: ['./ui-sidebar-left.component.scss']
})
export class UiSidebarLeftComponent {

  private rotate = false;
  private backward = false;
  private x_hand_rotation = 0;
  private y_hand_rotation = 0;
  private z_hand_rotation = 0;
  private has_sliders = false;
  private zoom = 5;
  

menu: SimpleMenu[] = [{ "id": "1", "name": "Sliders", "menu": [
    { "id": "2", "name": "Hand rotation" },
    { "id": "3", "name": "Zoom" },
  ] },];
//animation: SimpleAnimation = {
//  in: { value: 'slide-in-stagger' },
//  out: { value: 'slide-out', duration: 200 }
//};

onClick(item: {id: number|string, name: string, icon: string, index: number}) {
  var x = document.getElementById("handSliders");
  var y = document.getElementById("zoomslider");
  x.style.display = "none";
  y.style.display = "none";
  if(item != null && item.id === '2'){
    x.style.display = "block";
    this.has_sliders = true;
  }else if (item != null && item.id === '3'){
    y.style.display = "block";
    
  }
  
  }

  constructor(private sidebarNotificationService: SidebarNotificationService) { }

  passHandRotationX(value){
    this.x_hand_rotation = value;
    this.sidebarNotificationService.notify({backward: this.backward, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, has_sliders: this.has_sliders, zoom: this.zoom});
  }

  passHandRotationY(value){
    this.y_hand_rotation = value;
    this.sidebarNotificationService.notify({backward: this.backward, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, has_sliders: this.has_sliders, zoom: this.zoom});
  }

  passHandRotationZ(value){
    this.z_hand_rotation = value;
    this.sidebarNotificationService.notify({backward: this.backward, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, has_sliders: this.has_sliders, zoom: this.zoom});
  }
  

  toggleForward () {
    this.backward = !this.backward;
    this.sidebarNotificationService.notify({backward: this.backward, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, has_sliders: this.has_sliders, zoom: this.zoom});
  }

  toggleRotation() {
    this.rotate = !this.rotate;
    this.sidebarNotificationService.notify({backward: this.backward, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, has_sliders: this.has_sliders, zoom: this.zoom});
  }

  cameraZoom(value) {
    this.zoom = value;
    this.sidebarNotificationService.notify({backward: this.backward, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, has_sliders: this.has_sliders, zoom: this.zoom});

  }

}
