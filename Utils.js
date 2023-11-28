import { Cross } from "./Cross";
import { GamepadSemantics } from "./GamepadSemantics";
import { Scene } from "./Scene";
import * as THREE from "three";

export class Utils {
  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // To test parameters
  // https://www.geogebra.org/calculator/znz4mzve
  static minSpeed = 0.1;
  static curveFlateness = 2.7;
  static gapShape = 1;
  static gapWidth = 1;
  static getSpeed(distances) {
    const minDistance = Math.min(...distances);
    return (
      Utils.minSpeed +
      Math.log(1 + minDistance ** (2 * Utils.gapShape) / Utils.gapWidth) /
        Math.log(10 ** Utils.curveFlateness)
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
      // plus on est loin plus l'intervalle x et y est grand
      const translateX = Utils.random(-translateZ / 2, translateZ / 2);
      const translateY = Utils.random(-translateZ / 2, translateZ / 2);
      crosses.push(
        new Cross(new THREE.Vector3(translateX, translateY, translateZ))
      );
    }

    return crosses;
  }

  static animate() {
    GamepadSemantics.instance.loop();
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
  }
}
