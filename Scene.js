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

  static FLOOR_Y = -10;
  static BACK_WALL_Z = -110;
  static LEFT_WALL_X = -100;
  static RIGHT_WALL_X = 100;
  static CEILING_Y = 70;

  constructor() {
    this.scene = new THREE.Scene();
    this.initRenderer();
    this.initCamera();
    this.initLight();
    this.initFloor();
    this.initRightWall();
    this.initLeftWall();
    this.initBackWall();
    this.initCeiling();
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.castShadow = true;
    backLight.position.set(0, 0, 1);

    backLight.shadow.camera.near = 0;
    backLight.shadow.camera.far = 111;
    backLight.shadow.camera.left = 100;
    backLight.shadow.camera.right = -100;
    backLight.shadow.camera.bottom = -10;
    backLight.shadow.camera.top = 70;

    this.scene.add(backLight);

    const leftLight = new THREE.DirectionalLight(0xffffff, 0.3);
    leftLight.castShadow = true;
    leftLight.position.set(1, 0, 0);

    leftLight.shadow.camera.near = -100;
    leftLight.shadow.camera.far = 101;
    leftLight.shadow.camera.left = 0;
    leftLight.shadow.camera.right = 110;
    leftLight.shadow.camera.bottom = -10;
    leftLight.shadow.camera.top = 70;

    this.scene.add(leftLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.3);
    bottomLight.castShadow = true;
    bottomLight.position.set(0, 1, 0);

    bottomLight.shadow.camera.near = -60;
    bottomLight.shadow.camera.far = 15;
    bottomLight.shadow.camera.left = -100;
    bottomLight.shadow.camera.right = 100;
    bottomLight.shadow.camera.bottom = 10;
    bottomLight.shadow.camera.top = 100;

    this.scene.add(bottomLight);

    const rightLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rightLight.castShadow = true;
    rightLight.position.set(-1, 0, 0);

    rightLight.shadow.camera.near = -100;
    rightLight.shadow.camera.far = 101;
    rightLight.shadow.camera.left = -110;
    rightLight.shadow.camera.right = 0;
    rightLight.shadow.camera.bottom = -10;
    rightLight.shadow.camera.top = 70;

    this.scene.add(rightLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.castShadow = true;
    topLight.position.set(0, -1, 0);

    topLight.shadow.camera.near = -10;
    topLight.shadow.camera.far = 72;
    topLight.shadow.camera.left = -100;
    topLight.shadow.camera.right = 100;
    topLight.shadow.camera.bottom = -110;
    topLight.shadow.camera.top = 0;

    this.scene.add(topLight);
  }

  initCrosses() {
    this._addCrosses(Utils.generateCrosses(10));
  }

  initFloor() {
    const geometry = new THREE.PlaneGeometry(200, 110);
    const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.position.set(0, Scene.FLOOR_Y, -55);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    this.scene.add(plane);
  }

  initBackWall() {
    const geometry = new THREE.PlaneGeometry(200, 80);
    const material = new THREE.MeshStandardMaterial({ color: 0x0055aa });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.position.set(0, 30, Scene.BACK_WALL_Z);
    this.scene.add(plane);
  }

  initLeftWall() {
    const geometry = new THREE.PlaneGeometry(110, 80);
    const material = new THREE.MeshStandardMaterial({ color: 0x33bbff });

    const leftWall = new THREE.Mesh(geometry, material);
    leftWall.receiveShadow = true;
    leftWall.position.set(Scene.LEFT_WALL_X, 30, -55);
    leftWall.rotation.set(0, Math.PI / 2, 0);
    this.scene.add(leftWall);
  }

  initRightWall() {
    const geometry = new THREE.PlaneGeometry(110, 80);
    const material = new THREE.MeshStandardMaterial({ color: 0x33bbff });

    const rightWall = new THREE.Mesh(geometry, material);
    rightWall.receiveShadow = true;
    rightWall.position.set(Scene.RIGHT_WALL_X, 30, -55);
    rightWall.rotation.set(0, -Math.PI / 2, 0);
    this.scene.add(rightWall);
  }

  initCeiling() {
    const geometry = new THREE.PlaneGeometry(200, 110);
    const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.position.set(0, Scene.CEILING_Y, -55);
    plane.rotation.set(Math.PI / 2, 0, 0);
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
