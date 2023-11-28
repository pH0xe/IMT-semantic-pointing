import * as THREE from "three";

export class Cross {
  static DEPTH = 0.5;
  static FRONT = 1;
  static REAR = Cross.FRONT - Cross.DEPTH;

  static CROSS_COORDS = [
    [
      [3, 6],
      [2, 1],
      [3, 1],
    ],
    [
      [2, 6],
      [2, 1],
      [3, 6],
    ],
    [
      [2, 5],
      [1, 5],
      [2, 4],
    ],
    [
      [2, 4],
      [1, 5],
      [1, 4],
    ],
    [
      [4, 4],
      [3, 5],
      [3, 4],
    ],
    [
      [4, 5],
      [3, 5],
      [4, 4],
    ],
  ];

  static FRONT_CROSS_COORDS = Cross.CROSS_COORDS.flatMap((t) =>
    t.flatMap((p) => [...p, Cross.REAR])
  );

  static BACK_CROSS_COORDS = Cross.CROSS_COORDS.flatMap((t) =>
    t.flatMap((p) => [...p, Cross.FRONT])
  );

  /** @type {THREE.Mesh} */
  mesh;

  /**
   * @param {THREE.Vector3} translate
   * @param {THREE.Vector3} rotate
   * @param {number} scale
   */
  constructor(translate, rotate = null, scale = null) {
    const geometry = new THREE.BufferGeometry();
    const vertices = this.computeVertices();
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(translate.x, translate.y, translate.z);
    this.mesh.geometry.computeBoundingBox();
  }

  /** @returns {Float32Array} */
  computeVertices() {
    return new Float32Array([
      ...Cross.FRONT_CROSS_COORDS,
      ...Cross.BACK_CROSS_COORDS,
      ...[...[3, 4, Cross.REAR], ...[3, 1, Cross.FRONT], ...[3, 1, Cross.REAR]],
      ...[
        ...[3, 4, Cross.REAR],
        ...[3, 4, Cross.FRONT],
        ...[3, 1, Cross.FRONT],
      ],
      ...[...[3, 4, Cross.REAR], ...[4, 4, Cross.REAR], ...[4, 4, Cross.FRONT]],
      ...[
        ...[3, 4, Cross.REAR],
        ...[4, 4, Cross.FRONT],
        ...[3, 4, Cross.FRONT],
      ],
      ...[
        ...[4, 5, Cross.REAR],
        ...[4, 5, Cross.FRONT],
        ...[4, 4, Cross.FRONT],
      ],
      ...[...[4, 5, Cross.REAR], ...[4, 4, Cross.FRONT], ...[4, 4, Cross.REAR]],
      ...[...[3, 5, Cross.REAR], ...[4, 5, Cross.FRONT], ...[4, 5, Cross.REAR]],
      ...[
        ...[3, 5, Cross.REAR],
        ...[3, 5, Cross.FRONT],
        ...[4, 5, Cross.FRONT],
      ],
      ...[...[3, 6, Cross.REAR], ...[3, 5, Cross.FRONT], ...[3, 5, Cross.REAR]],
      ...[
        ...[3, 6, Cross.REAR],
        ...[3, 6, Cross.FRONT],
        ...[3, 5, Cross.FRONT],
      ],
      ...[
        ...[3, 6, Cross.REAR],
        ...[2, 6, Cross.FRONT],
        ...[3, 6, Cross.FRONT],
      ],
      ...[...[3, 6, Cross.REAR], ...[2, 6, Cross.REAR], ...[2, 6, Cross.FRONT]],
      ...[...[2, 6, Cross.FRONT], ...[2, 6, Cross.REAR], ...[2, 5, Cross.REAR]],
      ...[
        ...[2, 6, Cross.FRONT],
        ...[2, 5, Cross.REAR],
        ...[2, 5, Cross.FRONT],
      ],
      ...[...[2, 5, Cross.FRONT], ...[2, 5, Cross.REAR], ...[1, 5, Cross.REAR]],
      ...[
        ...[2, 5, Cross.FRONT],
        ...[1, 5, Cross.REAR],
        ...[1, 5, Cross.FRONT],
      ],
      ...[...[1, 5, Cross.FRONT], ...[1, 5, Cross.REAR], ...[1, 4, Cross.REAR]],
      ...[
        ...[1, 5, Cross.FRONT],
        ...[1, 4, Cross.REAR],
        ...[1, 4, Cross.FRONT],
      ],
      ...[...[1, 4, Cross.FRONT], ...[1, 4, Cross.REAR], ...[2, 4, Cross.REAR]],
      ...[
        ...[1, 4, Cross.FRONT],
        ...[2, 4, Cross.REAR],
        ...[2, 4, Cross.FRONT],
      ],
      ...[...[2, 4, Cross.FRONT], ...[2, 4, Cross.REAR], ...[2, 1, Cross.REAR]],
      ...[
        ...[2, 4, Cross.FRONT],
        ...[2, 1, Cross.REAR],
        ...[2, 1, Cross.FRONT],
      ],
      ...[...[2, 1, Cross.FRONT], ...[2, 1, Cross.REAR], ...[3, 1, Cross.REAR]],
      ...[
        ...[2, 1, Cross.FRONT],
        ...[3, 1, Cross.REAR],
        ...[3, 1, Cross.FRONT],
      ],
    ]);
  }

  /**
   * return the coordinates of the center of the cross (not just the position of the mesh), using a bounding box
   */
  get position() {
    const center = new THREE.Vector3();
    const localCenter = new THREE.Vector3();
    const boundingBox = this.mesh.geometry.boundingBox;
    localCenter.x = (boundingBox.max.x + boundingBox.min.x) / 2;
    localCenter.y = (boundingBox.max.y + boundingBox.min.y) / 2;
    localCenter.z = (boundingBox.max.z + boundingBox.min.z) / 2;
    this.mesh.localToWorld(center);
    return center;
  }

  /**
   * @param {THREE.Vector3} point
   */
  getDistance(point) {
    return point.distanceTo(this.position);
  }

  /**
   * @param {number} count
   * @returns {Cross[]}
   */
  static generateCrosses(count = 10) {
    const crosses = [];
    for (let i = 0; i < count; i++) {
      const translateZ = random(-100, -10);
      // plus on est loin plus l'intervalle x et y est grand
      const translateX = random(-translateZ / 2, translateZ / 2);
      const translateY = random(-translateZ / 2, translateZ / 2);
      crosses.push(
        new Cross(new THREE.Vector3(translateX, translateY, translateZ))
      );
    }
    return crosses;
  }
}
