import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/engine.service';
import {SidebarNotificationService} from '../../services/sidebar-notification.service';
import { SimpleMenu } from 'simple-sidenav';
import { SimpleAnimation } from 'simple-sidenav/lib/interfaces/simple-animation';
import { SliderUpdaterService, Sliders } from 'src/app/services/slider-updater.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: ['./ui-sidebar-left.component.scss']
})
export class UiSidebarLeftComponent {

  private rotate = false;
  private viewPosition = "none";
  private x_hand_rotation = 0;
  private y_hand_rotation = 0;
  private z_hand_rotation = 0;
  private did_zoom = false;
  private zoom = 5;
  private sliders: Sliders;
  private sliderSubscription: Subscription;
  

menu: SimpleMenu[] = [{ "id": "1", "name": "Sliders", "menu": [
    { "id": "2", "name": "Hand rotation" },
    { "id": "3", "name": "Zoom" },
    ]}, 
    { "id": "4", "name": "Views", "menu": [
      { "id": "5", "name": "Top" },
      { "id": "6", "name": "Left" },
      { "id": "7", "name": "Right" },
    ]},
    { "id": "8", "name": "Autorotate" }
    ];
animation: SimpleAnimation = {
  in: { value: 'slide-in-stagger' },
  out: { value: 'slide-out', duration: 200 }
};

onClick(item: {id: number|string, name: string, icon: string, index: number}) {
  var x = document.getElementById("handSliders");
  var y = document.getElementById("zoomslider");
  x.style.display = "none";
  y.style.display = "none";

  if (item !=null) {
    if (item.id === '2') {
      x.style.display = "block";
    } else if (item.id === '3') {
      y.style.display = "block";
    } else if (item.id === '5') {
      this.viewPosition = "top";
      this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
    } else if (item.id === '6') {
      this.viewPosition = "left";
      this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
    } else if (item.id === '7') {
      this.viewPosition = "right";
      this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
    } else if (item.id === '8') {
      this.rotate = !this.rotate;
      this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
    }
    this.viewPosition = "none";
  }
  }

  constructor(private sidebarNotificationService: SidebarNotificationService, private sliderUpdaterService: SliderUpdaterService) { 
    this.sliderSubscription = sliderUpdaterService.observable.subscribe(res => {
      this.sliders = res;
      this.updateSliders(this.sliders);
    }, err => console.log(err));
  } 

  updateSliders(sliders: Sliders){
    if(sliders){
      (<HTMLInputElement>document.getElementById("myRangeZoom")).value = sliders.zoom.toString();
      console.log(sliders.zoom)
    }
  }
  passHandRotationX(value){
    this.x_hand_rotation = value;
    this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
  }

  passHandRotationY(value){
    this.y_hand_rotation = value;
    this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
  }

  passHandRotationZ(value){
    this.z_hand_rotation = value;
    this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
  }

  cameraZoom(value) {
    this.zoom = value;
    this.did_zoom = true;
    this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
    this.did_zoom = false;
  }
}
