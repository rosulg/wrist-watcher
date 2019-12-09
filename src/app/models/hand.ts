import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Hand {
    private readonly color: number;

    constructor(color: number) {
        this.color = color;
    }

    get obj(): Promise<THREE.Object3D> {
        return this.load();
    }

    async load(): Promise<THREE.Object3D> {
        return new Promise(async res => {
            // Load texture materials
            var loader = new GLTFLoader();
            loader.load(
                'assets/models/hand_gltf.gltf',
                ( gltf ) => {
                    // called when the resource is loaded
                    console.log(gltf.scene);
                    return res(gltf.scene);
                },
                ( xhr ) => {
                    // called while loading is progressing
                    console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
                },
                ( error ) => {
                    // called when loading has errors
                    console.error( 'An error happened', error );
                },
            );
        });
    }
}