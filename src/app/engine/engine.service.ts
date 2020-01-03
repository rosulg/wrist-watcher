import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import * as THREE from 'three';
import {Hand} from '../models/hand';
import {TwoToneWatch} from '../models/two-tone-watch';
import {toRad} from '../helpers/helpers';
import {Subscription} from 'rxjs';
import {OrbitControls} from '@avatsaev/three-orbitcontrols-ts';
import {SidebarAction, SidebarNotificationService} from '../services/sidebar-notification.service';
import {TwoToneWatchLink} from '../models/two-tone-watch-link';
import {SliderUpdaterService} from '../services/slider-updater.service';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private controls = null;
  private group: THREE.Group;
  private sidebarAction: SidebarAction;
  private sidebarActionSubscription: Subscription;
  private frameId: number = null;
  private zoom: number;

  private watch;
  private hand;

  // bracelet related
  private braceletSpline: THREE.CatmullRomCurve3;
  private braceletSplineLine: THREE.Line = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({color: 'purple'}));
  private braceletLinks: THREE.Group[] = [];

  private braceletLink = new THREE.Group();
  private braceletLinkLength = 0.03;

  private rayCaster: THREE.Raycaster = new THREE.Raycaster();
  private intersectionsPoints = [];
  private isIntersectionPointsFound = false;
  private computeBracelet = true;


  public constructor(
    private ngZone: NgZone,
    private sidebarNotificationService: SidebarNotificationService,
    private sliderUpdaterService: SliderUpdaterService) {
    this.sidebarActionSubscription = sidebarNotificationService.observable.subscribe(res => {
      this.sidebarAction = res;
      this.changeCameraPosition(this.sidebarAction);
      this.rotateHandSlider(this.sidebarAction);
      if (this.sidebarAction && this.sidebarAction.slideValue) {
        this.scaleHand(this.sidebarAction.slideValue);
      }
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
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;
    this.controls.update();
    this.controls.update();
  }

  updateSliders() {
    this.zoom = this.controls.target.distanceTo(this.controls.object.position);
    this.camera.zoom = this.zoom;
    this.sliderUpdaterService.notify({zoom: this.zoom});
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
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);

    const pointLight = new THREE.PointLight(0xfdfbd3, 1, 100);
    pointLight.position.set(0, 10, 0);
    this.scene.add(pointLight);


    this.hand = await new Hand(0xfffbf5).load();
    this.watch = await new TwoToneWatch().load();
    this.braceletLink.add(await new TwoToneWatchLink().load());
    this.braceletLink.visible = true;

    // Center the hand in the world center
    // TODO: Remove this positioning later. This is for the bracelet to scale better
    this.hand.position.x += 0.1;
    this.hand.rotation.set(toRad(0), toRad(215), toRad(160));

    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    // Hide the watch until the intersection points from ray caster and hand have been found
    this.watch.visible = false;

    // Group hand and watch and add to the scene so they are displayed
    this.group.add(this.hand, this.watch);
    this.scene.add(this.group);

    // Create bracelet objects so they can be used on render. This improves the performance
    this.createPoolOfBraceletLinks();
    // Add them all to the scene
    this.braceletLinks.forEach(mesh => this.group.add(mesh));

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

    if (!this.sidebarAction || (this.sidebarAction && !this.sidebarAction.rotate)) {
      this.findIntersections();

      if (this.computeBracelet && this.isIntersectionPointsFound && this.intersectionsPoints.length) {
        this.createHandSurroundingSpline();
        this.positionBraceletLinks();
        const point = this.intersectionsPoints[0];
        if (point) {
          this.watch.position.set(point.x, point.y, point.z);
          this.watch.visible = true;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  private findIntersections(): void {
    const firstIntersections = [];

    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {

      const rayCasterOrigin = new THREE.Vector3(0, 1, 0).applyAxisAngle(new THREE.Vector3(1, 0, 0), angle).normalize().multiplyScalar(10);
      const rayDirection = new THREE.Vector3().sub(rayCasterOrigin).normalize();

      this.rayCaster.set(rayCasterOrigin, rayDirection);
      const intersections = this.rayCaster.intersectObject(this.hand, true);
      if (intersections && intersections.length) {

        firstIntersections.push(intersections[0].point);
      }
    }
    this.intersectionsPoints = firstIntersections;

    if (firstIntersections.length >= 8) {
      this.isIntersectionPointsFound = true;
    }
  }

  private positionBraceletLinks() {
    for (let i = 0; i < this.braceletLinks.length; i++) {
      this.braceletLinks[i].visible = false;
    }

    const meshLength = this.braceletLinkLength;
    let count = this.braceletSpline.getLength() / meshLength;
    count = Math.floor(count);

    const splineStep = 1 / count;

    for (let i = 0; i <= count; i++) {
      const idx = i % count;

      if (this.isIntersectionPointsFound) {
        this.braceletLinks[idx].visible = true;
      }

      this.braceletSpline.getPointAt(idx * splineStep, this.braceletLinks[idx].position);
      const tan = this.braceletSpline.getTangentAt(idx * splineStep);
      const lookAt = new THREE.Vector3().copy(tan).add(this.braceletLinks[idx].position);
      this.braceletLinks[idx].up.copy(this.braceletLinks[idx].position).multiplyScalar(1).normalize();
      this.braceletLinks[idx].lookAt(lookAt);
    }
  }

  private createHandSurroundingSpline(): void {
    const controlPoints = this.intersectionsPoints.map((point, index) => {
      // Give the bracelet a little room to breathe
      if (index === 1 || index === 7) {
        point.y = point.z < 0 ? this.watch.position.y - 0.01 : this.watch.position.y - 0.015;
      } else if (index !== 0 && point.y < 0) {
        point.z += point.z < 0 ? -0.015 : 0.015;
        point.y += point.y < 0 ? -0.005 : 0;
      } else if (index !== 0) {
        point.z += point.z < 0 ? -0.02 : 0.02;
      }

      return point;
    });

    this.braceletSpline = new THREE.CatmullRomCurve3(controlPoints, true);
    const length = this.braceletSpline.getLength();

    const points = this.braceletSpline.getPoints(length / this.braceletLinkLength);
    this.braceletSplineLine.geometry.setFromPoints(points);
  }

  private createPoolOfBraceletLinks(): void {
    for (let i = 0; i < 500; i++) {

      const clone = this.braceletLink.clone();
      clone.position.set(0, 0, 0);
      this.scene.add(clone);

      this.braceletLinks.push(clone);

    }
  }

  private changeCameraPosition(action: SidebarAction) {
    if (this.camera && action) {
      if (action.did_zoom) {
        this.camera.zoom = action.zoom;
        this.camera.updateProjectionMatrix();
      } else {
        this.group.position.set(0, 0, 0);
        if (action.viewPosition === 'top') {
          this.camera.position.set(0, 2, 0);
          this.camera.lookAt(new THREE.Vector3());
        } else if (action.viewPosition === 'left') {
          this.camera.position.set(1, 1, -3);
          this.camera.lookAt(new THREE.Vector3());
        } else if (action.viewPosition === 'right') {
          this.camera.position.set(-1, 1, 1);
          this.camera.lookAt(new THREE.Vector3());
        }
      }
    }
  }

  private scaleHand(scale: number): void {
    if (this.hand) {
      this.computeBracelet = true;
      this.hand.scale.set(1, 1, scale);
    }
  }

  private rotateHandSlider(action: SidebarAction) {
    if (this.group && action && !isNaN(action.z_hand_rotation) && !isNaN(action.y_hand_rotation) && !isNaN(action.x_hand_rotation)) {
      this.computeBracelet = false;
      this.group.rotation.z = action.z_hand_rotation * Math.PI / 180;
      this.group.rotation.x = action.x_hand_rotation * Math.PI / 180;
      this.group.rotation.y = action.y_hand_rotation * Math.PI / 180;
    }
  }

}
