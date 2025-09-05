import { Injectable } from '@nestjs/common';
import { Actor, Cube, Game, Player, PlayerUpdateMessage } from '@libs/shared';

@Injectable()
export class GameService {
  private game: Game;

  constructor() {
    this.game = new Game();

    // Random cubes.
    for (let i = 0; i < 50; i++) {
      const cube = new Cube(
        this.game,
        `cube-${i}`,
        [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * -50],
        1,
      );
      this.game.actors.push(cube);
    }

    // Floor cubes.
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cube = new Cube(this.game, `floor-cube-${i}-${j}`, [i - 5, 0, j - 5], 1);
        this.game.actors.push(cube);
      }
    }

    setInterval(() => {
      this.game.tick(1 / 60);
    }, 1000 / 60);
  }

  addPlayer(id: string) {
    const newPlayer = new Player(this.game, id, [0, 0, 0], 1);
    this.game.actors.push(newPlayer);
  }

  removePlayer(id: string) {
    this.game.actors = this.game.actors.filter((a) => a.id !== id);
  }

  updatePlayer(id: string, data: PlayerUpdateMessage) {
    if (data.state.id !== id) {
      throw new Error('Player ID mismatch');
    }
    const player = this.game.actors.find((p) => p.id === id);
    if (player !== undefined) {
      player.position = data.state.position;
      player.velocity = data.state.velocity;
      player.rotation = data.state.rotation;
    }
  }

  getActors(): Actor[] {
    return this.game.actors;
  }

  getPlayers(): Player[] {
    return this.game.actors.filter((actor) => actor instanceof Player) as Player[];
  }

  tick(delta: number) {
    this.game.tick(delta);
  }
}
