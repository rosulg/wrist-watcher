import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export class TwoToneWatch {

    async load(): Promise<THREE.Object3D> {
        return new Promise(async res => {
            // Load the model
            const loader = new GLTFLoader();
            loader.load(
                'assets/models/two-tone-watch.gltf',
                ( gltf ) => {
                    // called when the resource is loaded
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
