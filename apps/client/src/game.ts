import { Client } from './client/client';
import { ClientPlayerController } from './controller/player';
import { ActorFPSCamera, Camera, DefaultCamera } from './display/camera';
import { Displayable, DisplayManager } from './display/display';
import { InputManager } from './input/input';
import { CubeDisplay } from './display/cube';
import { Actor, ActorState, ActorUpdateMessage, Cube, Game, Player } from '@libs/shared';

export class ClientGame {
  display: DisplayManager;
  input: InputManager;
  camera: Camera;
  client: Client;
  game: Game;
  displayables: Map<Actor, Displayable>;
  player?: Actor;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize subsystems
    this.display = new DisplayManager(canvas);
    this.input = new InputManager(canvas);
    this.camera = new DefaultCamera();
    this.game = new Game();
    this.displayables = new Map<Actor, Displayable>();
    this.client = new Client();

    // Handle connection
    this.client.onConnect((id: string) => {
      console.log('Connected to server');

      this.player = new Player(this.game, id, [0, 0, 0], [1, 1, 1]);
      this.game.actors.push(this.player);

      const playerController = new ClientPlayerController(this);
      this.game.controllers.set(this.player, playerController);

      const playerCamera = new ActorFPSCamera(this.player);
      this.camera = playerCamera;
    });

    // Handle disconnection
    this.client.onDisconnect(() => {
      console.log('Disconnected from server');

      if (this.player !== undefined) {
        this.removeActor(this.player);
      }
    });

    // Handle actor updates
    this.client.onUpdate((state: ActorUpdateMessage) => {
      state.actors.forEach((actor) => {
        // Update the game state with the snapshot
        const existingActor = this.game.actors.find((a) => a.id === actor.id);
        if (existingActor) {
          this.updateActor(existingActor, actor);
        } else if (actor.id !== this.client.id) {
          console.log('Adding new actor from snapshot', actor.id);
          this.addActor(actor);
        }
      })
    });

    // Handle actor deletions
    this.client.onDelete((message) => {
      const actor = this.game.actors.find((a) => a.id === message.id);
      if (actor) {
        this.removeActor(actor);
      }
    });
  }

  /**
   * Game loop tick
   * @param dt Delta time in seconds
   */
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

  /**
   * Add an actor to the game and create its displayable representation
   * @param actor Actor to add to the game
   */
  private addActor(actor: ActorState): void {
    let newActor: Actor;
    let newActorDisplay: Displayable;
    if (actor.type === 'player') {
      newActor = new Player(
        this.game,
        actor.id,
        actor.position,
        actor.size,
      );
      newActorDisplay = new CubeDisplay(newActor.position, actor.size, [0.5, 0.5, 0.5]);
    } else {
      newActor = new Cube(
        this.game,
        actor.id,
        actor.position,
        actor.size ?? [1, 1, 1],
      );
      newActorDisplay = new CubeDisplay(newActor.position, actor.size, [Math.random(), Math.random(), Math.random()]);
    }

    this.game.actors.push(newActor);
    newActorDisplay.init(this.display.gl);
    this.displayables.set(newActor, newActorDisplay);
  }

  /**
   * Update an existing actor's state
   * @param existingActor The actor already present in the game
   * @param newState The new state to update the actor to
   */
  private updateActor(existingActor: Actor, newState: ActorState): void {
    if (newState.id === this.client.id) {
      this.updatePlayer(newState);
      return;
    }

    existingActor.position = newState.position;
    existingActor.velocity = newState.velocity;
    existingActor.rotation = newState.rotation;
    existingActor.size = newState.size;
  }

  /**
   * Remove an actor from the game and clean up its displayable representation
   * @param actor Actor to remove from the game
   */
  private removeActor(actor: Actor): void {
    this.game.actors = this.game.actors.filter((a) => a !== actor);
    this.displayables.delete(actor);
    this.game.controllers.delete(actor);

    if (actor === this.player) {
      this.player = undefined;
      this.camera = new DefaultCamera();
    }
  }

  /**
   * Update the player state
   * @param newState The new state received from the server
   */
  private updatePlayer(newState: ActorState): void {
    if (this.player === undefined) {
      return;
    }

    const distance = Math.sqrt(
      Math.pow(newState.position[0] - this.player.position[0], 2) +
      Math.pow(newState.position[1] - this.player.position[1], 2) +
      Math.pow(newState.position[2] - this.player.position[2], 2)
    );
    if (distance > 0.1) {
      console.log('Player is too far from server position');
      this.player.position = newState.position;
      this.player.velocity = newState.velocity;
    }
  }
}
