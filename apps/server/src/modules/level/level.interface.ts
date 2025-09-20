import { LevelComponent } from "./level.types";

export const LEVEL_SERVICE_TOKEN = Symbol('LEVEL_SERVICE');

export interface LevelService {
    GetComponent(desiredDifficulty: number): LevelComponent;
}