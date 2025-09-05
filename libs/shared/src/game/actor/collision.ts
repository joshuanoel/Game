import { Vector3 } from '../../math/vector';

export type CollisionShape = {
  min: Vector3;
  max: Vector3;
};

export const checkCollision = (
  shapeA: CollisionShape,
  shapeB: CollisionShape,
): boolean => {
  return (
    shapeA.min[0] < shapeB.max[0] &&
    shapeA.max[0] > shapeB.min[0] &&
    shapeA.min[1] < shapeB.max[1] &&
    shapeA.max[1] > shapeB.min[1] &&
    shapeA.min[2] < shapeB.max[2] &&
    shapeA.max[2] > shapeB.min[2]
  );
};
