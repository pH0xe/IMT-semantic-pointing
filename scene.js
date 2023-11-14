import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { generateCrosses } from "./generator";
import { createCursor, gamepadLoop } from "./cursor";

export let sceneCrosses = [];
export const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const crosses = generateCrosses(10);
scene.add(...crosses);
sceneCrosses = crosses;

document.body.appendChild(renderer.domElement);
render();

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

export function render() {
  renderer.render(scene, camera);
}

export function removeCrosses() {
  scene.remove(...sceneCrosses);
  render();
}

export function addCrosses(crosses) {
  scene.add(...crosses);
  sceneCrosses = crosses;
  render();
}

export function addTexture() {
  return new Promise((resolve) => {
    new RGBELoader().load("interior_views_church-dark-min.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      // change color of crosses to 0x6c5ce7
      sceneCrosses.forEach((cross) => {
        cross.material.color = new THREE.Color(0x6c5ce7);
      });
      render();
      resolve();
    });
  });
}

export function removeTexture() {
  scene.background = null;
  scene.environment = null;
  // change color of crosses to 0xffffff
  sceneCrosses.forEach((cross) => {
    cross.material.color = new THREE.Color(0xffffff);
  });
  render();
  return Promise.resolve();
}

export function onCursorZChange(z) {
  const depth = 0.5;
  const after = sceneCrosses.filter((cross) => cross.position.z < z - depth);
  const before = sceneCrosses.filter((cross) => cross.position.z > z + depth);
  const inCrosses = sceneCrosses.filter(
    (cross) => cross.position.z >= z - depth && cross.position.z <= z + depth
  );

  before.forEach((cross) => {
    cross.material.color = new THREE.Color(0x6c5ce7);
  });

  after.forEach((cross) => {
    cross.material.color = new THREE.Color(0xffffff);
  });

  inCrosses.forEach((cross) => {
    cross.material.color = new THREE.Color(0x00ff00);
  });
  render();
}

scene.add(createCursor());

const animate = () => {
  gamepadLoop();
  render();
};
renderer.setAnimationLoop(animate);
