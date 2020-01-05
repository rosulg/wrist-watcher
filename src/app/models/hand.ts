import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Hand {
    private readonly color: number;

    constructor(color: number) {
        this.color = color;
    }

    async load(): Promise<THREE.Object3D> {
        return new Promise(async res => {
            var textureLoader = new THREE.TextureLoader();

            var diffuseMap = textureLoader.load( "assets/models/hand_texture.png" );
            diffuseMap.encoding = THREE.sRGBEncoding;

            var specularMap = textureLoader.load( "assets/models/hand_specular.png" );
			specularMap.encoding = THREE.sRGBEncoding;
                
            var normalMap = textureLoader.load( "assets/models/hand_normal.png" );

            diffuseMap.flipY = false;
            normalMap.flipY = false;

            var material = new THREE.MeshPhongMaterial( {
                color: 0xdddddd,
                specular: 0x222222,
                shininess: 35,
                map: diffuseMap,
                specularMap: specularMap,         
                normalMap: normalMap,
                normalScale: new THREE.Vector2( 0.8, 0.8 )
            } );

            // Load the model
            const loader = new GLTFLoader();

            loader.load(
                'assets/models/temp-hand.gltf',
                ( gltf ) => {
                    var handMesh = gltf.scene.getObjectByName("hand001");
                    const hand = new THREE.Mesh( handMesh["geometry"], material );

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
