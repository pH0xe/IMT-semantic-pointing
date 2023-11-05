import { generateCrosses } from "./generator.js";
import {
  addCrosses,
  addTexture,
  removeCrosses,
  removeTexture,
} from "./scene.js";

let godMode = false;

const regenerateShapes = () => {
  removeCrosses();
  const crosses = generateCrosses(10, godMode);
  addCrosses(crosses);
};

const toggleGodMode = (btn) => {
  btn.innerHTML = "God mode: loading";
  godMode = !godMode;
  if (godMode) addTexture().then(() => (btn.innerHTML = "God mode: ON"));
  else removeTexture().then(() => (btn.innerHTML = "God mode: OFF"));
};

const toggleCommandsVisibility = () => {
  const commands = document.getElementById("commands");
  commands.classList.toggle("minimized");

  const btnOpen = document.getElementById("btn-open");
  btnOpen.classList.toggle("hidden");
};

const initEventListeners = () => {
  const regenerateButton = document.getElementById("btn-regenerate");
  regenerateButton.addEventListener("click", regenerateShapes);

  const btnGodMode = document.getElementById("btn-god-mode");
  btnGodMode.addEventListener("click", toggleGodMode.bind(this, btnGodMode));

  const btnOpen = document.getElementById("btn-open");
  btnOpen.addEventListener("click", toggleCommandsVisibility);

  const btnClose = document.getElementById("btn-close");
  btnClose.addEventListener("click", toggleCommandsVisibility);
};

initEventListeners();
