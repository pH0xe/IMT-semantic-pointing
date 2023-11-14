import * as THREE from "three";

export const generateCross = (
  scale,
  translateX,
  translateY,
  translateZ,
  rotateX,
  rotateY,
  rotateZ,
  color = 0xffffff
) => {
  const depth = 0.5;
  const front = 1;
  const rear = front - depth;
  const geometry = new THREE.BufferGeometry();
  const frontCross = crossCoords.flatMap((t) => t.flatMap((p) => [...p, rear]));
  const backCross = crossCoords.flatMap((t) =>
    t.flatMap((p) => [...p, front])
  );

  const vertices = new Float32Array([
    ...frontCross,
    ...backCross,
    ...[
      ...[3, 4, rear],
      ...[3, 1, front],
      ...[3, 1, rear],
    ],
    ...[
      ...[3, 4, rear],
      ...[3, 4, front],
      ...[3, 1, front],
    ],
    ...[
      ...[3, 4, rear],
      ...[4, 4, rear],
      ...[4, 4, front],
    ],
    ...[
      ...[3, 4, rear],
      ...[4, 4, front],
      ...[3, 4, front],
    ],
    ...[
      ...[4, 5, rear],
      ...[4, 5, front],
      ...[4, 4, front],
    ],
    ...[
      ...[4, 5, rear],
      ...[4, 4, front],
      ...[4, 4, rear],
    ],
    ...[
      ...[3, 5, rear],
      ...[4, 5, front],
      ...[4, 5, rear],
    ],
    ...[
      ...[3, 5, rear],
      ...[3, 5, front],
      ...[4, 5, front],
    ],
    ...[
      ...[3, 6, rear],
      ...[3, 5, front],
      ...[3, 5, rear],
    ],
    ...[
      ...[3, 6, rear],
      ...[3, 6, front],
      ...[3, 5, front],
    ],
    ...[
      ...[3, 6, rear],
      ...[2, 6, front],
      ...[3, 6, front],
    ],
    ...[
      ...[3, 6, rear],
      ...[2, 6, rear],
      ...[2, 6, front],
    ],
    ...[
      ...[2, 6, front],
      ...[2, 6, rear],
      ...[2, 5, rear],
    ],
    ...[
      ...[2, 6, front],
      ...[2, 5, rear],
      ...[2, 5, front],
    ],
    ...[
      ...[2, 5, front],
      ...[2, 5, rear],
      ...[1, 5, rear],
    ],
    ...[
      ...[2, 5, front],
      ...[1, 5, rear],
      ...[1, 5, front],
    ],
    ...[
      ...[1, 5, front],
      ...[1, 5, rear],
      ...[1, 4, rear],
    ],
    ...[
      ...[1, 5, front],
      ...[1, 4, rear],
      ...[1, 4, front],
    ],
    ...[
      ...[1, 4, front],
      ...[1, 4, rear],
      ...[2, 4, rear],
    ],
    ...[
      ...[1, 4, front],
      ...[2, 4, rear],
      ...[2, 4, front],
    ],
    ...[
      ...[2, 4, front],
      ...[2, 4, rear],
      ...[2, 1, rear],
    ],
    ...[
      ...[2, 4, front],
      ...[2, 1, rear],
      ...[2, 1, front],
    ],
    ...[
      ...[2, 1, front],
      ...[2, 1, rear],
      ...[3, 1, rear],
    ],
    ...[
      ...[2, 1, front],
      ...[3, 1, rear],
      ...[3, 1, front],
    ],
  ]);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({ color });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(translateX, translateY, translateZ);
  return mesh;
};

const random = (min, max) => Math.random() * (max - min) + min;

export const generateCrosses = (count, godMode) => {
  const crosses = [];
  for (let i = 0; i < count; i++) {
    const translateZ = random(-100, -10);
    // plus on est loin plus l'intervalle x et y est grand
    const translateX = random(-translateZ / 2, translateZ / 2);
    const translateY = random(-translateZ / 2, translateZ / 2);
    crosses.push(
      generateCross(
        1,
        translateX,
        translateY,
        translateZ,
        0,
        0,
        0,
        godMode ? 0x6c5ce7 : 0xffffff
      )
    );
  }

  return crosses;
};

const crossCoords = [
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
