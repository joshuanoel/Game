import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { LevelModule } from '../level/level.module';

@Module({
  imports: [LevelModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
