import { Actor } from '../actor/actor';

export interface Controller {
  update(actor: Actor, dt: number): void;
}
