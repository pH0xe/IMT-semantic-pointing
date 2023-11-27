import * as THREE from "three";
import { camera, onCursorZChange, render, sceneCrosses } from "./scene.js";

// To test parameters
// https://www.geogebra.org/calculator/znz4mzve
const minSpeed = 0.1;
const curveFlateness = 2.7;
const gapShape = 1;
const gapWidth = 1;

let cursor;

let gamepadIndex;

const AXE_X_1 = 0;
const AXE_Y = 1;
const AXE_X_2 = 2;
const AXE_Z = 3;

const axe_min = 0.1;

const speed = (distance) => {
  return (
    minSpeed +
    Math.log(1 + distance ** (2 * gapShape) / gapWidth) /
      Math.log(10 ** curveFlateness)
  );
};

let cursorSpeed = new THREE.Vector3();

const cursorPosition = new THREE.Vector3();
cursorPosition.z = -15;

// cursor will be a pyramid, add it to the scene
export const createCursor = () => {
  const geometry = new THREE.ConeGeometry(1, 3, 4);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const newCursor = new THREE.Mesh(geometry, material);
  newCursor.position.set(cursorPosition.x, cursorPosition.y, cursorPosition.z);
  cursor = newCursor;
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
  const distance = (cross, axis) =>
    Math.abs(cross.position[axis] - cursorPosition[axis]);

  return new THREE.Vector3(
    ...["x", "y", "z"].map((axis) =>
      sceneCrosses.reduce(
        (minDistance, cross) => Math.min(minDistance, distance(cross, axis)),
        Infinity
      )
    )
  );
};

const speedPerAxis = () => {
  const s = speed(minDistance());
  return new THREE.Vector3(s, s, s);
};

const distance2points = (v1, v2) => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  const dz = v1.z - v2.z;
  return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
};

const minDistance = () => {
  const distances = sceneCrosses.map((c) =>
    distance2points(c.position, cursorPosition)
  );
  return distances.reduce((minDistance, distance) =>
    Math.min(minDistance, distance)
  );
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

  if (cursorSpeed.z !== 0) onCursorZChange(cursorPosition.z);

  cursorSpeed = new THREE.Vector3();
};

const onGamepadConnected = (event) => {
  gamepadIndex = event.gamepad.index;
};

const onGamepadDisconnected = (event) => {
  gamepadIndex = null;
};

export const gamepadLoop = () => {
  const gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
    ? navigator.webkitGetGamepads()
    : [];

  /** @type {Gamepad | null} */
  const gamepad = gamepads[gamepadIndex];
  if (!gamepad) return;

  if (
    updateGamepadAxes(gamepad.axes[AXE_X_1], "x") |
    updateGamepadAxes(-gamepad.axes[AXE_Y], "y") |
    updateGamepadAxes(gamepad.axes[AXE_Z], "z")
  ) {
    cursor.position.set(cursorPosition.x, cursorPosition.y, cursorPosition.z);
    // console.log(cursorPosition);
    render();
  }
};

const updateGamepadAxes = (axe, cursorCoord) => {
  if (Math.abs(axe) - axe_min > 0) {
    cursorPosition[cursorCoord] += speedPerAxis()[cursorCoord] * axe;
    if (cursorCoord === "z") onCursorZChange(cursorPosition.z);
    return true;
  }
  return false;
};

window.addEventListener("mousemove", onMouseMove.bind(this));
window.addEventListener("keydown", onKeydown.bind(this));
window.addEventListener("wheel", onScroll.bind(this));
window.addEventListener("gamepadconnected", onGamepadConnected.bind(this));
window.addEventListener(
  "gamepaddisconnected",
  onGamepadDisconnected.bind(this)
);
