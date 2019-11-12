import * as THREE from 'three';
import { OBJLoader } from 'three-addons';

export class Hand {
    private readonly color: number;

    constructor(color: number) {
        this.color = color;
    }

    get obj(): Promise<THREE.Mesh> {
        return this.loadHand();
    }

    private async loadHand(): Promise<THREE.Mesh> {
        return new Promise(res => {
            new OBJLoader().load(
                './assets/obj-models/hand.obj',
                (obj) => {
                    const hand = obj.getObjectByName('hand');
                    hand.scale.set(2, 2, 2);
                    hand.material.color.setHex(this.color);

                    return res(hand);
                }
            );
        });
    }
}
