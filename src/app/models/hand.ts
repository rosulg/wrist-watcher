import * as THREE from 'three';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';

export class Hand {
    private readonly color: number;

    constructor(color: number) {
        this.color = color;
    }

    async load(): Promise<THREE.Object3D> {
        const mtlLoader = new MTLLoader();
        const materials = await new Promise(resolve => {
            mtlLoader.load('assets/models/hand.mtl', mat => {
                resolve(mat);
            });
        });

        return new Promise(res => {
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
                './assets/models/hand.obj',
                (obj) => {
                    const hand = obj.getObjectByName('hand');
                    hand.scale.set(3, 3, 3);
                    hand.material.color.setHex(this.color);

                    return res(hand);
                }
            );
        });
    }
}
