import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { generateCrosses } from "./generator.js";

const width = window.innerWidth,
  height = window.innerHeight;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.25,
  20
);
// camera.position.set(-4.601674459297036, 1.5488633359422002, 8.005328489976879);
camera.position.set(0, 0, 0);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// init
new RGBELoader().load("interior_views_church-dark-min.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.rotation = 3;

  scene.background = texture;
  scene.environment = texture;

  const meshs = generateCrosses(10);
  scene.add(...meshs);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-4.601674459297036, 5, 8.005328489976879);
  scene.add(light);
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  render();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", render); // use if there is no animation loop
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set(2.5, 3.5, 1);
controls.update();

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

//

function render() {
  renderer.render(scene, camera);
}
