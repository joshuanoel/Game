import { Player } from "../actor/player";
import { Game } from "../game";
import { PlayerAction } from "../messages";
import { Controller } from "./controller";

export class PlayerController implements Controller {
  private game: Game;

  private speed: number = 5;
  private jumpForce: number = 7.5;

  constructor(game: Game) {
    this.game = game;
  }

  applyInput(player: Player, input: PlayerAction): void {
    if (input.move[0] < -1) {
      input.move[0] = -1;
    }
    if (input.move[0] > 1) {
      input.move[0] = 1;
    }
    if (input.move[1] < -1) {
      input.move[1] = -1;
    }
    if (input.move[1] > 1) {
      input.move[1] = 1;
    }

    player.velocity = [
      input.move[0] * this.speed,
      player.velocity[1],
      input.move[1] * this.speed,
    ];

    if (input.jump && player.isGrounded) {
      player.velocity = [
        player.velocity[0],
        player.velocity[1] + this.jumpForce,
        player.velocity[2],
      ];
    }

    player.rotation = input.look;
  }

  update(player: Player): void {
    // player.velocity = [0, player.velocity[1], 0];
  }
}
