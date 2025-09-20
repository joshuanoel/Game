import { Module } from '@nestjs/common';
import { LEVEL_SERVICE_TOKEN } from './level.interface';
import { AIGenerationService } from './aiGeneration.service';
import { DummyLevelService } from './dummyLevel.service';

@Module({
  providers: [{
    provide: LEVEL_SERVICE_TOKEN,
    useClass: DummyLevelService,
  }],
  exports: [LEVEL_SERVICE_TOKEN],
})
export class LevelModule {}
