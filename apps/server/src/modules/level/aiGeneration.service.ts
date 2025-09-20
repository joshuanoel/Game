import { Injectable } from '@nestjs/common';
import { LevelService } from './level.interface';
import { LevelComponent } from './level.types';

@Injectable()
export class AIGenerationService implements LevelService {
    GetComponent(desiredDifficulty: number): LevelComponent {
        throw new Error('Method not implemented.');
    }
}