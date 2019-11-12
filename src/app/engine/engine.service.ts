import {Injectable, ElementRef, OnDestroy, NgZone, OnInit} from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three-addons';
import { Hand } from '../models/hand';
import { HublotWatch } from '../models/hublot-watch';
import { TwoToneWatch } from '../models/two-tone-watch';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private hand: THREE.Object3D;
  private hublotWatch: THREE.Object3D;
  private twoToneWatch: THREE.Object3D;
  private objLoader: OBJLoader;

  private frameId: number = null;

  public constructor(private ngZone: NgZone) {
    this.objLoader = new OBJLoader();
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
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

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight( 0x404040 );
    this.light.position.z = 10;
    this.scene.add(this.light);

    const pointLight = new THREE.PointLight( 0xfdfbd3, 1, 100 );
    pointLight.position.set( 0, 10, 0 );
    this.scene.add( pointLight );

    this.hand = await new Hand(0xfffbf5).load();
    this.hublotWatch = await new HublotWatch(0x000000).load();
    this.twoToneWatch = await new TwoToneWatch(0x00ff00).load();
    this.twoToneWatch.position.x -= 3;

    this.scene.add(this.hand);
    this.scene.add(this.hublotWatch);
    this.scene.add(this.twoToneWatch);
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
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    if (this.hand && this.hublotWatch && this.twoToneWatch) {
      this.hand.rotation.x += 0.01;
      this.hand.rotation.y += 0.01;

      this.hublotWatch.rotation.x -= 0.01;
      this.hublotWatch.rotation.y -= 0.01;

      this.twoToneWatch.rotation.x += 0.015;
      this.twoToneWatch.rotation.y += 0.015;
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
}
