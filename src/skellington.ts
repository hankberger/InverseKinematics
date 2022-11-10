import * as THREE from 'three';
import Bone from './bone';

export default class Skellington{
    public rootPosition: THREE.Vector3;
    public rootRotations: THREE.Quaternion;
    public rootBone: Bone;
    public bones: Bone[];

    constructor(){
        this.rootPosition = new THREE.Vector3();
        this.rootRotations = new THREE.Quaternion();
        this.rootBone = new Bone();
        this.bones = [];
    }
}