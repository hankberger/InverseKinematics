//@ts-nocheck
import * as THREE from 'three'
import './style.css'
import { AnimationMixer, Bone, Color, CullFaceBack, Mesh, Object3D, Vector2, Vector3, Vector4 } from 'three';
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xADD8E6);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement);

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 15
// orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

const axesHelper = new THREE.AxesHelper( 5 );
axesHelper.setColors( new Color(0, 0, 255), new Color(255, 0,0), new Color(0, 255, 0));
axesHelper.position.set(-8, 0 , -8);
scene.add( axesHelper );


// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

function generateFloor() {
    // TEXTURE
    const textureLoader = new THREE.TextureLoader();
    const floorColor = textureLoader.load('/rock_diff.jpg');
    const normalMap = textureLoader.load('/rock_norm.png');
    const displacementMap = textureLoader.load('/rock_displacement.png')
    const roughMap = textureLoader.load('/rock_rough.png');

    const WIDTH = 80
    const LENGTH = 80

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
      {
        map: floorColor,
        normalMap: normalMap,
        displacementMap: displacementMap,
        displacementScale: .5,
        roughnessMap: roughMap
     })
     
     wrapAndRepeatTexture(material.map);
     wrapAndRepeatTexture(material.displacementMap);
     wrapAndRepeatTexture(material.normalMap);
     wrapAndRepeatTexture(material.roughnessMap);
        
      
    // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    // floor.rotation.x = - Math.PI / 2
    floor.position.z -= .3;
    scene.add(floor)
}

generateFloor();

function wrapAndRepeatTexture (map: THREE.Texture) {
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.repeat.x = map.repeat.y = 10
}

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(- 60, 100, 20);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 50;
    dirLight.shadow.camera.left = - 50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}

light();

const boxGeo = new THREE.BoxGeometry(.1, .1, .1);
const boxMat = new THREE.MeshStandardMaterial({color: 0xff0000});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const goalPos = new Vector3(-1, 1, 0);
document.addEventListener( 'mousemove', onDocumentMouseDown );
function onDocumentMouseDown( event: any ) {   
  
  event.preventDefault();

  let mouse3D = new THREE.Vector3( ( event.clientX/ window.innerWidth ) * 2 - 1,   
                        -( event.clientY / window.innerHeight ) * 2 + 1,  
                          0.5 );     

  var raycaster =  new THREE.Raycaster();                                        
  raycaster.setFromCamera( mouse3D, camera );

  // Grab all objects that can be intersected.
  var intersects = raycaster.intersectObjects( scene.children );
  if ( intersects.length > 0 ) {
    // movements.push(intersects[ 0 ].point);
    const click = intersects[0].point;
    goalPos.x = click.x;
    goalPos.y = click.y;
    boxMesh.position.set(click.x, click.y, 0);
  }
}

const clock = new THREE.Clock();


// const boxGeo2 = new THREE.BoxGeometry(.1, .1, .1);
// const boxMat2 = new THREE.MeshStandardMaterial({color: 0x000000});
// const boxMesh2 = new THREE.Mesh(boxGeo2, boxMat2);
// scene.add(boxMesh2);

// const boxGeo3 = new THREE.BoxGeometry(.1, .1, .1);
// const boxMat3 = new THREE.MeshStandardMaterial({color: 0x000000});
// const boxMesh3 = new THREE.Mesh(boxGeo3, boxMat3);
// scene.add(boxMesh3);

//Lines
const lineMat = new THREE.LineBasicMaterial({color: 0x000000});



let root = new Vector3(0,0,0);

let l0 = .1;
let a0 = .3;

let l1 = .5;
let a1 = .3;

let l2 = .5;
let a2 = .3;

let l3 = .5;
let a3 = .3;

let l4 = .5;
let a4 = .3;

let l5 = .5;
let a5 = .3;

let l6 = .1;
let a6 = .3;

let start_l1 = new Vector3();
let start_l2 = new Vector3();
let start_l3 = new Vector3();
let start_l4 = new Vector3();
let start_l5 = new Vector3();
let start_l6 = new Vector3();
let endpoint = new Vector3();

function fk(){
  start_l1 = new Vector3(Math.cos(a0) * l0, Math.sin(a0)*l0, 0).add(root);
  start_l2 = new Vector3(Math.cos(a0+a1) * l1, Math.sin(a0+a1)*l1, 0).add(start_l1);
  start_l3 = new Vector3(Math.cos(a0+a1+a2)*l2, Math.sin(a0+a1+a2)*l2, 0).add(start_l2);
  start_l4 = new Vector3(Math.cos(a0+a1+a2+a3)*l3, Math.sin(a0+a1+a2+a3)*l3, 0).add(start_l3);
  start_l5 = new Vector3(Math.cos(a0+a1+a2+a3+a4)*l4, Math.sin(a0+a1+a2+a3+a4)*l4, 0).add(start_l4);
  start_l6 = new Vector3(Math.cos(a0+a1+a2+a3+a4+a5)*l5, Math.sin(a0+a1+a2+a3+a4+a5)*l5, 0).add(start_l5);
  endpoint = new Vector3(Math.cos(a0+a1+a2+a3+a4+a5+a6)*l6, Math.sin(a0+a1+a2+a3+a4+a5+a6)*l6, 0).add(start_l6);
}

function solve(){
  const goal = goalPos;

  let startToGoal = new Vector3();
  let startToEndEffector = new Vector3();
  let dotProd, angleDiff;

  //left hand
  startToGoal = subVecs(goal, start_l6);
  startToEndEffector = subVecs(endpoint, start_l6);

  dotProd = dotVecs(startToGoal.normalize(), startToEndEffector.normalize());
  dotProd = Math.max(-1, Math.min(1, dotProd));

  angleDiff = Math.acos(dotProd);


  if(crossVecs(startToGoal, startToEndEffector).z < 0){
    a6 += angleDiff;
  } else {
    a6 -= angleDiff;
  }
  a6 = Math.max(-Math.PI/3, Math.min(Math.PI/3, a6));

  fk();

  //left forearm
  startToGoal = subVecs(goal, start_l5);
  startToEndEffector = subVecs(endpoint, start_l5);

  dotProd = dotVecs(startToGoal.normalize(), startToEndEffector.normalize());
  dotProd = Math.max(-1, Math.min(1, dotProd));

  angleDiff = Math.acos(dotProd);


  if(crossVecs(startToGoal, startToEndEffector).z < 0){
    a5 += angleDiff;
  } else {
    a5 -= angleDiff;
  }
  a5 = Math.max(-Math.PI/2, Math.min(.1, a5));

  fk();

  //left Arm
  startToGoal = subVecs(goal, start_l4);
  startToEndEffector = subVecs(endpoint, start_l4);

  dotProd = dotVecs(startToGoal.normalize(), startToEndEffector.normalize());
  dotProd = Math.max(-1, Math.min(1, dotProd));

  angleDiff = Math.acos(dotProd);


  if(crossVecs(startToGoal, startToEndEffector).z < 0){
    a4 += angleDiff;
  } else {
    a4 -= angleDiff;
  }

  a4 = Math.max(-Math.PI/2, Math.min(Math.PI/2, a4));

  fk();

  //body joint
  startToGoal = subVecs(goal, start_l3);
  startToEndEffector = subVecs(endpoint, start_l3);

  dotProd = dotVecs(startToGoal.normalize(), startToEndEffector.normalize());
  dotProd = Math.max(-1, Math.min(1, dotProd));

  angleDiff = Math.acos(dotProd);

  
  if(crossVecs(startToGoal, startToEndEffector).z < 0){
    a3 += angleDiff;
  } else {
    a3 -= angleDiff;
  }

  // a3 = Math.max(-Math.PI/2, Math.min(Math.PI/2, a3));

  fk();
  
  //R_arm
  startToGoal = subVecs(goal, start_l2);
  startToEndEffector = subVecs(endpoint, start_l2);

  dotProd = dotVecs(startToGoal.normalize(), startToEndEffector.normalize());
  dotProd = Math.max(-1, Math.min(1, dotProd));

  angleDiff = Math.acos(dotProd);


    if(crossVecs(startToGoal, startToEndEffector).z < 0){
      a2 += angleDiff;
    } else {
      a2 -= angleDiff;
    }

    a2 = Math.max(-Math.PI/2, Math.min(.1, a2));

  fk();

  //Middle joint
  startToGoal = subVecs(goal, start_l1);
  startToEndEffector = subVecs(endpoint, start_l1);

  dotProd = dotVecs(startToGoal.normalize(), startToEndEffector.normalize());
  dotProd = Math.max(-1, Math.min(1, dotProd));

  angleDiff = Math.acos(dotProd);


  if(crossVecs(startToGoal, startToEndEffector).z < 0){
    a1 += angleDiff;
  } else {
    a1 -= angleDiff;
  }
  a1 = Math.max(-Math.PI/3, Math.min(Math.PI/3, a1));

  fk();

  //r_arm joint
  startToGoal = subVecs(goal, root);
  startToEndEffector = subVecs(endpoint, root);

  dotProd = dotVecs(startToGoal.normalize(), startToEndEffector.normalize());
  dotProd = Math.max(-1, Math.min(1, dotProd));

  angleDiff = Math.acos(dotProd);

  if(crossVecs(startToGoal, startToEndEffector).z < 0){
    a0 += angleDiff;
  } else {
    a0 -= angleDiff;
  }
  // a0 = Math.max(-Math.PI/2, Math.min(0, a0));

  // a0 = Math.max(-Math.PI/3, Math.min(Math.PI/3, a0));

  fk();

  

  
}

function subVecs(v1: Vector3, v2: Vector3){
  return new Vector3(v1.x-v2.x, v1.y-v2.y, v1.z-v2.z);
}

function dotVecs(v1: Vector3, v2: Vector3){
  return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
}

function crossVecs(v1: Vector3, v2: Vector3){
  return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x*v2.z, v1.x * v2.y - v1.y*v2.x);
}

let meshList = [];
var render = function () {
  if(camera.position.z <= 0){
      camera.position.z = 0;
  }

  meshList = [];
  const rootMat = new THREE.MeshStandardMaterial({color: 0xffffff});
  const handMat = new THREE.MeshStandardMaterial({color: 0x000000})
  const shirtMat = new THREE.MeshStandardMaterial({color: 0xaa1100})
  const rootGeo = new THREE.BoxGeometry(l0, .1, .1);
  rootGeo.applyMatrix4( new THREE.Matrix4().makeTranslation( l0/2, 0, 0 ) );
  const rootMesh = new THREE.Mesh(rootGeo, rootMat);
  rootMesh.rotateZ(a0);
  rootMesh.castShadow = true;
  meshList.push(rootMesh);

  const l1Geo = new THREE.BoxGeometry(l1, .1, .1);
  l1Geo.applyMatrix4( new THREE.Matrix4().makeTranslation( l1/2, 0, 0 ) );
  const l1Mesh = new THREE.Mesh(l1Geo, rootMat);
  l1Mesh.position.set(start_l1.x, start_l1.y, 0);
  l1Mesh.rotateZ(a0+a1);
  l1Mesh.castShadow = true;
  meshList.push(l1Mesh);

  const l2Geo = new THREE.BoxGeometry(l2, .1, .1);
  l2Geo.applyMatrix4( new THREE.Matrix4().makeTranslation( l2/2, 0, 0 ) );
  const l2Mesh = new THREE.Mesh(l2Geo, shirtMat);
  l2Mesh.position.set(start_l2.x, start_l2.y, 0);
  l2Mesh.rotateZ(a0+a1+a2);
  l2Mesh.castShadow = true;
  meshList.push(l2Mesh);

  const l3Geo = new THREE.BoxGeometry(l3, .1, .1);
  l3Geo.applyMatrix4( new THREE.Matrix4().makeTranslation( l3/2, 0, 0 ) );
  const l3Mesh = new THREE.Mesh(l3Geo, rootMat);
  l3Mesh.position.set(start_l3.x, start_l3.y, 0);
  l3Mesh.rotateZ(a0+a1+a2+a3);
  l3Mesh.castShadow = true;
  const body = new THREE.BoxGeometry(.5, 1, .2);
  body.applyMatrix4( new THREE.Matrix4().makeTranslation( l3/2, .25, 0 ) );
  const bodyMesh = new THREE.Mesh(body, shirtMat);
  bodyMesh.position.set(l3Mesh.position.x, l3Mesh.position.y, 0);
  bodyMesh.rotateZ(l3Mesh.rotation.z)
  const head = new THREE.SphereGeometry(.2, 16, 16);
  head.applyMatrix4( new THREE.Matrix4().makeTranslation( l3/2, -.4, 0 ) );
  const headMesh = new Mesh(head, rootMat);

  orbitControls.target = l3Mesh.position;
  orbitControls.update();
  
  headMesh.position.set(l3Mesh.position.x, l3Mesh.position.y, 0);
  head.rotateZ(l3Mesh.rotation.z);
  l3Mesh.add(headMesh);
  meshList.push(l3Mesh);
  meshList.push(bodyMesh);
  meshList.push(headMesh);

  const l4Geo = new THREE.BoxGeometry(l4, .1, .1);
  l4Geo.applyMatrix4( new THREE.Matrix4().makeTranslation( l4/2, 0, 0 ) );
  const l4Mesh = new THREE.Mesh(l4Geo, shirtMat);
  l4Mesh.position.set(start_l4.x, start_l4.y, 0);
  l4Mesh.rotateZ(a0+a1+a2+a3+a4);
  l4Mesh.castShadow = true;
  meshList.push(l4Mesh);

  const l5Geo = new THREE.BoxGeometry(l5, .1, .1);
  l5Geo.applyMatrix4( new THREE.Matrix4().makeTranslation( l5/2, 0, 0 ) );
  const l5Mesh = new THREE.Mesh(l5Geo, rootMat);
  l5Mesh.position.set(start_l5.x, start_l5.y, 0);
  l5Mesh.rotateZ(a0+a1+a2+a3+a4+a5);
  l5Mesh.castShadow = true;
  meshList.push(l5Mesh);

  const l6Geo = new THREE.BoxGeometry(l6, .1, .1);
  l6Geo.applyMatrix4( new THREE.Matrix4().makeTranslation( l6/2, 0, 0 ) );
  const l6Mesh = new THREE.Mesh(l6Geo, rootMat);
  l6Mesh.position.set(start_l6.x, start_l6.y, 0);
  l6Mesh.rotateZ(a0+a1+a2+a3+a4+a5+a6);
  l6Mesh.castShadow = true;
  meshList.push(l6Mesh);

  fk();
  solve();

  for(let i = 0; i < meshList.length; i++){
    scene.add(meshList[i]);
  }

  requestAnimationFrame( render );

  renderer.render(scene, camera);

  for(let i = 0; i < meshList.length; i++){
    scene.remove(meshList[i]);
  }
};

render();

let whichHand = true;

document.addEventListener("click", (e)=>{
    e.preventDefault();

    if(whichHand){
        for(const bone of meshList){
            bone.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, -.5, 0 ) );
            // bone.geometry.position.y -= bone.boneLength/2
        }
    } else {
        for(const bone of meshList){
            bone.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, .5, 0 ) );
            // bone.geometry.position.y -= bone.boneLength/2
        }
    }

    whichHand = !whichHand;

})