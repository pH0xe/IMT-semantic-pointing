import * as THREE from "three";

export class Cross {
  static DEPTH = 0.5;
  static WIDTH = 3;
  static HEIGHT = 5;
  static FRONT = 0;
  static REAR = Cross.FRONT - Cross.DEPTH;

  static CROSS_COORDS = [
    [
      [2, 5],
      [1, 0],
      [2, 0],
    ],
    [
      [1, 5],
      [1, 0],
      [2, 5],
    ],
    [
      [1, 4],
      [0, 4],
      [1, 3],
    ],
    [
      [1, 3],
      [0, 4],
      [0, 3],
    ],
    [
      [3, 3],
      [2, 4],
      [2, 3],
    ],
    [
      [3, 4],
      [2, 4],
      [3, 3],
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

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(translate.x, translate.y, translate.z);
    this.mesh.geometry.computeBoundingBox();
    this.mesh.castShadow = true;
  }

  /** @returns {Float32Array} */
  computeVertices() {
    return new Float32Array([
      ...Cross.FRONT_CROSS_COORDS,
      ...Cross.BACK_CROSS_COORDS,
      ...[...[2, 3, Cross.REAR], ...[2, 0, Cross.FRONT], ...[2, 0, Cross.REAR]],
      ...[
        ...[2, 3, Cross.REAR],
        ...[2, 3, Cross.FRONT],
        ...[2, 0, Cross.FRONT],
      ],
      ...[...[2, 3, Cross.REAR], ...[3, 3, Cross.REAR], ...[3, 3, Cross.FRONT]],
      ...[
        ...[2, 3, Cross.REAR],
        ...[3, 3, Cross.FRONT],
        ...[2, 3, Cross.FRONT],
      ],
      ...[
        ...[3, 4, Cross.REAR],
        ...[3, 4, Cross.FRONT],
        ...[3, 3, Cross.FRONT],
      ],
      ...[...[3, 4, Cross.REAR], ...[3, 3, Cross.FRONT], ...[3, 3, Cross.REAR]],
      ...[...[2, 4, Cross.REAR], ...[3, 4, Cross.FRONT], ...[3, 4, Cross.REAR]],
      ...[
        ...[2, 4, Cross.REAR],
        ...[2, 4, Cross.FRONT],
        ...[3, 4, Cross.FRONT],
      ],
      ...[...[2, 5, Cross.REAR], ...[2, 4, Cross.FRONT], ...[2, 4, Cross.REAR]],
      ...[
        ...[2, 5, Cross.REAR],
        ...[2, 5, Cross.FRONT],
        ...[2, 4, Cross.FRONT],
      ],
      ...[
        ...[2, 5, Cross.REAR],
        ...[1, 5, Cross.FRONT],
        ...[2, 5, Cross.FRONT],
      ],
      ...[...[2, 5, Cross.REAR], ...[1, 5, Cross.REAR], ...[1, 5, Cross.FRONT]],
      ...[...[1, 5, Cross.FRONT], ...[1, 5, Cross.REAR], ...[1, 4, Cross.REAR]],
      ...[
        ...[1, 5, Cross.FRONT],
        ...[1, 4, Cross.REAR],
        ...[1, 4, Cross.FRONT],
      ],
      ...[...[1, 4, Cross.FRONT], ...[1, 4, Cross.REAR], ...[0, 4, Cross.REAR]],
      ...[
        ...[1, 4, Cross.FRONT],
        ...[0, 4, Cross.REAR],
        ...[0, 4, Cross.FRONT],
      ],
      ...[...[0, 4, Cross.FRONT], ...[0, 4, Cross.REAR], ...[0, 3, Cross.REAR]],
      ...[
        ...[0, 4, Cross.FRONT],
        ...[0, 3, Cross.REAR],
        ...[0, 3, Cross.FRONT],
      ],
      ...[...[0, 3, Cross.FRONT], ...[0, 3, Cross.REAR], ...[1, 3, Cross.REAR]],
      ...[
        ...[0, 3, Cross.FRONT],
        ...[1, 3, Cross.REAR],
        ...[1, 3, Cross.FRONT],
      ],
      ...[...[1, 3, Cross.FRONT], ...[1, 3, Cross.REAR], ...[1, 0, Cross.REAR]],
      ...[
        ...[1, 3, Cross.FRONT],
        ...[1, 0, Cross.REAR],
        ...[1, 0, Cross.FRONT],
      ],
      ...[...[1, 0, Cross.FRONT], ...[1, 0, Cross.REAR], ...[2, 0, Cross.REAR]],
      ...[
        ...[1, 0, Cross.FRONT],
        ...[2, 0, Cross.REAR],
        ...[2, 0, Cross.FRONT],
      ],
    ]);
  }

  /**
   * return the coordinates of the center of the cross (not just the position of the mesh), using a bounding box
   */
  get position() {
    const center = new THREE.Vector3();

    center.x = this.mesh.position.x + Cross.WIDTH / 2;
    center.y = this.mesh.position.y + Cross.HEIGHT / 2;
    center.z = this.mesh.position.z - Cross.DEPTH / 2;
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

  /**
   * @param {THREE.Vector3} point
   * @returns {-1 | 0 | 1} -1 if point is before, 0 if point is inside, 1 if point is after
   */
  filterZ(point) {
    const maxZ = this.position.z + Cross.DEPTH / 2;
    const minZ = this.position.z - Cross.DEPTH / 2;

    if (point.z < minZ) {
      return -1;
    } else if (point.z > maxZ) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * @param {THREE.Vector3} point
   */
  isOnSameZ(point) {
    return this.filterZ(point) === 0;
  }

  /**
   * @param {THREE.Vector3} point
   */
  isInside(point) {
    const maxX = this.position.x + Cross.WIDTH / 2;
    const minX = this.position.x - Cross.WIDTH / 2;

    const maxY = this.position.y + Cross.HEIGHT / 2;
    const minY = this.position.y - Cross.HEIGHT / 2;

    return (
      point.x <= maxX &&
      point.x >= minX &&
      point.y <= maxY &&
      point.y >= minY &&
      this.isOnSameZ(point)
    );
  }
}
