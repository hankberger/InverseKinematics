import * as THREE from 'three';

export default class Bone{
    public position: THREE.Vector3;
    public rotation: THREE.Quaternion;
    public children: Bone[];
    public boneLength: number;
    public geometry: THREE.Mesh;
    
    constructor(name: string){
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Quaternion();
        this.children = [];
        this.boneLength = 0;
        this.geometry = new THREE.Mesh();
        // this.geometry = null;

        if(name === "root"){
            this.boneLength = 1;
            this.position.y = this.boneLength;
        }
    }

    public createMesh(){
        const geometry = new THREE.BoxGeometry( .1, this.boneLength, .1 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        this.geometry = cube;

        for(let child of this.children){
            child.createMesh();
        }
    }
}