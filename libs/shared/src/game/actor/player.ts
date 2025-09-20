import { Game } from '../game';
import { Vector3 } from '../../math/vector';
import { Actor } from './actor';
import { checkCollision, CollisionShape } from './collision';

export class Player implements Actor {
  private game: Game;

  id: string;
  position: Vector3;
  velocity: Vector3;
  rotation: Vector3;
  collision: CollisionShape;
  size: Vector3;

  isGrounded: boolean;

  constructor(
    game: Game,
    id: string,
    position: Vector3,
    size: Vector3,
  ) {
    this.game = game;

    this.id = id;
    this.position = position;
    this.velocity = [0, 0, 0];
    this.collision = {
      min: [
        position[0],
        position[1],
        position[2],
      ],
      max: [
        position[0] + size[0],
        position[1] + size[1],
        position[2] + size[2],
      ],
    };
    this.rotation = [0, 0, 0];

    this.isGrounded = false;
    this.size = size;
  }

  update(dt: number): void {
    this.velocity[1] -= 9.8 * dt; // Apply gravity

    this.move(dt);
  }

  private move(dt: number): void {
    // Compute attempted movement
    const dx = this.velocity[0] * dt;
    const dy = this.velocity[1] * dt;
    const dz = this.velocity[2] * dt;

    // Move along Y
    this.isGrounded = false;
    this.position[1] += dy;
    this.updateCollision();
    this.game.actors.forEach((other) => {
      if (other === this || !other.collision) {
        return;
      }
      if (checkCollision(this.collision, other.collision)) {
        if (dy > 0) {
          this.position[1] = other.collision.min[1] - this.size[1];
          this.velocity[1] = 0;
        } else if (dy < 0) {
          this.position[1] = other.collision.max[1];
          this.velocity[1] = 0;
          this.isGrounded = true;
        }
      }
    });

    // Move along X
    this.position[0] += dx;
    this.updateCollision();
    this.game.actors.forEach((other) => {
      if (other === this || !other.collision) {
        return;
      }
      if (checkCollision(this.collision, other.collision)) {
        if (dx > 0) {
          this.position[0] = other.collision.min[0] - this.size[0];
        } else if (dx < 0) {
          this.position[0] = other.collision.max[0]
        }
      }
    });

    // Move along Z
    this.position[2] += dz;
    this.updateCollision();
    this.game.actors.forEach((other) => {
      if (other === this || !other.collision) {
        return;
      }
      if (checkCollision(this.collision, other.collision)) {
        if (dz > 0) {
          this.position[2] = other.collision.min[2] - this.size[2];
        } else if (dz < 0) {
          this.position[2] = other.collision.max[2];
        }
      }
    });
  }

  private updateCollision(): void {
    this.collision = {
      min: [
        this.position[0],
        this.position[1],
        this.position[2],
      ],
      max: [
        this.position[0] + this.size[0],
        this.position[1] + this.size[1],
        this.position[2] + this.size[2],
      ],
    };
  }
}
