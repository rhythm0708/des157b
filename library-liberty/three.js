import * as THREE from 'three';
import { invertY, volumeValue } from './script.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

// Testing coordinates.
const catCoords = [[-0.5,2.05,-1.2], [-0,1,0.1], [-1.2,1,-1], [0.5,2.8,-1], [0,0,-1.5]];
const catRotations = [Math.PI/6,0,Math.PI/2, Math.PI/4, Math.PI];
const clickableMeshes = [];

// Map.
const catData = new Map();
const catInverseData = new Map();

// Set up renderer.
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x777777, 0);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.querySelector("#activity").appendChild( renderer.domElement );

// Set scene and camera.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,1,5);

// Raycast and mouse.
const raycaster = new THREE.Raycaster();
raycaster.params.Mesh.side = THREE.DoubleSide;
const mouse = new THREE.Vector2();

// Lighting.
const spotlight = new THREE.SpotLight(0xffffff, 1.5, 100, Math.PI / 4, 0.5);
spotlight.position.set(0, 25, 0);
spotlight.target.position.set(0, 0, 0);
spotlight.castShadow = true;
scene.add(spotlight);
scene.add(spotlight.target);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

// Load bunny model.
const loader = new GLTFLoader().setPath("models/bunny_head_hair_pin/");
loader.load("scene.gltf", (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0,1.05,-1);
    scene.add(mesh);

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xFFC0CB,  
              roughness: 0.5,
              metalness: 0.8,
              emissive: 0x444444,
              wireframe: false,  
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
    });
});

// Load cat models.
loader.setPath('models/cat_cartoon_character/');
loader.load('scene.gltf', (gltf) => {
    const cat = gltf.scene;
    for (let i = 0; i < 5; i++) {
        const catClone = cat.clone(true);
        catClone.position.set(catCoords[i][0], catCoords[i][1], catCoords[i][2]);
        catClone.rotation.z = catRotations[i];
        catClone.scale.set(0.1, 0.1, 0.1);
        catClone.updateMatrixWorld(true, false);
        catData.set(catClone, i);
        catInverseData.set(i, catClone);
        scene.add(catClone);

        catClone.traverse((child) => {
          if (child.isMesh) {
              clickableMeshes.push(catClone);
          }
          if (child.geometry) {
            child.geometry.computeBoundingBox();
            child.geometry.computeBoundingSphere();
          }
        });

        // Bounding Box.
        // const helper = new THREE.BoxHelper(catClone, 0x00ff00);
        // scene.add(helper);

        console.log(`Cat #${i + 1} position:`, catClone.position);
    }
});

// Set up controls.
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 1;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 2;
controls.rotateSpeed = 1;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0,1,1);


renderer.setAnimationLoop( animate );
window.addEventListener('click', onMouseClick, false);

function animate() {
  if(invertY) {
    // WIP.
  }
  controls.update();
  renderer.render( scene, camera );
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if(invertY) {
    mouse.y = -mouse.y;
    controls.rotateSpeed = -1;
    console.log("inverted");
  }

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableMeshes, true);
  if (intersects.length > 0) {
    let clicked = intersects[0].object;

    while (clicked.parent && clicked.parent.type !== 'Scene') {
      clicked = clicked.parent;
    }

    const catIndex = catData.get(clicked);
    if (catIndex || catIndex == 0) {
        foundCat(catIndex);
    } else {
        alert(catIndex);
        console.log("No data found for this object.");
    }
  }
}

// FOUND CAT.
const meows = ['audio/meow-1.wav', 'audio/meow-2.mp3', 'audio/meow-3.wav'];

function foundCat(index) {
  // Tick.
  const catID = `#cat-${index+1}`;
  document.querySelector(catID).firstElementChild.className = "check";

  // Cat disappears.
  let catObj = catInverseData.get(index);
  if(catObj) {
    scene.remove(catObj);
  }

  // Meow.
  let randomMeowNum = Math.floor(Math.random() * 3);
  let selectedMeow = new Audio(meows[randomMeowNum]);
  selectedMeow.volume = volumeValue/100;
  selectedMeow.play();

  // Check all cats found.
  checkAllCatsFound();
}

let cats = document.querySelectorAll(".cat");
const jsConfetti = new JSConfetti()

function checkAllCatsFound(){
  let allFound = false;
  for(let cat of cats) {
    if(cat.firstElementChild.className != "check") {
      allFound = false;
      break;
    } else {
      allFound = true;
    }
  }
  if(allFound) {
    jsConfetti.addConfetti();
  }
}