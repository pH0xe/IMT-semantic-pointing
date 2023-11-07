import * as THREE from "three";
import { camera, onCursorZChange, render, scene, sceneCrosses } from "./scene.js";

let cursorSpeed = new THREE.Vector3();

const cursorPosition = new THREE.Vector3();
cursorPosition.z = -15;

// cursor will be a pyramid, add it to the scene
const createCursor = () => {
  const geometry = new THREE.ConeGeometry(1, 3, 4);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const cursor = new THREE.Mesh(geometry, material);
  cursor.position.set(cursorPosition.x, cursorPosition.y, cursorPosition.z);
  scene.add(cursor);
  return cursor;
};

const onMouseMove = (event) => {
  event.preventDefault();
  cursorPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  cursorPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

  computePosition();
  render();
};

const minDistancePerAxis = () => {
  const distance = (cross, axis) => Math.abs(cross.position[axis] - cursorPosition[axis]);

  return new THREE.Vector3(...['x', 'y', 'z'].map((axis) =>
    sceneCrosses.reduce(
      (minDistance, cross) => Math.min(minDistance, distance(cross, axis)),
      Infinity,
    ),
  ));
};

const speedPerAxis = () => {
  const a = new THREE.Vector3(...minDistancePerAxis()
    .toArray()
    .map(d => Math.abs(d))
    .map(d => 0.1 + Math.log10(0.5 * d**2 + 1)));
  return a;
}

const computePosition = () => {
  const vector = new THREE.Vector3(
    cursorPosition.x,
    cursorPosition.y,
    cursorPosition.z
  );
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -cursorPosition.z / dir.z;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));
  cursor.position.set(-pos.x, -pos.y, -pos.z);
};

const onKeydown = (event) => {
  event.preventDefault();
  if (event.key === "ArrowDown") {
    if (cursorPosition.z >= -5) return;
    cursorSpeed.z = speedPerAxis().z;
  } else if (event.key === "ArrowUp") {
    if (cursorPosition.z <= -120) return;
    cursorSpeed.z = -speedPerAxis().z;
  }

  requestAnimationFrame(animateCursor);
};
const onScroll = (event) => {
  if (event.deltaY < 0) {
    if (cursorPosition.z <= -120) return;
    cursorSpeed.z = -speedPerAxis().z;
  } else {
    if (cursorPosition.z >= -5) return;
    cursorSpeed.z = speedPerAxis().z;
  }

  requestAnimationFrame(animateCursor);
};

const animateCursor = () => {
  cursorPosition.add(cursorSpeed);

  computePosition();

  if (cursorSpeed.z !== 0)
    onCursorZChange(cursorPosition.z);

  cursorSpeed = new THREE.Vector3();
}

const cursor = createCursor();
window.addEventListener("mousemove", onMouseMove.bind(this));
window.addEventListener("keydown", onKeydown.bind(this));
window.addEventListener("wheel", onScroll.bind(this));
