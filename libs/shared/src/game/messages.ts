import { Vector2, Vector3 } from "../math/vector";

export type ActorState = {
  id: string;
  type: 'player' | 'cube';
  position: Vector3;
  velocity: Vector3;
  rotation: Vector3;
  size: Vector3;
};

// Player action messages sent from client to server.
export type PlayerActionMessage = {
  timestamp: number;
  tick: number;
  actions: PlayerAction;
};

// Input state for a player.
export type PlayerAction = {
  // XZ  movement input
  // Range is [-1, 1]
  move: Vector2;

  // Look direction input
  look: Vector3;

  // Whether the player jumps
  jump: boolean;
}

// Actor update messages sent from server to clients.
export type ActorUpdateMessage = {
  timestamp: number;
  actors: ActorState[];
};

// Actor delete messages sent from server to clients.
export type ActorDeleteMessage = {
  timestamp: number;
  id: string;
};
