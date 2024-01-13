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
    this.initFloor();
    this.initCrosses();
    document.body.appendChild(this.renderer.domElement);

    this.scene.add(Cursor.instance.cursor);
    this.scene.add(Cursor.instance.pointLight);

    this.renderer.setAnimationLoop(Utils.animate);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor("#233143");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 50_000;
    directionalLight.shadow.mapSize.height = 50_000;

    directionalLight.shadow.camera.near = -100;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.bottom = 10;
    directionalLight.shadow.camera.top = 100;

    this.scene.add(directionalLight);
  }

  initCrosses() {
    this._addCrosses(Utils.generateCrosses(10));
  }

  initFloor() {
    const geometry = new THREE.PlaneGeometry(1_000, 1_000);
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.position.set(0, -60, -500);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    this.scene.add(plane);
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
    const meshs = crosses.map((cross) => cross.mesh);
    this.scene.add(...meshs);

    this.crosses = crosses;
    this.onCursorPositionChange(Cursor.INITIAL_CURSOR_POSITION);
  }

  regenerateCrosses() {
    this._removeCrosses();
    this._addCrosses(Utils.generateCrosses(10));
  }

  /**
   * @param {THREE.Vector3} point
   */
  onCursorPositionChange(point) {
    const after = this.crosses.filter((cross) => cross.filterZ(point) == 1);
    const before = this.crosses.filter((cross) => cross.filterZ(point) == -1);
    const inCrosses = this.crosses.filter((cross) => cross.filterZ(point) == 0);

    before.forEach((cross) => {
      cross.mesh.material.opacity = 0.2;
      cross.mesh.material.color = new THREE.Color(0xffffff);
    });

    after.forEach((cross) => {
      cross.mesh.material.color = new THREE.Color(0xffffff);
      cross.mesh.material.opacity = 1;
    });

    inCrosses.forEach((cross) => {
      if (cross.isInside(point)) {
        cross.mesh.material.color = new THREE.Color(0x00b894);
        cross.mesh.material.opacity = 1;
      } else {
        cross.mesh.material.color = new THREE.Color(0x81ecec);
        cross.mesh.material.opacity = 1;
      }
    });
  }
}
