import { Actor } from './actor/actor';
import { Controller } from './controller/controller';

export class Game {
  actors: Actor[];
  controllers: Map<Actor, Controller>;

  constructor() {
    this.actors = [];
    this.controllers = new Map<Actor, Controller>();
  }

  reset() {
    this.actors = [];
    this.controllers.clear();
  }

  tick(dt: number): void {
    this.actors.forEach((actor) => {
      const controller = this.controllers.get(actor);
      if (controller) {
        controller.update(actor, dt);
      }
    });

    this.actors.forEach((actor) => actor.update(dt));
  }
}
