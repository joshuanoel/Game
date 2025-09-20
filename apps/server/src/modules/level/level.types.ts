type Vector3 = { x: number; y: number; z: number };

export type LevelComponent = {
    difficulty: number;
    startPosition: Vector3;
    endPosition: Vector3;
    platforms: {
        position: Vector3;
        size: Vector3;
    }[];
};