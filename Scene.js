import * as THREE from "three";
import { Cross } from "./Cross";
import { Cursor } from "./Cursor";
import { Utils } from "./Utils";

export let sceneCrosses = [];

export class Scene {
  /** @type {THREE.Scene} */
  scene;

  /** @type {Cross[]} */
  crosses;

  /** @type {THREE.WebGLRenderer} */
  renderer;

  /** @type {THREE.PerspectiveCamera}*/
  camera;

  /** @type {Scene} */
  _instance;

  /** @type {Scene} */
  static get instance() {
    if (!this._instance) {
      this._instance = new Scene();
    }
    return this._instance;
  }

  constructor() {
    this.scene = new THREE.Scene();
    this.initRenderer();
    this.initCamera();
    this.initLight();
    this.initCrosses();
    document.body.appendChild(this.renderer.domElement);

    this.scene.add(Cursor.instance.cursor);
    this.renderer.setAnimationLoop(Utils.animate);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor("#233143");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
  }

  initLight() {
    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);
  }

  initCrosses() {
    this._addCrosses(Utils.generateCrosses(10));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  _removeCrosses() {
    this.scene.remove(...this.crosses.map((cross) => cross.mesh));
    this.crosses = [];
  }

  /**
   * @param {Cross[]} crosses
   */
  _addCrosses(crosses) {
    this.scene.add(...crosses.map((cross) => cross.mesh));
    this.crosses = crosses;
  }

  regenerateCrosses() {
    this._removeCrosses();
    this._addCrosses(Utils.generateCrosses(10));
  }

  onCursorZChange(z) {
    const depth = Cross.DEPTH;
    const after = this.crosses.filter((cross) => cross.position.z < z - depth);
    const before = this.crosses.filter((cross) => cross.position.z > z + depth);
    const inCrosses = this.crosses.filter(
      (cross) => cross.position.z >= z - depth && cross.position.z <= z + depth
    );

    before.forEach((cross) => {
      cross.mesh.material.color = new THREE.Color(0x6c5ce7);
    });

    after.forEach((cross) => {
      cross.mesh.material.color = new THREE.Color(0xffffff);
    });

    inCrosses.forEach((cross) => {
      cross.mesh.material.color = new THREE.Color(0x00ff00);
    });
  }
}
