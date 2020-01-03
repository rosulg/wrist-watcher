import * as THREE from 'three';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';


export class TwoToneWatchLink {

    async load(): Promise<THREE.Object3D> {
        return new Promise(async res => {
            // Load texture materials
            const materials = await new Promise(resolve => {
                new MTLLoader().load('./assets/models/two-tone-watch-link.mtl', mat => {
                    resolve(mat);
                });
            });

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            // Load object
            objLoader.load(
                './assets/models/two-tone-watch-link.obj',
                (obj) => {
                    const link = obj.getObjectByName('two-tone-watch.005');
                    return res(link);
                }
            );
        });
    }
}
