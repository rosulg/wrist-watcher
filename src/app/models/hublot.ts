import * as THREE from 'three';
import { OBJLoader } from 'three-addons';

export class Hublot {
    private readonly color: number;

    constructor(color: number) {
        this.color = color;
    }

    get obj(): Promise<THREE.Object3D> {
        return this.load();
    }

    async load(): Promise<THREE.Object3D> {
        return new Promise(res => {
            new OBJLoader().load(
                './assets/obj-models/hublot.obj',
                (obj) => {
                    obj.name = 'Hublot';
                    obj.scale.set(0.01, 0.01, 0.01);
                    // Loop over children meshes and change the color of them
                    obj.children.forEach(child => {
                        child.material.color.setHex(this.color);
                    });
                    return res(obj);
                }
            );
        });
    }
}
