import * as THREE from "three";

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

  static INITIAL_CURSOR_POSITION = new THREE.Vector3(0, 0, -15);

  constructor() {
    this.initCursor();
  }

  initCursor() {
    const geometry = new THREE.ConeGeometry(1, 3, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.cursor = new THREE.Mesh(geometry, material);
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
    this.cursor.position.set(x, y, z);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  translateCursor(x, y, z) {
    this.cursor.position.x += x;
    this.cursor.position.y += y;
    this.cursor.position.z += z;
  }
}
