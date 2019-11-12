import * as THREE from 'three';
import { OBJLoader } from 'three-obj-mtl-loader';

export class HublotWatch {
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
                './assets/models/hublot-watch.obj',
                (obj) => {
                    obj.name = 'Hublot';
                    obj.scale.set(0.01, 0.01, 0.01);
                    // Loop over children meshes and change the color of them
                    obj.children.forEach(child => {
                        if (child.material.color) {
                            child.material.color.setHex(this.color);
                        }
                    });

                    return res(obj);
                }
            );
        });
    }
}
