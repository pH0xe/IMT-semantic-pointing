import { Cursor } from "./Cursor.js";
import { Scene } from "./Scene.js";
import { Utils } from "./Utils.js";

export class Keyboard {
  /** @type {Keyboard} */
  _instance;

  /** @type {Keyboard} */
  static get instance() {
    if (!this._instance) {
      this._instance = new Keyboard();
    }
    return this._instance;
  }

  _events = {
    x: 0,
    y: 0,
    z: 0,
  };

  static UP = "z";
  static DOWN = "s";
  static LEFT = "q";
  static RIGHT = "d";
  static FORWARD = "e";
  static BACKWARD = "a";

  static DEFAULT_SPEED = 0.5;

  onKeyPress(event) {
    const key = event.key;
    switch (key) {
      case Keyboard.UP:
        this._events.y = 1;
        break;
      case Keyboard.DOWN:
        this._events.y = -1;
        break;
      case Keyboard.LEFT:
        this._events.x = -1;
        break;
      case Keyboard.RIGHT:
        this._events.x = 1;
        break;
      case Keyboard.FORWARD:
        this._events.z = -1;
        break;
      case Keyboard.BACKWARD:
        this._events.z = 1;
        break;
    }
  }

  loop() {
    if ((this._events.x != 0) | (this._events.y != 0) | (this._events.z != 0)) {
      const crosses = Scene.instance.crosses;
      const distances = crosses.map((cross) =>
        cross.getDistance(Cursor.instance.cursor.position)
      );
      const speed = Utils.getSpeed(distances);
      Cursor.instance.translateCursor(
        this._events.x * Keyboard.DEFAULT_SPEED * speed,
        this._events.y * Keyboard.DEFAULT_SPEED * speed,
        this._events.z * Keyboard.DEFAULT_SPEED * speed
      );
      if (this._events.z != null) {
        Scene.instance.onCursorZChange(Cursor.instance.cursor.position.z);
      }
      this._events.x = 0;
      this._events.y = 0;
      this._events.z = 0;
    }
  }
}
