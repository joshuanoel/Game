import { Client } from './client/client';
import { PlayerController } from './controller/player';
import { ActorFPSCamera, Camera, DefaultCamera } from './display/camera';
import { Displayable, DisplayManager } from './display/display';
import { InputManager } from './input/input';
import { CubeDisplay } from './display/cube';
import { Actor, ActorUpdateMessage, Cube, Game, Player } from '@libs/shared';

export class ClientGame {
  display: DisplayManager;
  input: InputManager;
  camera: Camera;
  client: Client;
  game: Game;
  displayables: Map<Actor, Displayable>;
  player?: Actor;

  constructor(canvas: HTMLCanvasElement) {
    this.display = new DisplayManager(canvas);
    this.input = new InputManager(canvas);
    this.camera = new DefaultCamera();
    this.game = new Game();
    this.displayables = new Map<Actor, Displayable>();

    this.client = new Client();

    this.client.onConnect((id: string) => {
      console.log('Connected to server');

      this.player = new Player(this.game, id, [0, 0, 0], 1);
      this.game.actors.push(this.player);

      const playerController = new PlayerController(this);
      this.game.controllers.set(this.player, playerController);

      const playerCamera = new ActorFPSCamera(this.player);
      this.camera = playerCamera;
    });

    this.client.onDisconnect(() => {
      console.log('Disconnected from server');

      this.camera = new DefaultCamera();

      if (this.player === undefined) {
        return;
      }

      this.game.actors = this.game.actors.filter((a) => a !== this.player);
      this.game.controllers.delete(this.player);
      this.player = undefined;
    });

    this.client.onUpdate((state: ActorUpdateMessage) => {
      state.actors.forEach((actor) => {
        // Update the game state with the snapshot
        const existingActor = this.game.actors.find((a) => a.id === actor.id);
        if (existingActor) {
          if (actor.id === this.client.id) {
            const distance = Math.sqrt(
              Math.pow(actor.position[0] - existingActor.position[0], 2) +
                Math.pow(actor.position[1] - existingActor.position[1], 2) +
                Math.pow(actor.position[2] - existingActor.position[2], 2)
            );
            if (distance > 1) {
              console.log('Player is too far from server position');
              existingActor.position = actor.position;
              existingActor.velocity = actor.velocity;
            }
          } else {
            existingActor.position = actor.position;
            existingActor.velocity = actor.velocity;
            existingActor.rotation = actor.rotation;
          }
        } else if (actor.id !== this.client.id) {
          console.log('Adding new actor from snapshot', actor.id);

          let newActor: Actor;
          let newActorDisplay: Displayable;
          if (actor.type === 'player') {
            newActor = new Player(
              this.game,
              actor.id,
              actor.position,
              1,
            );
            newActorDisplay = new CubeDisplay(newActor.position, 1, [0.5, 0.5, 0.5]);
          } else {
            newActor = new Cube(
              this.game,
              actor.id,
              actor.position,
              1,
            );
            newActorDisplay = new CubeDisplay(newActor.position, 1, [Math.random(), Math.random(), Math.random()]);
          }

          this.game.actors.push(newActor);
          newActorDisplay.init(this.display.gl);
          this.displayables.set(newActor, newActorDisplay);
        }
      })
    });

    this.client.onDelete((message) => {
      const actor = this.game.actors.find((a) => a.id === message.id);
      if (actor) {
        this.game.actors = this.game.actors.filter((a) => a !== actor);
        this.displayables.delete(actor);
        this.game.controllers.delete(actor);
      }
      if (actor === this.player) {
        this.player = undefined;
        this.camera = new DefaultCamera();
      }
    });
  }

  tick(dt: number): void {
    this.game.tick(dt);

    this.displayables.forEach((displayable, actor) => {
      displayable.position = actor.position;
      if (actor.rotation !== undefined) {
        displayable.rotation = actor.rotation;
      }
    });

    this.display.render(
      Array.from(this.displayables.values()),
      this.camera,
    );
  }
}
