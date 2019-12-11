import {Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';
import { Hand } from '../models/hand';
import { TwoToneWatch } from '../models/two-tone-watch';
import {toRad} from '../helpers/helpers';
import {Subscription} from 'rxjs';
import { OrbitControls } from '@avatsaev/three-orbitcontrols-ts';
import {SidebarAction, SidebarNotificationService} from '../services/sidebar-notification.service';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  controls = null;
  private group: THREE.Group;
  private sidebarAction: SidebarAction;
  private sidebarActionSubscription: Subscription;
  private frameId: number = null;

  public constructor(private ngZone: NgZone, private sidebarNotificationService: SidebarNotificationService) {
    this.sidebarActionSubscription = sidebarNotificationService.observable.subscribe(res => {
      this.sidebarAction = res;
      this.changeCameraPosition(this.sidebarAction);
      this.rotateHandSlider(this.sidebarAction)
    }, err => console.log(err));
  }

    public ngOnDestroy() {
      if (this.frameId != null) {
        cancelAnimationFrame(this.frameId);
      }

      // Unsubscribe
      this.sidebarActionSubscription.unsubscribe();
  }

  configControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.autoRotate = false;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.update();
  }

  async createScene(canvas: ElementRef<HTMLCanvasElement>): Promise<void> {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Set white background
    this.renderer.setClearColor(0xFFFFFF, 1.0);

    // create the scene
    this.scene = new THREE.Scene();

    // Axeshelpers
    const axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(axesHelper);

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);
    this.configControls();



    // soft white light
    this.light = new THREE.AmbientLight( 0x404040 );
    this.light.position.z = 10;
    this.scene.add(this.light);

    const pointLight = new THREE.PointLight( 0xfdfbd3, 1, 100 );
    pointLight.position.set( 0, 10, 0 );
    this.scene.add( pointLight );


    const hand = await new Hand(0xfffbf5).load();
    const watch = await new TwoToneWatch(0x00ff00).load();
    // Center the hand in the world center
    hand.position.set(0.25, -2.15, -0.5);
    hand.scale.set(2.5, 2.5, 2.5);

    // Rotate the watch to match the hand wrist location
    watch.rotation.set(
        toRad(270),
        toRad(15),
        toRad(-30),
    );
    // Position the watch on-top of the wrist.
    watch.position.set(-0.1, -0.175, -0.05);
    watch.scale.set(0.4, 0.4, 0.4);

    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.group.add(hand, watch);
    this.scene.add(this.group);
  }

  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
    this.controls.update();
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    // NB! Rotate all objects inside this if statement. Otherwise toggling rotation will not work!
    if (this.group && this.sidebarAction && this.sidebarAction.rotate) {
      this.group.rotation.x += 0.01;
      this.group.rotation.y += 0.01;
      
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

  private changeCameraPosition(action: SidebarAction) {
    if (this.camera && action) {
      if (action.did_zoom) {
        this.camera.position.z = action.zoom;
        this.camera.lookAt(new THREE.Vector3());
      } else {
        this.group.position.set(0, 0, 0);
        if (action.viewPosition === "top") {
          this.camera.position.set(0, 2, 0)
          this.camera.lookAt(new THREE.Vector3())
        } else if (action.viewPosition === "left") {
          this.camera.position.set(1, 1, -3)
          this.camera.lookAt(new THREE.Vector3())
        } else if (action.viewPosition === "right") {
          this.camera.position.set(-1, 1, 1)
          this.camera.lookAt(new THREE.Vector3())
        }
      }      
    }
  }
  

  private rotateHandSlider(action: SidebarAction) {
    if (this.group && action) {
      this.group.rotation.z = action.z_hand_rotation * Math.PI/180
      this.group.rotation.x = action.x_hand_rotation * Math.PI/180
      this.group.rotation.y = action.y_hand_rotation * Math.PI/180
    }
  }

}
