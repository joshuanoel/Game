import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { GameService } from '../game/game.service';
import { PlayerGateway } from './player.gateway';

@Module({
  imports: [GameModule],
  providers: [PlayerGateway],
  exports: [],
})
export class NetworkModule {}
