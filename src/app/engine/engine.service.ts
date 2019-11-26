import {Injectable, ElementRef, OnDestroy, NgZone, OnInit} from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three-addons';
import { Hand } from '../models/hand';
import { TwoToneWatch } from '../models/two-tone-watch';
import {toRad} from '../helpers/helpers';
import { BehaviorSubject } from 'rxjs';
import { OrbitControls } from '@avatsaev/three-orbitcontrols-ts';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private objLoader: OBJLoader;
  controls = null;
  private group: THREE.Group;

  private frameId: number = null;

  private messageSource = new BehaviorSubject(5);
  currentMessage = this.messageSource.asObservable();
  
  public constructor(private ngZone: NgZone) {
    this.objLoader = new OBJLoader();
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
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
    hand.position.set(0.4, -2.6, -0.5);

    // Rotate the watch to match the hand wrist location
    watch.rotation.set(
        toRad(270),
        toRad(15),
        toRad(-30),
    );
    // Position the watch on-top of the wrist.
    watch.position.set(-0.1, -0.175, -0.05);

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

    if (this.group) {
      // this.group.rotation.x += 0.01;
      // this.group.rotation.y += 0.01;
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

  //changing the camera position + where it looks at
  changeMessage(message: number) {
    this.camera.position.z= message;
    this.camera.lookAt(new THREE.Vector3(0,0,0))
  }

}
