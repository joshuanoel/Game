import { Player } from '../actor/player';
import { Game } from '../game';
import { Vector3, VectorNormalize } from '../../math/vector';
import { Controller } from './controller';

export class PlayerController implements Controller {
  private game: Game;

  private speed: number = 5;
  private jumpForce: number = 10;

  constructor(game: Game) {
    this.game = game;
  }

  update(player: Player): void {
    // const rotationDelta = this.game.input.getMouseMovement();
    // player.rotation = [
    //   player.rotation[0] + rotationDelta[0],
    //   player.rotation[1] + rotationDelta[1],
    //   player.rotation[2],
    // ];
    // if (player.rotation[1] >= Math.PI / 2 - 0.1) {
    //   player.rotation[1] = Math.PI / 2 - 0.1;
    // }
    // if (player.rotation[1] <= -Math.PI / 2 + 0.1) {
    //   player.rotation[1] = -Math.PI / 2 + 0.1;
    // }

    // player.velocity = [0, player.velocity[1], 0];

    // if (this.game.input.isKeyPressed('KeyW')) {
    //   const xzForward = VectorNormalize([
    //     this.getForwardVector(player)[0],
    //     0,
    //     this.getForwardVector(player)[2],
    //   ]);
    //   player.velocity = [
    //     player.velocity[0] + xzForward[0] * this.speed,
    //     player.velocity[1],
    //     player.velocity[2] + xzForward[2] * this.speed,
    //   ];
    // }
    // if (this.game.input.isKeyPressed('KeyS')) {
    //   const xzBackward = VectorNormalize([
    //     this.getForwardVector(player)[0],
    //     0,
    //     this.getForwardVector(player)[2],
    //   ]);
    //   player.velocity = [
    //     player.velocity[0] - xzBackward[0] * this.speed,
    //     player.velocity[1],
    //     player.velocity[2] - xzBackward[2] * this.speed,
    //   ];
    // }
    // if (this.game.input.isKeyPressed('KeyA')) {
    //   player.velocity = [
    //     player.velocity[0] + this.getRightVector(player)[0] * this.speed,
    //     player.velocity[1] + this.getRightVector(player)[1] * this.speed,
    //     player.velocity[2] + this.getRightVector(player)[2] * this.speed,
    //   ];
    // }
    // if (this.game.input.isKeyPressed('KeyD')) {
    //   player.velocity = [
    //     player.velocity[0] - this.getRightVector(player)[0] * this.speed,
    //     player.velocity[1] - this.getRightVector(player)[1] * this.speed,
    //     player.velocity[2] - this.getRightVector(player)[2] * this.speed,
    //   ];
    // }
    // if (this.game.input.isKeyPressed('Space') && player.isGrounded) {
    //   player.velocity = [
    //     player.velocity[0],
    //     player.velocity[1] + this.jumpForce,
    //     player.velocity[2],
    //   ];
    // }
  }

  private getForwardVector(player: Player): Vector3 {
    const [yaw, pitch] = player.rotation;
    return [
      Math.cos(pitch) * Math.sin(yaw),
      Math.sin(pitch),
      Math.cos(pitch) * Math.cos(yaw),
    ];
  }

  private getRightVector(player: Player): Vector3 {
    const [yaw] = player.rotation;
    return [Math.cos(yaw), 0, -Math.sin(yaw)];
  }
}
