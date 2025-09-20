import { PlayerController, Player, VectorNormalize, Vector3, PlayerAction, PlayerActionMessage, Vector2 } from '@libs/shared';
import { ClientGame } from '../game';

export class ClientPlayerController extends PlayerController {
  private clientGame: ClientGame;

  constructor(game: ClientGame) {
    super(game.game);
    this.clientGame = game;
  }

  private applyLocalInput(player: Player, input: PlayerAction): void {
    this.applyInput(player, input);

    const message: PlayerActionMessage = {
      timestamp: Date.now(),
      tick: 0,
      actions: input,
    };
    this.clientGame.client.sendPlayerAction(message);
  }

  update(player: Player): void {
    super.update(player);

    const rotationDelta = this.clientGame.input.getMouseMovement();
    player.rotation = [
      player.rotation[0] + rotationDelta[0],
      player.rotation[1] + rotationDelta[1],
      0,
    ];
    if (player.rotation[0] >= Math.PI) {
      player.rotation[0] -= Math.PI * 2;
    }
    if (player.rotation[0] <= -Math.PI) {
      player.rotation[0] += Math.PI * 2;
    }
    if (player.rotation[1] >= Math.PI / 2 - 0.1) {
      player.rotation[1] = Math.PI / 2 - 0.1;
    }
    if (player.rotation[1] <= -Math.PI / 2 + 0.1) {
      player.rotation[1] = -Math.PI / 2 + 0.1;
    }

    const actions: PlayerAction = {
      move: [0, 0],
      look: player.rotation,
      jump: false,
    }

    if (this.clientGame.input.isKeyPressed("KeyW")) {
      const xzForward = this.getXZForwardVector(player);
      actions.move = [
        actions.move[0] + xzForward[0],
        actions.move[1] + xzForward[2],
      ];
    }
    if (this.clientGame.input.isKeyPressed("KeyS")) {
      const xzForward = this.getXZForwardVector(player);
      actions.move = [
        actions.move[0] - xzForward[0],
        actions.move[1] - xzForward[2],
      ];
    }
    if (this.clientGame.input.isKeyPressed("KeyA")) {
      const xzRight = this.getXZRightVector(player);
      actions.move = [
        actions.move[0] + xzRight[0],
        actions.move[1] + xzRight[2],
      ];
    }
    if (this.clientGame.input.isKeyPressed("KeyD")) {
      const xzRight = this.getXZRightVector(player);
      actions.move = [
        actions.move[0] - xzRight[0],
        actions.move[1] - xzRight[2],
      ];
    }
    if (this.clientGame.input.isKeyPressed("Space")) {
      actions.jump = true;
    }

    this.applyLocalInput(player, actions)
  }

  private getXZForwardVector(player: Player): Vector3 {
    return VectorNormalize([
      this.getForwardVector(player)[0],
      0,
      this.getForwardVector(player)[2],
    ]);
  }
  
  private getXZRightVector(player: Player): Vector3 {
    return VectorNormalize([
      this.getRightVector(player)[0],
      0,
      this.getRightVector(player)[2],
    ]);
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
