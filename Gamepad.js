class GamepadSemantics {
  _instance;

  static get instance() {
    if (!this._instance) {
      this._instance = new GamepadSemantics();
    }
    return this._instance;
  }

  static AXE_X = 0;
  static AXE_Y = 1;
  static AXE_Z = 2;
  static AXE_THRESOLD = 0.1;

  /** @type {number | null} */
  gamepadIndex;

  /**
   * Required due to Chrome that does not update the gamepad object
   * @type {(Gamepad | null)[]}
   */
  get gamepads() {
    let gamepads = [];
    if (navigator.getGamepads) {
      gamepads = navigator.getGamepads();
    } else if (navigator.webkitGetGamepads) {
      gamepads = navigator.webkitGetGamepads();
    }
    return gamepads;
  }

  get gamepad() {
    if (this.gamepadIndex == null) return null;
    return this.gamepads[this.gamepadIndex];
  }

  /** @param {GamepadEvent} event */
  onGamepadConnected(event) {
    this.gamepadIndex = event.gamepad.index;
  }

  onGamepadDisconnected() {
    this.gamepadIndex = null;
  }

  /**
   * Called by the main loop
   * Fetch axes values and update the cursor position
   */
  loop() {
    if (!this.gamepad) return;
  }

  /**
   * @returns {{x: number | null, y: number | null, z: number | null}} the values for each axe or null if the value is too low or if the gamepad is not connected
   */
  getAxesValues() {
    if (!this.gamepad) return {};
    return {
      x: this.getAxeValue(Gamepad.AXE_X),
      y: this.getAxeValue(Gamepad.AXE_Y),
      z: this.getAxeValue(Gamepad.AXE_Z),
    };
  }

  /**
   * @param {number} axeIndex
   * @returns {number | null} the value of the axe or null if the value is too low or if the gamepad is not connected
   * @example
   * getAxeValue(Gamepad.AXE_X)
   */
  getAxeValue(axeIndex) {
    if (!this.gamepad) return null;
    const axeValue = this.gamepad.axes[axeIndex];
    if (Math.abs(axeValue) < Gamepad.AXE_THRESOLD) return null;
    return axeValue - Gamepad.AXE_THRESOLD;
  }
}
