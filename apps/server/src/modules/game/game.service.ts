import { Inject, Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { Actor, Cube, Game, Player, PlayerAction, PlayerController, Vector3 } from '@libs/shared';
import { LEVEL_SERVICE_TOKEN, LevelService } from '../level/level.interface';
import { LevelComponent } from '../level/level.types';

@Injectable()
export class GameService implements OnModuleDestroy, OnApplicationShutdown{
  private game: Game = new Game();
  private ticker: NodeJS.Timeout | null = null;

  private levelConnectPoint: Vector3 = [0, 0, 0];
  private levelBoundary: number = -100;

  constructor(
    @Inject(LEVEL_SERVICE_TOKEN) private levelService: LevelService,
  ) {
    this.start()
  }

  start() {
    if (this.ticker !== null) {
      return;
    }

    this.game.reset();

    this.levelConnectPoint = [0, 0, 0];
    this.levelBoundary = -100;
    const initialLevelComponent = this.levelService.GetComponent(0);
    this.addLevelComponent(initialLevelComponent);

    this.ticker = setInterval(() => {
      this.tick(1 / 60);
    }, 1000 / 60);
  }

  stop() {
    if (this.ticker === null) {
      return;
    }

    this.game.reset();

    clearInterval(this.ticker);
    this.ticker = null;
  }

  // Called when the module is destroyed
  onModuleDestroy() {
    this.stop();
  }

  // Called when the application is shutting down
  onApplicationShutdown() {
    this.stop();
  }

  tick(dt: number) {
    const players = this.getPlayers()
    if (players.length == 0) {
      return;
    }

    this.game.tick(dt);

    let furthestForwardPlayerZ = -Infinity;
    let furthestBehindPlayerZ = Infinity;
    players.forEach((player) => {
      if (player.position[2] > furthestForwardPlayerZ) {
        furthestForwardPlayerZ = player.position[2];
      }
      if (player.position[2] < furthestBehindPlayerZ) {
        furthestBehindPlayerZ = player.position[2];
      }
    });

    if (furthestForwardPlayerZ + 100 > this.levelConnectPoint[2]) {
      const levelComponent = this.levelService.GetComponent(50);
      this.addLevelComponent(levelComponent);
    }

    this.levelBoundary += dt*2
    if (this.levelBoundary + 20 < furthestBehindPlayerZ) {
      this.levelBoundary = furthestBehindPlayerZ - 20
    }

    this.getPlatforms().forEach((platform) => {
      if (platform.position[2] < this.levelBoundary) {
        platform.velocity[1] -= 0.1
      }
      if (platform.position[1] < -50) {
        this.game.actors = this.game.actors.filter((a) => a !== platform);
        // TODO delete message
      }
    })
  }

  addLevelComponent(component: LevelComponent) {
    const level = component;

    const levelStartPoint = level.startPosition;
    const offset: Vector3 = [
      this.levelConnectPoint[0] - levelStartPoint.x,
      this.levelConnectPoint[1] - levelStartPoint.y,
      this.levelConnectPoint[2] - levelStartPoint.z,
    ];


    level.platforms.forEach((cube: any, index: number) => {
      const newCube = new Cube(
        this.game,
        `level-cube-${Date.now()}-${index}-${Math.floor(Math.random() * 10000)}`,
        [offset[0] + cube.position.x, offset[1] + cube.position.y, offset[2] + cube.position.z],
        [cube.size.x, cube.size.y, cube.size.z],
      );
      this.game.actors.push(newCube);
    });

    this.levelConnectPoint = [offset[0] + level.endPosition.x, offset[1] + level.endPosition.y, offset[2] + level.endPosition.z];

    console.log('Added level component, new connect point:', this.levelConnectPoint);
  }

  addPlayer(id: string) {
    const newPlayer = new Player(this.game, id, this.levelConnectPoint, [1, 1, 1]);
    this.game.actors.push(newPlayer);

    const newPlayerController = new PlayerController(this.game);
    this.game.controllers.set(newPlayer, newPlayerController);
  }

  removePlayer(id: string) {
    const player = this.game.actors.find((p) => p.id === id);
    if (player === undefined || !(player instanceof Player)) {
      return;
    }

    this.game.controllers.delete(player);
    this.game.actors = this.game.actors.filter((a) => a.id !== id);
  }

  updatePlayer(id: string, actions: PlayerAction) {
    const player = this.game.actors.find((p) => p.id === id);
    if (player === undefined || !(player instanceof Player)) {
      return;
    }
    const playerController = this.game.controllers.get(player);
    if (playerController === undefined || !(playerController instanceof PlayerController)) {
      return;
    }
    playerController.applyInput(player, actions);
  }

  getActors(): Actor[] {
    return this.game.actors;
  }

  getPlayers(): Player[] {
    return this.game.actors.filter((actor) => actor instanceof Player) as Player[];
  }

  getPlatforms(): Cube[] {
    return this.game.actors.filter((actor) => actor instanceof Cube) as Cube[];
  }
}
