import anime from "animejs";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

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

const floor = new THREE.Mesh(new THREE.BoxGeometry(34, 0.1, 20), floorMaterial);
scene.add(floor);
floor.position.set(0, -0.5, 0);

/**
 * wall
 */

const wallX = 12;
const wallY = -0.5;
const wallZ = 0;

const wall1 = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 20), wallMaterial);
scene.add(wall1);
wall1.position.set(wallX, wallY, wallZ);

const wall2 = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 20), wallMaterial);
scene.add(wall2);
wall2.position.set(-wallX, wallY, wallZ);

/**
 * raquette
 */

const raquetteX = 8;
const raquetteY = 0.5;
const raquetteZ = 0;

const raquette1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 1, 3),
  new THREE.MeshBasicMaterial({
    color: 0xbb0000,
  })
);

scene.add(raquette1);
raquette1.position.set(-raquetteX, raquetteY, raquetteZ);

const raquette2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 1, 3),
  new THREE.MeshBasicMaterial({
    color: 0xbb0000,
  })
);
scene.add(raquette2);
raquette2.position.set(raquetteX, raquetteY, raquetteZ);

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
camera.position.y = 10;
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

/**
 * keyboard
 */

const paddleSpeed = 0.3;
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  z: false,
  s: false,
};

window.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
  }
});

const ballSpeed = { x: 0.1, y: 0.1, z: 0 };
let point1 = 0;
let point2 = 0;

console.log("score :", point1, "-", point2);

/**
 * score
 */

const tick = () => {
  // Update controls
  controls.update();

  if (keys.ArrowUp) {
    if (!(raquette2.position.z <= -6)) {
      raquette2.position.z -= paddleSpeed;
    }
  }
  if (keys.ArrowDown) {
    if (!(raquette2.position.z > 6)) {
      raquette2.position.z += paddleSpeed;
    }
  }
  if (keys.z) {
    if (!(raquette1.position.z <= -6)) {
      raquette1.position.z -= paddleSpeed;
    }
  }
  if (keys.s) {
    if (!(raquette1.position.z > 6)) {
      raquette1.position.z += paddleSpeed;
    }
  }

  // Move ball
  ball.position.x += ballSpeed.x;
  ball.position.z += ballSpeed.z;

  // Check for collisions with walls
  if (ball.position.z >= wallX - 5 || ball.position.z <= -wallX + 5) {
    ballSpeed.z = -ballSpeed.z;
  }

  /**
   * points
   */

  if (ball.position.x >= wallX) {
    point1 += 1;
    console.log("point pour joueur 1", point1, "-", point2);
    ball.position.x = 0;
    ballSpeed.z = 0;
    scene.remove(textMesh);
  }
  if (ball.position.x <= -wallX) {
    point2 += 1;
    console.log("point pour joueur 2", point1, "-", point2);
    ball.position.x = 0;
    ballSpeed.z = 0;
    scene.remove(textMesh);
  }
  let score = `score : ${point1} "-" ${point2}`;

  const loader = new FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry(score, {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.set(-4, 2, -5); // Adjust the position as needed
      scene.add(textMesh);
      textMesh.rotation.x = -Math.PI / 2;
    }
  );
  /**
   * raquette balle physique
   */
  if (
    (ball.position.x <= raquette1.position.x + 0.25 &&
      ball.position.x >= raquette1.position.x - 0.25 &&
      ball.position.z <= raquette1.position.z + 1.5 &&
      ball.position.z >= raquette1.position.z - 1.5) ||
    (ball.position.x <= raquette2.position.x + 0.25 &&
      ball.position.x >= raquette2.position.x - 0.25 &&
      ball.position.z <= raquette2.position.z + 1.5 &&
      ball.position.z >= raquette2.position.z - 1.5)
  ) {
    // Check for collisions with paddles
    ballSpeed.x = -ballSpeed.x;
    // rajouter un mouvement de hauteur a la balle
    ballSpeed.z = Math.random() * 0.1;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
