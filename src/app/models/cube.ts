import * as THREE from 'three';

export class Cube {
    private readonly _obj: THREE.Mesh

    constructor(color: string) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: color });
        this._obj = new THREE.Mesh( geometry, material );
    }

    get obj(): THREE.Mesh {
        return this._obj;
    }
}
