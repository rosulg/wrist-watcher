import * as THREE from 'three';
import { OBJLoader } from 'three-addons';

export class Hand {
    private readonly color: number;

    constructor(color: number) {
        this.color = color;
    }

    async load(): Promise<THREE.Object3D> {
        return new Promise(res => {
            new OBJLoader().load(
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
