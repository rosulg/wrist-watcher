import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Hand {
    private readonly color: number;

    constructor(color: number) {
        this.color = color;
    }

    async load(): Promise<THREE.Object3D> {
        return new Promise(async res => {
            // Load the model
            const loader = new GLTFLoader();
            loader.load(
                'assets/models/temp-hand.gltf',
                ( gltf ) => {
                    const hand = gltf.scene.getObjectByName('hand001');

                    return res(hand);
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
