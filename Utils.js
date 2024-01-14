import * as THREE from "three";
import { Cross } from "./Cross";
import { Cursor } from "./Cursor";
import { GamepadSemantics } from "./GamepadSemantics";
import { Keyboard } from "./Keyboard";
import { Scene } from "./Scene";

export class Utils {
  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * @param {THREE.Vector3} point1
   * @param {THREE.Vector3} point2
   * @returns {{x: boolean, y: boolean, z: boolean}}
   */
  static isInScene(point1, point2) {
    const x =
      point1.x >= Scene.LEFT_WALL_X &&
      point1.x <= Scene.RIGHT_WALL_X &&
      point2.x >= Scene.LEFT_WALL_X &&
      point2.x <= Scene.RIGHT_WALL_X;
    const y =
      point1.y >= Scene.FLOOR_Y &&
      point1.y <= Scene.CEILING_Y &&
      point2.y >= Scene.FLOOR_Y &&
      point2.y <= Scene.CEILING_Y;
    const z =
      point1.z >= Scene.BACK_WALL_Z &&
      point1.z <= -10 &&
      point2.z >= Scene.BACK_WALL_Z &&
      point2.z <= -10;

    return { x, y, z };
  }

  static semanticPointigEnabled = true;
  static defaultSpeed = 0.1;

  // To test parameters
  // https://www.geogebra.org/m/smy7cmzg
  static minSpeed = 0.01;
  static curveFlateness = 15;
  static gapShape = 1;
  static gapWidth = 1;

  static speed() {
    if (this.semanticPointigEnabled) {
      return (
        Utils.minSpeed +
        Math.log(
          1 + Utils.minDistance() ** (2 * Utils.gapShape) / 10 ** Utils.gapWidth
        ) /
          Utils.curveFlateness
      );
    } else {
      return this.defaultSpeed;
    }
  }

  static minDistance() {
    const distances = Scene.instance.crosses
      .map((cross) => cross.position.clone())
      .map((position) =>
        position.sub(Cursor.instance.cursor.position).length()
      );

    return Math.min(...distances);
  }

  static speedVector() {
    return new THREE.Vector3(Utils.speed(), Utils.speed(), Utils.speed());
  }

  /**
   * @param {number} count
   * @returns {Cross[]}
   */
  static generateCrosses(count = 10) {
    const crosses = [];
    for (let i = 0; i < count; i++) {
      const translateZ = Utils.random(-100, -10);
      const translateX = Utils.random(-translateZ, translateZ);
      // plus on est loin plus l'intervalle x et y est grand
      const translateY = Utils.random(0, -translateZ / 2);
      crosses.push(
        new Cross(new THREE.Vector3(translateX, translateY, translateZ))
      );
    }

    return crosses;
  }

  static animate() {
    GamepadSemantics.instance.loop();
    Keyboard.instance.loop();
    Scene.instance.render();
  }

  static toggleCommandsVisibility() {
    const commands = document.getElementById("commands");
    commands.classList.toggle("minimized");

    const btnOpen = document.getElementById("btn-open");
    btnOpen.classList.toggle("hidden");
  }

  static initListerner() {
    const regenerateButton = document.getElementById("btn-regenerate");
    regenerateButton.addEventListener(
      "click",
      Scene.instance.regenerateCrosses.bind(Scene.instance)
    );

    const btnOpen = document.getElementById("btn-open");
    btnOpen.addEventListener("click", Utils.toggleCommandsVisibility);

    const btnClose = document.getElementById("btn-close");
    btnClose.addEventListener("click", Utils.toggleCommandsVisibility);

    const btnSemanticPointig = document.getElementById(
      "checkbox-semantic-pointing"
    );
    btnSemanticPointig.addEventListener("change", () => {
      this.semanticPointigEnabled = btnSemanticPointig.checked;
    });

    const btnSwitchAxe = document.getElementById("btn-axez");
    btnSwitchAxe.addEventListener(
      "click",
      GamepadSemantics.instance.switchAxeZ.bind(GamepadSemantics.instance)
    );

    window.addEventListener(
      "resize",
      Scene.instance.onWindowResize.bind(Scene.instance)
    );

    // init Gamepad listeners
    window.addEventListener(
      "gamepadconnected",
      GamepadSemantics.instance.onGamepadConnected.bind(
        GamepadSemantics.instance
      )
    );
    window.addEventListener(
      "gamepaddisconnected",
      GamepadSemantics.instance.onGamepadDisconnected.bind(
        GamepadSemantics.instance
      )
    );

    // init Keyboard listeners (backup if no gamepad)
    window.addEventListener(
      "keydown",
      Keyboard.instance.onKeyPress.bind(Keyboard.instance),
      true
    );
  }
}
