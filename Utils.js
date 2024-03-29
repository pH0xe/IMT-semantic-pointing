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
  static minSpeed = 0.02;
  static curveFlateness = 30;
  static gapShape = 1;
  static gapWidth = 0.25;

  /**
   *
   * @param {THREE.Vector3} axisDistance La distance entre le curseur et la forme sur un axe
   * @param {number} distance La distance entre le curseur et la forme tout axe confondu
   * @returns {number} la vitesse de déplacement sur un axe
   */
  static speed(axisDistance, distance) {
    if (this.semanticPointigEnabled) {
      let speed =
        Utils.minSpeed +
        Math.log(1 + axisDistance ** (2 * Utils.gapShape) / Utils.gapWidth) /
          Math.log(10 ** Utils.curveFlateness);

      // on pondère la vitesse sur cette axe par la distance absolue
      speed = speed * distance * 0.25;
      if (speed > this.defaultSpeed) {
        return this.defaultSpeed;
      }
      if (speed < this.minSpeed) {
        return this.minSpeed;
      }
      return speed;
    } else {
      return this.defaultSpeed;
    }
  }

  static minDistance() {
    const distancesVectors = Scene.instance.crosses
      .map((cross) => cross.position.clone())
      .map((position) => position.sub(Cursor.instance.cursor.position));

    const minDistance = distancesVectors.reduce(
      (minDistance, distance) =>
        distance.length() < minDistance.length() ? distance : minDistance,
      new THREE.Vector3(Infinity, Infinity, Infinity)
    );

    return { vector: minDistance, distance: minDistance.length() };
  }

  static speedVector() {
    const { vector, distance } = Utils.minDistance();
    return new THREE.Vector3(
      ...vector.toArray().map((dv) => Utils.speed(dv, distance))
    );
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
