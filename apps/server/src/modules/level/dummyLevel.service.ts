import { Injectable } from '@nestjs/common';
import { LevelService } from './level.interface';
import { LevelComponent } from './level.types';

@Injectable()
export class DummyLevelService implements LevelService {
    GetComponent(_: number): LevelComponent {
        return {
            difficulty: 1,
            startPosition: { x: 0, y: 0, z: 0 },
            endPosition: { x: 0, y: 0, z: 10 },
            platforms: [
                {
                    position: { x: 0, y: 0, z: 0 },
                    size: { x: 10, y: 1, z: 5 },
                },
            ],
        };
    }
}