import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
camera.position.set(-4.601674459297036, 1.5488633359422002, 8.005328489976879);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// init
new RGBELoader().load("interior_views_church-dark-min.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.rotation = 3;

  scene.background = texture;
  scene.environment = texture;

  const cross = [
    [
      [2, 1],
      [3, 6],
      [3, 1],
    ],
    [
      [2, 1],
      [2, 6],
      [3, 6],
    ],
    [
      [1, 5],
      [2, 5],
      [2, 4],
    ],
    [
      [1, 5],
      [2, 4],
      [1, 4],
    ],
    [
      [3, 5],
      [4, 4],
      [3, 4],
    ],
    [
      [3, 5],
      [4, 5],
      [4, 4],
    ],
  ];

  const depth = 0.5;
  const rear = 1 - depth;
  const geometry = new THREE.BufferGeometry();
  const frontCross = cross.flatMap((t) => t.flatMap((p) => [...p, rear]));
  const backCross = cross.flatMap((t) => t.reverse().flatMap((p) => [...p, 1]));
  const vertices = new Float32Array([
    ...frontCross,
    ...backCross,
    3,
    4,
    rear,
    3,
    1,
    1,
    3,
    1,
    rear,
    3,
    4,
    rear,
    3,
    4,
    1,
    3,
    1,
    1,
    3,
    4,
    rear,
    4,
    4,
    rear,
    4,
    4,
    1,
    3,
    4,
    rear,
    4,
    4,
    1,
    3,
    4,
    1,
    4,
    5,
    rear,
    4,
    5,
    1,
    4,
    4,
    1,
    4,
    5,
    rear,
    4,
    4,
    1,
    4,
    4,
    rear,
    3,
    5,
    rear,
    4,
    5,
    1,
    4,
    5,
    rear,
    3,
    5,
    rear,
    3,
    5,
    1,
    4,
    5,
    1,
    3,
    6,
    rear,
    3,
    5,
    1,
    3,
    5,
    rear,
    3,
    6,
    rear,
    3,
    6,
    1,
    3,
    5,
    1,
    3,
    6,
    rear,
    2,
    6,
    1,
    3,
    6,
    1,
    3,
    6,
    rear,
    2,
    6,
    rear,
    2,
    6,
    1,
    2,
    6,
    1,
    2,
    6,
    rear,
    2,
    5,
    rear,
    2,
    6,
    1,
    2,
    5,
    rear,
    2,
    5,
    1,
    2,
    5,
    1,
    2,
    5,
    rear,
    1,
    5,
    rear,
    2,
    5,
    1,
    1,
    5,
    rear,
    1,
    5,
    1,
    1,
    5,
    1,
    1,
    5,
    rear,
    1,
    4,
    rear,
    1,
    5,
    1,
    1,
    4,
    rear,
    1,
    4,
    1,
    1,
    4,
    1,
    1,
    4,
    rear,
    2,
    4,
    rear,
    1,
    4,
    1,
    2,
    4,
    rear,
    2,
    4,
    1,
    2,
    4,
    1,
    2,
    4,
    rear,
    2,
    1,
    rear,
    2,
    4,
    1,
    2,
    1,
    rear,
    2,
    1,
    1,
    2,
    1,
    1,
    2,
    1,
    rear,
    3,
    1,
    rear,
    2,
    1,
    1,
    3,
    1,
    rear,
    3,
    1,
    1,
  ]);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-4.601674459297036, 5, 8.005328489976879);
  scene.add(light);
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  // animation
  mesh.rotation.set(0, -0.252 * Math.PI, 0);

  renderer.render(scene, camera);
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
