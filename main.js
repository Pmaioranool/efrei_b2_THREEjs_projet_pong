import anime from "animejs";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas#webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// TODO: a commenter
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 0.75);
scene.add(directionLight);
/**
 * textures
 */

const textureLoader = new THREE.TextureLoader();

const texturesRoot = "/textures/";

const textureFiles = [
  "Roughness.jpg",
  "opacity.jpg",
  "normal.jpg",
  "metallic.jpg",
  "height.png",
  "basecolor.jpg",
  "ambientOcclusion.jpg",
];

const textureKeys = [
  "roughnessMap",
  "alphaMap",
  "normalMap",
  "metalnessMap",
  "displacementMap",
  "map",
  "aoMap",
];

function loadAndConfigureTexture(fileName, texturesRootName) {
  const texture = textureLoader.load(
    `${texturesRoot}${texturesRootName}_${fileName}`
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set = (5, 3);
  return texture;
}

function loadTextures(texturesRootName) {
  const texturesToLoad = Object.fromEntries(
    textureKeys.map((key, index) => [
      key,
      loadAndConfigureTexture(textureFiles[index], texturesRootName),
    ])
  );

  return Object.fromEntries(
    Object.entries(texturesToLoad).map(([textureKey, texture]) => {
      console.log(texture.repeat);
      return [textureKey, texture];
    })
  );
}

const floorTextures = loadTextures("bricks/Substance_graph");
const wallTextures = loadTextures("papier/Wallpaper_ArtDeco_001");

const floorMaterial = new THREE.MeshStandardMaterial({
  ...floorTextures,
  displacementScale: 0,
});

const wallMaterial = new THREE.MeshStandardMaterial({
  ...wallTextures,
  displacementScale: 0,
});

/**
 * floor
 */

const floor = new THREE.Mesh(new THREE.BoxGeometry(17, 0.1, 10), floorMaterial);
scene.add(floor);
floor.position.set(0, -0.5, 0);

/**
 * wall
 */

const wall1 = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 10), wallMaterial);
scene.add(wall1);
wall1.position.set(7, -0.5, 0);

const wall2 = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 10), wallMaterial);
scene.add(wall2);
wall2.position.set(-7, -0.5, 0);

/**
 * raquette
 */

const raquette1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 1, 3),
  new THREE.MeshBasicMaterial({
    color: 0xbb0000,
  })
);

scene.add(raquette1);
raquette1.position.set(-3, 0.5, 0);

const raquette2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 1, 3),
  new THREE.MeshBasicMaterial({
    color: 0xbb0000,
  })
);
scene.add(raquette2);
raquette2.position.set(3, 0.5, 0);

/**
 * ball
 */

const ball = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32));

scene.add(ball);
ball.position.set(0, 0.5, 0);
ball.rotation.x = 5;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 0;
scene.add(camera);

// Controls
// TODO: a commenter
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
window.controls = controls;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Mouse
 */
let cursor = null;
canvas.addEventListener("mousemove", (evt) => {
  if (cursor === null) {
    cursor = {
      x: 0,
      y: 0,
    };
  }
  cursor.x = (evt.clientX / sizes.width) * 2 - 1;
  cursor.y = -(evt.clientY / sizes.height) * 2 + 1;
});

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
