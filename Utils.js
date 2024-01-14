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
   * @param {THREE.Vector3} point
   */
  static isOnScreen(point) {
    const frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        Scene.instance.camera.projectionMatrix,
        Scene.instance.camera.matrixWorldInverse
      )
    );
    return frustum.containsPoint(point);
  }

  static semanticPointigEnabled = true;
  static defaultSpeed = 0.1;

  // To test parameters
  // https://www.geogebra.org/calculator/znz4mzve
  static minSpeed = 0.02;
  static curveFlateness = 15;
  static gapShape = 1;
  static gapWidth = 1;

  static speed(distance) {
    if (this.semanticPointigEnabled) {
      return (
        Utils.minSpeed +
        Math.log(1 + distance ** (2 * Utils.gapShape) / Utils.gapWidth) /
          Math.log(10 ** Utils.curveFlateness)
      );
    } else {
      return this.defaultSpeed;
    }
  }

  static minDistance() {
    const distances = Scene.instance.crosses.map((cross) =>
      cross.position.clone().sub(Cursor.instance.cursor.position)
    );
    return distances.reduce(
      (minDistance, distance) =>
        distance.length() < minDistance.length() ? distance : minDistance,
      new THREE.Vector3(Infinity, Infinity, Infinity)
    );
  }

  static speedPerAxis() {
    return new THREE.Vector3(
      ...Utils.minDistance()
        .toArray()
        .map((distance) => Utils.speed(distance))
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

    const btnTitoubiz = document.getElementById("btn-titoubiz");
    btnTitoubiz.addEventListener("click", () => {
      alert("Je suis une brique !!!!!!");
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
