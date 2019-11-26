import * as THREE from 'three';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';


export class TwoToneWatch {
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
            const materials = await new Promise(resolve => {
                new MTLLoader().load('./assets/models/two-tone-watch.mtl', mat => {
                    resolve(mat);
                });
            });

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            // Load object
            objLoader.load(
                './assets/models/two-tone-watch.obj',
                (obj) => {
                    obj.name = 'Two-tone';
                    obj.scale.set(0.45, 0.45, 0.45);
                    const links = obj.children.filter(el => el.name.toLowerCase().includes('strap') || el.name === 'lock');
                    links.forEach(child => {
                        child.scale.set(1, 0.67, 1);
                    });
                    return res(obj);
                }
            );
        });
    }
}
