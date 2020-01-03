import {Component} from '@angular/core';
import {SidebarNotificationService} from '../../services/sidebar-notification.service';
import {Sliders, SliderUpdaterService} from 'src/app/services/slider-updater.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: ['./ui-sidebar-left.component.scss']
})
export class UiSidebarLeftComponent {

  private rotate = false;
  private viewPosition = 'none';
  private x_hand_rotation = 0;
  private y_hand_rotation = 0;
  private z_hand_rotation = 0;
  private did_zoom = false;
  private zoom = 5;
  private sliders: Sliders;
  private sliderSubscription: Subscription;
  private mode ="side";
  private zoomValue ="5";
  
  constructor(private sidebarNotificationService: SidebarNotificationService, private sliderUpdaterService: SliderUpdaterService) { 
    this.sliderSubscription = sliderUpdaterService.observable.subscribe(res => {
      this.sliders = res;
      this.updateSliders(this.sliders);
    }, err => console.log(err));
  } 
  viewTop(){
    this.viewPosition = "top";
    this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
  }

  viewLeft(){
    this.viewPosition = "left";
    this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
  }

  viewRight(){
    this.viewPosition = "right";
    this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
  }
  updateSliders(sliders: Sliders){
    if(sliders){
      this.zoomValue = sliders.zoom.toString();
    }
  }

  passHandRotationX(value) {
    this.x_hand_rotation = value;
    this.sidebarNotificationService.notify({
      viewPosition: this.viewPosition,
      rotate: this.rotate,
      z_hand_rotation: this.z_hand_rotation,
      x_hand_rotation: this.x_hand_rotation,
      y_hand_rotation: this.y_hand_rotation,
      did_zoom: this.did_zoom,
      zoom: this.zoom
    });
  }

  passHandRotationY(value) {
    this.y_hand_rotation = value;
    this.sidebarNotificationService.notify({
      viewPosition: this.viewPosition,
      rotate: this.rotate,
      z_hand_rotation: this.z_hand_rotation,
      x_hand_rotation: this.x_hand_rotation,
      y_hand_rotation: this.y_hand_rotation,
      did_zoom: this.did_zoom,
      zoom: this.zoom
    });
  }

  passHandRotationZ(value) {
    this.z_hand_rotation = value;
    this.sidebarNotificationService.notify({
      viewPosition: this.viewPosition,
      rotate: this.rotate,
      z_hand_rotation: this.z_hand_rotation,
      x_hand_rotation: this.x_hand_rotation,
      y_hand_rotation: this.y_hand_rotation,
      did_zoom: this.did_zoom,
      zoom: this.zoom
    });
  }

  cameraZoom(value) {
    this.zoom = value;
    this.did_zoom = true;
    this.sidebarNotificationService.notify({
      viewPosition: this.viewPosition,
      rotate: this.rotate,
      z_hand_rotation: this.z_hand_rotation,
      x_hand_rotation: this.x_hand_rotation,
      y_hand_rotation: this.y_hand_rotation,
      did_zoom: this.did_zoom,
      zoom: this.zoom
    });
    this.did_zoom = false;
  }

  rotateHand(){
    this.rotate = !this.rotate;
    this.sidebarNotificationService.notify({viewPosition: this.viewPosition, rotate: this.rotate,  z_hand_rotation: this.z_hand_rotation, x_hand_rotation: this.x_hand_rotation, y_hand_rotation: this.y_hand_rotation, did_zoom: this.did_zoom, zoom: this.zoom});
  }

  passScale(value){
      //this.sidebarNotificationService.notify({slideValue: value});
  }
}
