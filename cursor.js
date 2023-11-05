import * as THREE from "three";
import { camera, onCursorZChange, render, scene } from "./scene.js";

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
    cursorPosition.z += 0.5;
  } else if (event.key === "ArrowUp") {
    if (cursorPosition.z <= -120) return;
    cursorPosition.z -= 0.5;
  }
  computePosition();
  render();
  onCursorZChange(cursorPosition.z);
};
const onScroll = (event) => {
  if (event.deltaY < 0) {
    if (cursorPosition.z <= -120) return;
    cursorPosition.z -= 0.5;
  } else {
    if (cursorPosition.z >= -5) return;
    cursorPosition.z += 0.5;
  }
  computePosition();
  render();
  onCursorZChange(cursorPosition.z);
};

const cursor = createCursor();
window.addEventListener("mousemove", onMouseMove.bind(this));
window.addEventListener("keydown", onKeydown.bind(this));
window.addEventListener("wheel", onScroll.bind(this));
