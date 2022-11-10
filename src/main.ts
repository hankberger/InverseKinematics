//@ts-nocheck
import * as THREE from 'three'
import { AnimationMixer, Bone, Color, Object3D, Vector2, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Bone from './bone';

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
    // const textureLoader = new THREE.TextureLoader();
    // const floorColor = textureLoader.load('/gridbox.png');

    const WIDTH = 80
    const LENGTH = 80

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
        {
          //  map: floorColor
        })
        
        // wrapAndRepeatTexture(material.map);
    // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI / 2
    scene.add(floor)
}

generateFloor();

// function wrapAndRepeatTexture (map: THREE.Texture) {
//   map.wrapS = map.wrapT = THREE.RepeatWrapping
//   map.repeat.x = map.repeat.y = 10
// }

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(- 60, 100, - 10);
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

// document.addEventListener( 'mousedown', onDocumentMouseDown );
// function onDocumentMouseDown( event: any ) {   
  
//   event.preventDefault();
//   // if(event.which === 1){
//   //   var mouse3D = new THREE.Vector3( ( event.clientX/ window.innerWidth ) * 2 - 1,   
//   //                         -( event.clientY / window.innerHeight ) * 2 + 1,  
//   //                           0.5 );     
//   //   var raycaster =  new THREE.Raycaster();                                        
//   //   raycaster.setFromCamera( mouse3D, camera );
//   //   var intersects = raycaster.intersectObjects(scene.children);

    
//   //   if ( intersects.length > 0 ) {
//   //     if(!(intersects[0].object.geometry.type == 'PlaneGeometry')){
//   //       obj = intersects[0].object;
//   //       console.log(obj)
//   //       if(obj.hasOwnProperty('material') && obj.material.hasOwnProperty('emissive')){
//   //         obj.material.emissive.set(0xaaaaaa);
//   //         // controls.attach(obj);
//   //         // scene.add(controls);
//   //       }
        
//   //     }
//   //   }
//   let mouse3D = new THREE.Vector3( ( event.clientX/ window.innerWidth ) * 2 - 1,   
//                         -( event.clientY / window.innerHeight ) * 2 + 1,  
//                           0.5 );     

//   var raycaster =  new THREE.Raycaster();                                        
//   raycaster.setFromCamera( mouse3D, camera );

//   // Grab all objects that can be intersected.
//   var intersects = raycaster.intersectObjects( scene.children );
//   if ( intersects.length > 0 ) {
//     movements.push(intersects[ 0 ].point);
//   }
// }

const bone = new Bone("root");
console.log(bone);
// scene.add(bone.geometry);

const clock = new THREE.Clock();
var render = function () {
    requestAnimationFrame( render );
  
    renderer.render(scene, camera);
  };
  
render();