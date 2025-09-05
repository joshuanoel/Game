import { Vector3 } from "../math/vector";

export type ActorState = {
  id: string;
  type: 'player' | 'cube';
  position: Vector3;
  velocity: Vector3;
  rotation: Vector3;
};

export type PlayerUpdateMessage = {
  timestamp: number;
  state: ActorState;
}

export type ActorUpdateMessage = {
  timestamp: number;
  actors : ActorState[];
};

export type ActorDeleteMessage = {
  timestamp: number;
  id: string;
};
