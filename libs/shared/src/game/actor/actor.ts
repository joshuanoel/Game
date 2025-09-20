import { Vector3 } from '../../math/vector';
import { CollisionShape } from './collision';

export interface Actor {
  id: string;
  position: Vector3;
  velocity: Vector3;
  rotation?: Vector3;
  collision?: CollisionShape;
  size?: Vector3;
  update(dt: number): void;
}
