import {Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';
import { Hand } from '../models/hand';
import { TwoToneWatch } from '../models/two-tone-watch';
import {toRad} from '../helpers/helpers';
import {Subscription} from 'rxjs';
import { OrbitControls } from '@avatsaev/three-orbitcontrols-ts';
import {SidebarAction, SidebarNotificationService} from '../services/sidebar-notification.service';
import {TwoToneWatchLink} from '../models/two-tone-watch-link';

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
  private spline;
  private splineLine;
  private linkMeshes = [];
  private link = new THREE.Group();
  private linkLength = 0.1;
  private watch;
  private hand;


  public constructor(private ngZone: NgZone, private sidebarNotificationService: SidebarNotificationService) {
    this.sidebarActionSubscription = sidebarNotificationService.observable.subscribe(res => {
      this.sidebarAction = res;
      this.changeCameraPosition(this.sidebarAction);
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


    this.hand = await new Hand(0xfffbf5).load();
    this.watch = await new TwoToneWatch().load();
    this.link.add( await new TwoToneWatchLink().load())
    this.link.scale.set(0.4, 0.4, 0.4);

    // Center the hand in the world center
    this.hand.position.set(0.75, -1.8, -1);
    this.hand.scale.set(2.5, 2.5, 2.5);
    this.hand.rotation.set(toRad(10), toRad(25), toRad(15))

    // Rotate the watch to match the hand wrist location
    this.watch.rotation.set(
        toRad(0),
        toRad(0),
        toRad(0),
    );
    // Position the watch on-top of the wrist.
    this.watch.position.set(0, 0, 0);
    this.watch.scale.set(0.4, 0.4, 0.4);

    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.group.add(this.hand, this.watch);
    this.scene.add(this.group);
    this.splineLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 'purple'}));
    this.createPoolOfLinkMeshes();
    this.updateHandSurroundingSpline(null, 0);
    this.positionLinkMeshes();
    this.linkMeshes.forEach(mesh => this.group.add(mesh));
  }

  positionLinkMeshes() {
    for (let i = 0; i < this.linkMeshes.length; i++) {
      this.linkMeshes[i].visible = false;
    }

    const meshLength = this.linkLength;
    let count = this.spline.getLength() / meshLength;
    count = Math.floor(count);

    const splineStep = 1 / count;

    for (let i = 0; i <= count; i++) {
      const idx = i % count;
      this.linkMeshes[idx].visible = true;

      this.spline.getPointAt(idx * splineStep, this.linkMeshes[idx].position);
      const tan = this.spline.getTangentAt(idx * splineStep);
      const lookAt = new THREE.Vector3().copy(tan).add(this.linkMeshes[idx].position);
      this.linkMeshes[idx].up.copy(this.linkMeshes[idx].position).multiplyScalar(1).normalize();
      this.linkMeshes[idx].lookAt(lookAt);
    }
  }

  updateHandSurroundingSpline(scale, x) {
    // const controlPoints = [
    //   new THREE.Vector3( 0, this.watch.position.y - 0.02, this.watch.position.z + 0.25),
    //   new THREE.Vector3( 0, this.watch.position.y - 0.2, this.watch.position.z + 0.34),
    //   // Hand looking from the fingers to the left
    //   new THREE.Vector3( 0, -0.35, this.hand.position.z + 1.25),
    //   // Hand looking from the fingers to the right
    //   new THREE.Vector3( 0, -0.35, this.hand.position.z + 0.7273),
    //   new THREE.Vector3( 0,  this.watch.position.y - 0.15, this.watch.position.z - 0.3),
    //   new THREE.Vector3( 0,  this.watch.position.y, this.watch.position.z - 0.2),
    // ];

    const controlPoints = [
      new THREE.Vector3( 0, 0, 0.7),
      new THREE.Vector3( 0, 0.4, 0.5),
      new THREE.Vector3(  0, 0.5, 0),
      new THREE.Vector3(0, 0.4, -0.5),
      new THREE.Vector3(0, 0, -0.7),
      new THREE.Vector3(0, -0.4, -0.5),
      new THREE.Vector3(  0, -0.5, 0),
      new THREE.Vector3(0, -0.4, 0.5),
    ];

    this.spline = new THREE.CatmullRomCurve3(controlPoints, true);
    const length = this.spline.getLength();

    const points = this.spline.getPoints(length / this.linkLength);
    this.splineLine.geometry.setFromPoints(points);
  }

  createPoolOfLinkMeshes() {
    for (let i = 0; i < 50; i++) {

      try {
        console.log(this.link, 'link?');
        const clone = this.link.clone();
        clone.position.set(0, 0, 0);
        this.scene.add(clone);

        clone.add(new THREE.AxesHelper( 1 ));
        this.linkMeshes.push(clone);
      } catch (err) {
        // supress
      }

    }
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
      this.camera.position.z = action.backward ? -7 : 5;
      this.camera.lookAt(new THREE.Vector3());
    }
  }

}
