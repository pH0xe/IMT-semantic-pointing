import * as Three from "three";

/**
 * It is a singleton. Use Cursor.instance to access it.
 *
 * @typedef Cursor
 * @property {Three.Mesh} cursor
 * @property {Three.Vector3} cursorSpeed
 * @property {Three.Vector3} cursorPosition
 */
export class Cursor {
  _instance;

  static get instance() {
    if (!this._instance) {
      this._instance = new Cursor();
    }
    return this._instance;
  }

  /** @type {Three.Mesh} */
  cursor;

  /** @type {Three.Vector3} */
  cursorSpeed;

  static INITIAL_CURSOR_POSITION = new Three.Vector3(0, 0, -15);

  constructor() {
    this.cursorSpeed = new Three.Vector3();
    this.cursorPosition = new Three.Vector3();
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
}
