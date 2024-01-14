import * as THREE from "three";
import { Utils } from "./Utils";

/**
 * It is a singleton. Use Cursor.instance to access it.
 *
 * @typedef Cursor
 * @property {THREE.Mesh} cursor
 */
export class Cursor {
  /** @type {Cursor} */
  _instance;

  /** @type {Cursor} */
  static get instance() {
    if (!this._instance) {
      this._instance = new Cursor();
    }
    return this._instance;
  }

  /** @type {THREE.Mesh} */
  cursor;

  /** @type {THREE.PointLight} */
  pointLight;

  static INITIAL_CURSOR_POSITION = new THREE.Vector3(0, 0, -15);
  static CURSOR_RADIUS = 1;
  static CURSOR_HEIGHT = 3;
  static CURSOR_SEGMENTS = 4;

  constructor() {
    this.initCursor();
    this.pointLight = new THREE.PointLight(0xffff00, 30, 100);
    this.updateLightPosition();
  }

  get position() {
    return this.cursor.position;
  }

  initCursor() {
    const geometry = new THREE.ConeGeometry(
      Cursor.CURSOR_RADIUS,
      Cursor.CURSOR_HEIGHT,
      Cursor.CURSOR_SEGMENTS
    );
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.cursor = new THREE.Mesh(geometry, material);
    this.cursor.castShadow = true;
    this.cursor.position.set(
      Cursor.INITIAL_CURSOR_POSITION.x,
      Cursor.INITIAL_CURSOR_POSITION.y,
      Cursor.INITIAL_CURSOR_POSITION.z
    );
  }

  /**
   * @param {number} x New x position
   * @param {number} y New y position
   * @param {number} z New z position
   */
  updateCursorPosition(x, y, z) {
    const newPosition = new THREE.Vector3(x, y, z);
    if (Utils.isOnScreen(newPosition)) {
      this.cursor.position.set(x, y, z);
      this.updateLightPosition();
      return true;
    }
    return false;
  }

  updateLightPosition() {
    this.pointLight.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  translateCursor(x, y, z) {
    const newPosition = this.cursor.position.clone();
    newPosition.x += x;
    newPosition.y += y;
    newPosition.z += z;
    if (Utils.isOnScreen(newPosition)) {
      this.cursor.position.x += x;
      this.cursor.position.y += y;
      this.cursor.position.z += z;
      this.updateLightPosition();

      return true;
    }
    return false;
  }
}
